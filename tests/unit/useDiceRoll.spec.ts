import { describe, it, expect, vi, afterEach } from 'vitest'
import { rollDice, pushRoll } from '@/composables/useDiceRoll'

describe('useDiceRoll', () => {
  describe('rollDice', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should generate valid results (1-6) for all dice', () => {
      // Run multiple times to increase confidence
      for (let i = 0; i < 100; i++) {
        const result = rollDice({ baseDice: 3, stressDice: 2 })

        expect(result.baseDiceResults).toHaveLength(3)
        expect(result.stressDiceResults).toHaveLength(2)

        result.baseDiceResults.forEach((die) => {
          expect(die).toBeGreaterThanOrEqual(1)
          expect(die).toBeLessThanOrEqual(6)
        })

        result.stressDiceResults.forEach((die) => {
          expect(die).toBeGreaterThanOrEqual(1)
          expect(die).toBeLessThanOrEqual(6)
        })
      }
    })

    it('should count successes correctly (only 6s)', () => {
      // Mock Math.random to control dice results
      const mockRandom = vi.spyOn(Math, 'random')

      // Set up to return: base dice [6, 4, 6], stress dice [6, 3]
      // random() * 6 + 1, so we need: (6-1)/6=0.833, (4-1)/6=0.5, (6-1)/6=0.833, (6-1)/6=0.833, (3-1)/6=0.333
      mockRandom
        .mockReturnValueOnce(0.999) // -> 6
        .mockReturnValueOnce(0.5)   // -> 4
        .mockReturnValueOnce(0.999) // -> 6
        .mockReturnValueOnce(0.999) // -> 6
        .mockReturnValueOnce(0.333) // -> 3

      const result = rollDice({ baseDice: 3, stressDice: 2 })

      expect(result.successes).toBe(3) // Three 6s
    })

    it('should detect panic when any stress die shows 1', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Set up: base dice [5, 5], stress dice [1, 5] - panic triggered
      mockRandom
        .mockReturnValueOnce(0.666) // -> 5
        .mockReturnValueOnce(0.666) // -> 5
        .mockReturnValueOnce(0)     // -> 1 (panic!)
        .mockReturnValueOnce(0.666) // -> 5

      const result = rollDice({ baseDice: 2, stressDice: 2 })

      expect(result.panicTriggered).toBe(true)
    })

    it('should not trigger panic when no stress die shows 1', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Set up: base dice [1, 1], stress dice [5, 6] - no panic (1s on base dice don't count)
      mockRandom
        .mockReturnValueOnce(0)     // -> 1 (base die, doesn't trigger panic)
        .mockReturnValueOnce(0)     // -> 1 (base die, doesn't trigger panic)
        .mockReturnValueOnce(0.666) // -> 5
        .mockReturnValueOnce(0.999) // -> 6

      const result = rollDice({ baseDice: 2, stressDice: 2 })

      expect(result.panicTriggered).toBe(false)
    })

    it('should not trigger panic when there are no stress dice', () => {
      const result = rollDice({ baseDice: 5, stressDice: 0 })

      expect(result.panicTriggered).toBe(false)
      expect(result.stressDiceResults).toHaveLength(0)
    })

    it('should handle zero base dice', () => {
      const result = rollDice({ baseDice: 0, stressDice: 3 })

      expect(result.baseDiceResults).toHaveLength(0)
      expect(result.stressDiceResults).toHaveLength(3)
    })

    it('should handle zero dice of both types', () => {
      const result = rollDice({ baseDice: 0, stressDice: 0 })

      expect(result.baseDiceResults).toHaveLength(0)
      expect(result.stressDiceResults).toHaveLength(0)
      expect(result.successes).toBe(0)
      expect(result.panicTriggered).toBe(false)
    })

    it('should count successes from both base and stress dice', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Set up: base dice [6], stress dice [6] - 2 successes total
      mockRandom
        .mockReturnValueOnce(0.999) // -> 6
        .mockReturnValueOnce(0.999) // -> 6

      const result = rollDice({ baseDice: 1, stressDice: 1 })

      expect(result.successes).toBe(2)
    })
  })

  describe('pushRoll', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should keep all 6s from original roll', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original result: base dice [6, 4, 6], stress dice [6, 3]
      // After push: kept base [6, 6], kept stress [6]
      // Re-rolled: 1 base die, 1 stress die, plus 1 new stress die
      // Mock returns for re-rolled dice: [5] for base, [4, 2] for stress (re-rolled + new)
      mockRandom
        .mockReturnValueOnce(0.666) // re-rolled base -> 5
        .mockReturnValueOnce(0.5)   // re-rolled stress -> 4
        .mockReturnValueOnce(0.166) // new stress die -> 2

      const previousResult = {
        baseDiceResults: [6, 4, 6],
        stressDiceResults: [6, 3],
        successes: 3,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      // Should have kept 6s: base has [6, 6] + new [5], stress has [6] + new [4, 2]
      expect(result.baseDiceResults).toContain(6)
      expect(result.baseDiceResults.filter((d) => d === 6).length).toBe(2)
      expect(result.stressDiceResults).toContain(6)
      expect(result.stressDiceResults.filter((d) => d === 6).length).toBe(1)
    })

    it('should re-roll correct number of non-6 dice', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original: base [6, 3, 2], stress [5, 4] - 2 base to re-roll, 2 stress to re-roll
      // Plus 1 new stress die = 5 total dice to roll
      mockRandom
        .mockReturnValueOnce(0.5)   // re-rolled base #1
        .mockReturnValueOnce(0.5)   // re-rolled base #2
        .mockReturnValueOnce(0.5)   // re-rolled stress #1
        .mockReturnValueOnce(0.5)   // re-rolled stress #2
        .mockReturnValueOnce(0.5)   // new stress die

      const previousResult = {
        baseDiceResults: [6, 3, 2],
        stressDiceResults: [5, 4],
        successes: 1,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      // Base: 1 kept (6) + 2 re-rolled = 3
      // Stress: 0 kept + 2 re-rolled + 1 new = 3
      expect(result.baseDiceResults).toHaveLength(3)
      expect(result.stressDiceResults).toHaveLength(3)
    })

    it('should add exactly 1 new stress die for push cost', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original: base [6], stress [6] - all 6s, nothing to re-roll except new stress die
      mockRandom.mockReturnValueOnce(0.5) // new stress die -> 4

      const previousResult = {
        baseDiceResults: [6],
        stressDiceResults: [6],
        successes: 2,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      // Base: 1 kept, Stress: 1 kept + 1 new = 2
      expect(result.baseDiceResults).toHaveLength(1)
      expect(result.stressDiceResults).toHaveLength(2)
    })

    it('should only check newly rolled stress dice for panic (kept 6s are safe)', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original: base [6], stress [6, 3] - stress 6 is kept, 3 is re-rolled
      // Re-roll the 3, plus add new stress die
      // Neither re-rolled nor new die shows 1
      mockRandom
        .mockReturnValueOnce(0.5)   // re-rolled stress -> 4
        .mockReturnValueOnce(0.5)   // new stress die -> 4

      const previousResult = {
        baseDiceResults: [6],
        stressDiceResults: [6, 3],
        successes: 2,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      // No panic because neither new dice shows 1
      expect(result.panicTriggered).toBe(false)
    })

    it('should trigger panic when re-rolled stress die shows 1', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original: base [6], stress [6, 3]
      // Re-roll the 3 -> 1 (panic!)
      mockRandom
        .mockReturnValueOnce(0)     // re-rolled stress -> 1 (panic!)
        .mockReturnValueOnce(0.5)   // new stress die -> 4

      const previousResult = {
        baseDiceResults: [6],
        stressDiceResults: [6, 3],
        successes: 2,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      expect(result.panicTriggered).toBe(true)
    })

    it('should trigger panic when new stress die shows 1', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original: base [6], stress [6] - all 6s kept
      // New stress die shows 1 (panic!)
      mockRandom.mockReturnValueOnce(0) // new stress die -> 1 (panic!)

      const previousResult = {
        baseDiceResults: [6],
        stressDiceResults: [6],
        successes: 2,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      expect(result.panicTriggered).toBe(true)
    })

    it('should set isPushed flag to true', () => {
      const mockRandom = vi.spyOn(Math, 'random')
      mockRandom.mockReturnValue(0.5)

      const previousResult = {
        baseDiceResults: [3],
        stressDiceResults: [4],
        successes: 0,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      expect(result.isPushed).toBe(true)
    })

    it('should calculate total successes correctly including kept dice', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original: base [6, 3], stress [6, 4] - 2 successes (kept)
      // Re-roll 3 and 4, plus new stress die
      // All re-rolls become 6s
      mockRandom
        .mockReturnValueOnce(0.999) // re-rolled base -> 6
        .mockReturnValueOnce(0.999) // re-rolled stress -> 6
        .mockReturnValueOnce(0.999) // new stress die -> 6

      const previousResult = {
        baseDiceResults: [6, 3],
        stressDiceResults: [6, 4],
        successes: 2,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      // 2 kept 6s + 3 new 6s = 5 successes
      expect(result.successes).toBe(5)
    })

    it('should handle push when original had no stress dice', () => {
      const mockRandom = vi.spyOn(Math, 'random')

      // Original: base [3, 4], stress [] - no stress dice
      // Re-roll both base dice, add 1 new stress die
      mockRandom
        .mockReturnValueOnce(0.5)   // re-rolled base #1 -> 4
        .mockReturnValueOnce(0.5)   // re-rolled base #2 -> 4
        .mockReturnValueOnce(0.5)   // new stress die -> 4

      const previousResult = {
        baseDiceResults: [3, 4],
        stressDiceResults: [],
        successes: 0,
        panicTriggered: false,
      }

      const result = pushRoll(previousResult)

      expect(result.baseDiceResults).toHaveLength(2)
      expect(result.stressDiceResults).toHaveLength(1) // Just the new stress die
    })
  })
})
