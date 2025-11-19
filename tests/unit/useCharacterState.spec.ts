import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useCharacterState } from '@/composables/useCharacterState'

describe('useCharacterState', () => {
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    // Mock localStorage
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
      })
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    })
  })

  it('should initialize with default character (empty name, 0 stress)', () => {
    const { character } = useCharacterState()

    expect(character.value.name).toBe('')
    expect(character.value.stress).toBe(0)
  })

  it('should load existing character from localStorage', () => {
    localStorageMock['character'] = JSON.stringify({
      name: 'Ellen Ripley',
      stress: 5
    })

    const { character } = useCharacterState()

    expect(character.value.name).toBe('Ellen Ripley')
    expect(character.value.stress).toBe(5)
  })

  it('should update character name and reset stress to 0', async () => {
    const { character, updateName } = useCharacterState()

    // Set initial stress
    character.value = { name: 'Test', stress: 7 }
    await nextTick()

    // Update name should reset stress
    updateName('New Character')
    await nextTick()

    expect(character.value.name).toBe('New Character')
    expect(character.value.stress).toBe(0)
  })

  it('should increment stress', async () => {
    const { character, incrementStress } = useCharacterState()

    character.value = { name: 'Test', stress: 3 }
    await nextTick()

    incrementStress()
    await nextTick()

    expect(character.value.stress).toBe(4)
  })

  it('should increment stress multiple times', async () => {
    const { character, incrementStress } = useCharacterState()

    character.value = { name: 'Test', stress: 0 }
    await nextTick()

    incrementStress()
    incrementStress()
    incrementStress()
    await nextTick()

    expect(character.value.stress).toBe(3)
  })

  it('should decrement stress', async () => {
    const { character, decrementStress } = useCharacterState()

    character.value = { name: 'Test', stress: 5 }
    await nextTick()

    decrementStress()
    await nextTick()

    expect(character.value.stress).toBe(4)
  })

  it('should not decrement stress below 0', async () => {
    const { character, decrementStress } = useCharacterState()

    character.value = { name: 'Test', stress: 0 }
    await nextTick()

    decrementStress()
    decrementStress()
    await nextTick()

    expect(character.value.stress).toBe(0)
  })

  it('should reset stress to 0', async () => {
    const { character, resetStress } = useCharacterState()

    character.value = { name: 'Test', stress: 10 }
    await nextTick()

    resetStress()
    await nextTick()

    expect(character.value.stress).toBe(0)
    expect(character.value.name).toBe('Test') // Name should remain unchanged
  })

  it('should persist changes to localStorage', async () => {
    const { character, incrementStress } = useCharacterState()

    character.value = { name: 'Ripley', stress: 0 }
    await nextTick()

    incrementStress()
    await nextTick()

    const stored = JSON.parse(localStorageMock['character'])
    expect(stored).toEqual({ name: 'Ripley', stress: 1 })
  })

  it('should handle stress values above 10 (no upper limit per Alien RPG rules)', async () => {
    const { character, incrementStress } = useCharacterState()

    character.value = { name: 'Test', stress: 15 }
    await nextTick()

    incrementStress()
    await nextTick()

    expect(character.value.stress).toBe(16)
  })

  it('should preserve character name when manipulating stress', async () => {
    const { character, incrementStress, decrementStress, resetStress } = useCharacterState()

    character.value = { name: 'Ellen Ripley', stress: 5 }
    await nextTick()

    incrementStress()
    await nextTick()
    expect(character.value.name).toBe('Ellen Ripley')

    decrementStress()
    await nextTick()
    expect(character.value.name).toBe('Ellen Ripley')

    resetStress()
    await nextTick()
    expect(character.value.name).toBe('Ellen Ripley')
  })
})
