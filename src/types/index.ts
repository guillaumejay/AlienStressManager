/**
 * Shared TypeScript types for Character Stress Tracker
 * Source: contracts/types.ts (design phase)
 */

import type { Ref } from 'vue'

// ============================================================================
// Domain Entities
// ============================================================================

export interface Character {
  name: string
  stress: number
}

export type ActionType = 'increment' | 'decrement' | 'reset'

export interface ActionLogEntry {
  timestamp: string // ISO 8601 format
  action: ActionType
  resultingStress: number
}

export type Locale = 'en' | 'fr'

// ============================================================================
// Composable Return Types
// ============================================================================

export interface UseCharacterStateReturn {
  character: Ref<Character>
  updateName: (newName: string) => void
  incrementStress: () => void
  decrementStress: () => void
  resetStress: () => void
}

export interface UseActionLogReturn {
  entries: Readonly<Ref<ActionLogEntry[]>>
  logAction: (action: ActionType, resultingStress: number) => void
  clearLog: () => void
}

export interface UseLocalStorageReturn<T> {
  storedValue: Ref<T>
  setStoredValue: (value: T) => void
  error: Readonly<Ref<Error | null>>
}

export interface UseI18nReturn {
  t: (key: string) => string
  locale: Ref<Locale>
  setLocale: (newLocale: Locale) => void
}

// ============================================================================
// Component Props & Emits
// ============================================================================

export interface ActionLogProps {
  entries: ActionLogEntry[]
  isVisible: boolean
}

export interface ActionLogEmits {
  (e: 'toggle'): void
}

export interface LanguageSelectorProps {
  modelValue: Locale
}

export interface LanguageSelectorEmits {
  (e: 'update:modelValue', locale: Locale): void
}

// ============================================================================
// Utility Types & Constants
// ============================================================================

export const STORAGE_KEYS = {
  CHARACTER: 'character',
  LANGUAGE_PREFERENCE: 'languagePreference',
} as const

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'fr'
}

export function isActionType(value: string): value is ActionType {
  return value === 'increment' || value === 'decrement' || value === 'reset'
}

export const DEFAULT_CHARACTER: Character = {
  name: '',
  stress: 0,
}

export const DEFAULT_LOCALE: Locale = 'en'
