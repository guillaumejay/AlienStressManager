/**
 * Type Contracts: Character Stress Tracker
 * Path: kitty-specs/001-character-stress-tracker/contracts/types.ts
 *
 * Core TypeScript interfaces and types for the Character Stress Tracker feature.
 * These types serve as contracts between composables, components, and storage layers.
 *
 * Generated: 2025-11-19
 * Phase: Phase 1B (Design & Contracts)
 */

import type { Ref } from 'vue'

// ============================================================================
// Domain Entities
// ============================================================================

/**
 * Represents a character being tracked during an Alien RPG game session.
 *
 * Storage: localStorage (key: 'character')
 * Lifecycle: Created on name entry, updated on stress changes, reset on name edit
 */
export interface Character {
  /** Character's name entered by the player (required, non-empty) */
  name: string
  /** Current stress level (non-negative integer, no upper limit per Alien RPG rules) */
  stress: number
}

/**
 * Type of stress manipulation action performed by the user.
 */
export type ActionType = 'increment' | 'decrement' | 'reset'

/**
 * Represents a single stress manipulation event in the action history log.
 *
 * Storage: In-memory only (session-scoped, not persisted)
 * Lifecycle: Created on stress action, cleared on name edit or app reload
 */
export interface ActionLogEntry {
  /** ISO 8601 datetime when the action occurred (displayed as HH:MM in UI) */
  timestamp: string
  /** Type of stress manipulation performed */
  action: ActionType
  /** Stress level after the action completed (≥ 0) */
  resultingStress: number
}

/**
 * Supported UI locales for internationalization.
 */
export type Locale = 'en' | 'fr'

// ============================================================================
// Composable Return Types
// ============================================================================

/**
 * Return type for useCharacterState composable.
 *
 * Manages character state with reactive updates and localStorage persistence.
 */
export interface UseCharacterStateReturn {
  /** Reactive character state (name + stress) */
  character: Ref<Character>
  /** Update character name (triggers stress reset to 0 and log clear) */
  updateName: (newName: string) => void
  /** Increment stress by 1 */
  incrementStress: () => void
  /** Decrement stress by 1 (clamped to 0 minimum) */
  decrementStress: () => void
  /** Reset stress to 0 */
  resetStress: () => void
}

/**
 * Return type for useActionLog composable.
 *
 * Manages session-scoped action history log (in-memory, not persisted).
 */
export interface UseActionLogReturn {
  /** Readonly array of log entries (reverse chronological - newest first) */
  entries: Readonly<Ref<ActionLogEntry[]>>
  /** Log a stress action with timestamp and resulting stress value */
  logAction: (action: ActionType, resultingStress: number) => void
  /** Clear all log entries (e.g., on character name change) */
  clearLog: () => void
}

/**
 * Return type for useLocalStorage composable.
 *
 * Generic localStorage persistence with error handling and cross-tab sync.
 *
 * @template T - Type of value stored in localStorage (must be JSON-serializable)
 */
export interface UseLocalStorageReturn<T> {
  /** Reactive stored value (synced with localStorage) */
  storedValue: Ref<T>
  /** Update stored value (triggers localStorage write) */
  setStoredValue: (value: T) => void
  /** Error state (null if no error, Error object if localStorage operation failed) */
  error: Readonly<Ref<Error | null>>
}

/**
 * Return type for useI18n composable (wraps vue-i18n).
 *
 * Manages locale selection with localStorage persistence.
 */
export interface UseI18nReturn {
  /** Translation function (key → localized string) */
  t: (key: string) => string
  /** Current locale (reactive) */
  locale: Ref<Locale>
  /** Set locale and persist to localStorage */
  setLocale: (newLocale: Locale) => void
}

// ============================================================================
// Component Props & Emits
// ============================================================================

/**
 * Props for ActionLog component.
 */
export interface ActionLogProps {
  /** Array of action log entries to display */
  entries: ActionLogEntry[]
  /** Whether the log is currently visible */
  isVisible: boolean
}

/**
 * Events emitted by ActionLog component.
 */
export interface ActionLogEmits {
  /** Emitted when user clicks toggle button to show/hide log */
  (e: 'toggle'): void
}

/**
 * Props for LanguageSelector component.
 */
export interface LanguageSelectorProps {
  /** Currently selected locale */
  modelValue: Locale
}

/**
 * Events emitted by LanguageSelector component.
 */
export interface LanguageSelectorEmits {
  /** Emitted when user selects a different language */
  (e: 'update:modelValue', locale: Locale): void
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * localStorage keys used by the application.
 */
export const STORAGE_KEYS = {
  CHARACTER: 'character',
  LANGUAGE_PREFERENCE: 'languagePreference'
} as const

/**
 * Type guard to check if a string is a valid Locale.
 */
export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'fr'
}

/**
 * Type guard to check if a string is a valid ActionType.
 */
export function isActionType(value: string): value is ActionType {
  return value === 'increment' || value === 'decrement' || value === 'reset'
}

/**
 * Default Character value (used for initialization).
 */
export const DEFAULT_CHARACTER: Character = {
  name: '',
  stress: 0
}

/**
 * Default Locale value (fallback if browser locale detection fails).
 */
export const DEFAULT_LOCALE: Locale = 'en'
