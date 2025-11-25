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
  hasNerveOfSteel: boolean
}

export interface PanicEffect {
  name: string
  description: string
  stressChange?: number
  otherStressChange?: number
  actionLoss?: 'slow' | 'all'
  notes?: string
}

export interface PanicRollResult {
  roll: number
  effect: PanicEffect
}

export interface DiceRollConfig {
  baseDice: number
  stressDice: number
}

export interface DiceRollResult {
  baseDiceResults: number[]
  stressDiceResults: number[]
  successes: number
  panicTriggered: boolean
  isPushed?: boolean
}

export interface DiceRollDetails {
  baseDiceResults: number[]
  stressDiceResults: number[]
  successes: number
  panicTriggered: boolean
  isPushed?: boolean
  keptDice?: {
    baseDice: number[]
    stressDice: number[]
  }
}

export type ActionType = 'increment' | 'decrement' | 'reset' | 'panic' | 'diceRoll' | 'pushRoll'

export interface PanicRollDetails {
  dieRoll: number
  stressBefore: number
  modifier: number
  finalRoll: number
  effectName: string
}

export interface ActionLogEntry {
  timestamp: string // ISO 8601 format
  action: ActionType
  resultingStress: number
  panicDetails?: PanicRollDetails
  diceRollDetails?: DiceRollDetails
  fromPanic?: boolean
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
  toggleNerveOfSteel: () => void
  panicRoll: () => PanicRollResult
}

export interface UseActionLogReturn {
  entries: Readonly<Ref<ActionLogEntry[]>>
  logAction: (
    action: ActionType,
    resultingStress: number,
    panicDetails?: PanicRollDetails,
    fromPanic?: boolean,
    diceRollDetails?: DiceRollDetails
  ) => void
  clearLog: () => void
}

export interface UseLocalStorageReturn<T> {
  storedValue: Ref<T>
  setStoredValue: (value: T) => void
  error: Readonly<Ref<Error | null>>
}

export interface UseI18nReturn {
  t: (key: string) => string
  tm: (key: string) => any
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
  return value === 'increment' || value === 'decrement' || value === 'reset' || value === 'panic' || value === 'diceRoll' || value === 'pushRoll'
}

export const DEFAULT_CHARACTER: Character = {
  name: '',
  stress: 0,
  hasNerveOfSteel: false,
}

export const DEFAULT_LOCALE: Locale = 'en'
