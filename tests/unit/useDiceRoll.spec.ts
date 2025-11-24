import { describe, it, expect, vi, afterEach } from 'vitest'
import { rollDice } from '@/composables/useDiceRoll'

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
})
