import { ref, computed } from 'vue'
import type { UseActionLogReturn, ActionType, ActionLogEntry } from '@/types'

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
  const logEntries = ref<ActionLogEntry[]>([])

  /**
   * Entries in reverse chronological order (newest first)
   */
  const entries = computed(() => [...logEntries.value].reverse())

  /**
   * Log a stress action with current timestamp
   *
   * @param action - Type of action performed
   * @param resultingStress - Stress level after the action
   */
  function logAction(action: ActionType, resultingStress: number): void {
    const entry: ActionLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      resultingStress,
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
