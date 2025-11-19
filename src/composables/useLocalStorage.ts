import { ref, watchEffect, readonly, type Ref } from 'vue'
import type { UseLocalStorageReturn } from '@/types'

/**
 * Generic localStorage persistence composable with reactive sync and error handling
 *
 * @template T - Type of value to store (must be JSON-serializable)
 * @param key - localStorage key
 * @param defaultValue - Default value if key not found in localStorage
 * @returns Reactive localStorage wrapper with error handling
 */
export function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturn<T> {
  const error = ref<Error | null>(null)
  const storedValue = ref<T>(defaultValue) as Ref<T>

  /**
   * Initialize value from localStorage
   */
  function loadFromStorage(): void {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        storedValue.value = JSON.parse(item) as T
      }
      error.value = null
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to load from localStorage')
      console.error(`[useLocalStorage] Failed to load key "${key}":`, e)
    }
  }

  /**
   * Save value to localStorage
   */
  function saveToStorage(value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      error.value = null
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        error.value = new Error('localStorage quota exceeded')
      } else {
        error.value = e instanceof Error ? e : new Error('Failed to save to localStorage')
      }
      console.error(`[useLocalStorage] Failed to save key "${key}":`, e)
    }
  }

  /**
   * Manually set stored value (triggers reactive save)
   */
  function setStoredValue(value: T): void {
    storedValue.value = value
  }

  // Initialize from localStorage on mount
  loadFromStorage()

  // Reactive save: whenever storedValue changes, write to localStorage
  watchEffect(() => {
    saveToStorage(storedValue.value)
  })

  // Cross-tab sync: listen for StorageEvent from other tabs
  function handleStorageEvent(e: StorageEvent): void {
    if (e.key === key && e.newValue !== null) {
      try {
        storedValue.value = JSON.parse(e.newValue) as T
        error.value = null
      } catch (err) {
        error.value = err instanceof Error ? err : new Error('Failed to parse storage event')
        console.error(`[useLocalStorage] Failed to parse storage event for key "${key}":`, err)
      }
    }
  }

  window.addEventListener('storage', handleStorageEvent)

  return {
    storedValue,
    setStoredValue,
    error: readonly(error),
  }
}
