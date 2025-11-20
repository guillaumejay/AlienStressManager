import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useCharacterState } from '@/composables/useCharacterState'
import type { PanicEffect } from '@/types'

// Mock i18n composable
const mockPanicTable: Record<string, PanicEffect> = {
  '1': { name: 'KEEPING IT TOGETHER', description: 'You manage to keep your nerves in check. Barely.' },
  '7': {
    name: 'NERVOUS TWITCH',
    description: 'Your STRESS LEVEL, and the STRESS LEVEL of all friendly PCs in SHORT range of you, increases by one.',
    stressChange: 1,
    otherStressChange: 1,
  },
  '10': {
    name: 'FREEZE',
    description: "You're frozen by fear or stress for one Round, losing your next slow action. Your STRESS LEVEL, and the STRESS LEVEL of all friendly PCs in SHORT range of you, increases by one.",
    stressChange: 1,
    otherStressChange: 1,
    actionLoss: true,
  },
  '15': {
    name: 'CATATONIC',
    description: "You collapse to the floor and can't talk or move, staring blankly into oblivion.",
    actionLoss: true,
  },
}

vi.mock('@/composables/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    tm: (key: string) => {
      if (key === 'app.panic.panicTable') {
        return mockPanicTable
      }
      return {}
    },
    locale: { value: 'en' },
    setLocale: vi.fn(),
  }),
}))

describe('useCharacterState', () => {
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    localStorageMock = {}
    const mockStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key]
      }),
      clear: vi.fn(() => {
        localStorageMock = {}
      }),
    }
    Object.defineProperty(window, 'localStorage', { value: mockStorage, writable: true })
    vi.spyOn(Math, 'random').mockReturnValue(0) // Die roll will always be 1
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default character (including hasNerveOfSteel: false)', () => {
    const { character } = useCharacterState()
    expect(character.value.name).toBe('')
    expect(character.value.stress).toBe(0)
    expect(character.value.hasNerveOfSteel).toBe(false)
  })

  it('should load existing character from localStorage (including hasNerveOfSteel)', () => {
    localStorageMock['character'] = JSON.stringify({
      name: 'Ellen Ripley',
      stress: 5,
      hasNerveOfSteel: true,
    })
    const { character } = useCharacterState()
    expect(character.value.name).toBe('Ellen Ripley')
    expect(character.value.stress).toBe(5)
    expect(character.value.hasNerveOfSteel).toBe(true)
  })

  it('should update character name and reset stress, but preserve hasNerveOfSteel', async () => {
    const { character, updateName } = useCharacterState()
    character.value = { name: 'Test', stress: 7, hasNerveOfSteel: true }
    await nextTick()
    updateName('New Character')
    await nextTick()
    expect(character.value.name).toBe('New Character')
    expect(character.value.stress).toBe(0)
    expect(character.value.hasNerveOfSteel).toBe(true)
  })

  it('should toggle hasNerveOfSteel', async () => {
    const { character, toggleNerveOfSteel } = useCharacterState()
    expect(character.value.hasNerveOfSteel).toBe(false)
    toggleNerveOfSteel()
    await nextTick()
    expect(character.value.hasNerveOfSteel).toBe(true)
    toggleNerveOfSteel()
    await nextTick()
    expect(character.value.hasNerveOfSteel).toBe(false)
  })

  it('should persist hasNerveOfSteel changes to localStorage', async () => {
    const { character, toggleNerveOfSteel } = useCharacterState()
    character.value = { name: 'Parker', stress: 3, hasNerveOfSteel: false }
    await nextTick()
    toggleNerveOfSteel()
    await nextTick()
    const stored = JSON.parse(localStorageMock['character'])
    expect(stored.hasNerveOfSteel).toBe(true)
  })

  describe('panicRoll', () => {
    it('should perform a panic roll and return the result', () => {
      const { character, panicRoll } = useCharacterState()
      character.value = { name: 'Test', stress: 6, hasNerveOfSteel: false }
      const result = panicRoll()
      expect(result.roll).toBe(7) // 1 (die) + 6 (stress)
      expect(result.effect.name).toBe('NERVOUS TWITCH')
    })

    it('should apply Nerve of Steel modifier', () => {
      const { character, panicRoll } = useCharacterState()
      character.value = { name: 'Test', stress: 8, hasNerveOfSteel: true }
      const result = panicRoll()
      expect(result.roll).toBe(7) // 1 (die) + 8 (stress) - 2 (talent)
      expect(result.effect.name).toBe('NERVOUS TWITCH')
    })

    it('should not let the roll go below 1', () => {
      const { character, panicRoll } = useCharacterState()
      character.value = { name: 'Test', stress: 0, hasNerveOfSteel: true }
      const result = panicRoll()
      expect(result.roll).toBe(1) // 1 (die) + 0 (stress) - 2 (talent) = -1 -> 1
      expect(result.effect.name).toBe('KEEPING IT TOGETHER')
    })

    it('should apply stress changes from the panic effect', async () => {
      const { character, panicRoll } = useCharacterState()
      character.value = { name: 'Test', stress: 6, hasNerveOfSteel: false } // Roll = 7
      panicRoll()
      await nextTick()
      expect(character.value.stress).toBe(7) // 6 + 1 (from NERVOUS TWITCH)
    })

    it('should handle negative stress changes', async () => {
      const { character, panicRoll } = useCharacterState()
      character.value = { name: 'Test', stress: 9, hasNerveOfSteel: false } // Roll = 10
      panicRoll()
      await nextTick()
      expect(character.value.stress).toBe(10) // 9 + 1 (from FREEZE)
    })

    it('should not let stress go below 0 after a panic effect', async () => {
      const { character, panicRoll } = useCharacterState()
      character.value = { name: 'Test', stress: 9, hasNerveOfSteel: false }
      // Manually set a high negative stress change on the effect
      mockPanicTable['10'].stressChange = -100
      panicRoll()
      await nextTick()
      expect(character.value.stress).toBe(0)
    })

    it('should use the highest effect for rolls over 15', () => {
      const { character, panicRoll } = useCharacterState()
      character.value = { name: 'Test', stress: 20, hasNerveOfSteel: false } // Roll = 21
      const result = panicRoll()
      expect(result.roll).toBe(21)
      expect(result.effect.name).toBe('CATATONIC')
    })
  })
})