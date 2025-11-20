import { useLocalStorage } from './useLocalStorage'
import { useI18n } from './useI18n'
import { useActionLog } from './useActionLog'
import { STORAGE_KEYS, DEFAULT_CHARACTER } from '@/types'
import type {
  UseCharacterStateReturn,
  Character,
  PanicRollResult,
  PanicEffect,
  PanicRollDetails,
} from '@/types'

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
  const { tm } = useI18n()
  const { logAction } = useActionLog()

  /**
   * Update character name
   * Side effect: Resets stress to 0 when name changes
   *
   * @param newName - New character name
   */
  function updateName(newName: string): void {
    character.value = {
      ...character.value,
      name: newName,
      stress: 0,
    }
  }

  /**
   * Toggle Nerve of Steel status
   */
  function toggleNerveOfSteel(): void {
    character.value = {
      ...character.value,
      hasNerveOfSteel: !character.value.hasNerveOfSteel,
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
    logAction('increment', character.value.stress)
  }

  /**
   * Decrement stress by 1 (minimum 0)
   */
  function decrementStress(): void {
    character.value = {
      ...character.value,
      stress: Math.max(0, character.value.stress - 1),
    }
    logAction('decrement', character.value.stress)
  }

  /**
   * Reset stress to 0
   */
  function resetStress(): void {
    character.value = {
      ...character.value,
      stress: 0,
    }
    logAction('reset', character.value.stress)
  }

  /**
   * Perform a panic roll
   */
  function panicRoll(): PanicRollResult {
    const stressBefore = character.value.stress
    const dieRoll = Math.floor(Math.random() * 6) + 1
    const modifier = character.value.hasNerveOfSteel ? -2 : 0
    const finalRoll = Math.max(1, dieRoll + stressBefore + modifier)

    const panicTable = tm('app.panic.panicTable')
    const effectIndex = Math.min(finalRoll, 15).toString()
    const effect: PanicEffect = panicTable[effectIndex]

    const panicDetails: PanicRollDetails = {
      dieRoll,
      stressBefore,
      modifier,
      finalRoll,
      effectName: effect.name,
    }

    logAction('panic', stressBefore, panicDetails)

    if (effect.stressChange) {
      const resultingStress = Math.max(0, stressBefore + effect.stressChange)
      character.value = {
        ...character.value,
        stress: resultingStress,
      }
      logAction(
        effect.stressChange > 0 ? 'increment' : 'decrement',
        resultingStress,
        undefined,
        true
      )
    }

    return {
      roll: finalRoll,
      effect,
    }
  }

  return {
    character,
    updateName,
    incrementStress,
    decrementStress,
    resetStress,
    toggleNerveOfSteel,
    panicRoll,
  }
}
