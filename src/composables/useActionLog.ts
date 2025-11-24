import { ref, computed } from 'vue'
import type {
  UseActionLogReturn,
  ActionType,
  ActionLogEntry,
  PanicRollDetails,
  DiceRollDetails,
} from '@/types'

const logEntries = ref<ActionLogEntry[]>([])

/**
 * Action log management composable (session-scoped, in-memory only)
 *
 * Tracks stress manipulation actions with timestamps.
 * Entries displayed in reverse chronological order (newest first).
 * Log clears on character name change or app reload.
 *
 * @returns Action log entries and manipulation functions
 */
export function useActionLog(): UseActionLogReturn {

  /**
   * Entries in reverse chronological order (newest first)
   */
  const entries = computed(() => [...logEntries.value].reverse())

  /**
   * Log a stress action with current timestamp
   *
   * @param action - Type of action performed
   * @param resultingStress - Stress level after the action
   * @param panicDetails - Details for panic roll actions
   * @param fromPanic - Whether this action resulted from a panic effect
   * @param diceRollDetails - Details for dice roll actions
   */
  function logAction(
    action: ActionType,
    resultingStress: number,
    panicDetails?: PanicRollDetails,
    fromPanic?: boolean,
    diceRollDetails?: DiceRollDetails
  ): void {
    const entry: ActionLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      resultingStress,
      panicDetails,
      diceRollDetails,
      fromPanic,
    }

    logEntries.value.push(entry)
  }

  /**
   * Clear all log entries (e.g., on character name change)
   */
  function clearLog(): void {
    logEntries.value = []
  }

  return {
    entries,
    logAction,
    clearLog,
  }
}
