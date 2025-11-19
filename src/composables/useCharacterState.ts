import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, DEFAULT_CHARACTER } from '@/types'
import type { UseCharacterStateReturn, Character } from '@/types'

/**
 * Character state management composable with localStorage persistence
 *
 * Manages character name and stress level with automatic persistence.
 * Updating the character name resets stress to 0.
 *
 * @returns Character state and manipulation functions
 */
export function useCharacterState(): UseCharacterStateReturn {
  const { storedValue: character } = useLocalStorage<Character>(
    STORAGE_KEYS.CHARACTER,
    DEFAULT_CHARACTER,
  )

  /**
   * Update character name
   * Side effect: Resets stress to 0 when name changes
   *
   * @param newName - New character name
   */
  function updateName(newName: string): void {
    character.value = {
      name: newName,
      stress: 0,
    }
  }

  /**
   * Increment stress by 1
   */
  function incrementStress(): void {
    character.value = {
      ...character.value,
      stress: character.value.stress + 1,
    }
  }

  /**
   * Decrement stress by 1 (minimum 0)
   */
  function decrementStress(): void {
    character.value = {
      ...character.value,
      stress: Math.max(0, character.value.stress - 1),
    }
  }

  /**
   * Reset stress to 0
   */
  function resetStress(): void {
    character.value = {
      ...character.value,
      stress: 0,
    }
  }

  return {
    character,
    updateName,
    incrementStress,
    decrementStress,
    resetStress,
  }
}
