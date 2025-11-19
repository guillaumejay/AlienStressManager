---
work_package_id: WP01
title: Setup & Foundation
lane: done
priority: P0
agent: claude
assignee: claude
shell_pid: implementation-session-2025-11-19
subtasks:
  - T001
  - T002
  - T003
  - T004
  - T005
  - T006
  - T007
  - T008
history:
  - date: 2025-11-19
    action: created
    agent: spec-kitty tasks generator
  - date: 2025-11-19
    action: started
    agent: claude
    notes: "Began WP01 implementation - directory structure, Tailwind theme, i18n setup"
  - date: 2025-11-19
    action: completed
    agent: claude
    notes: "All 8 tasks completed: directory structure, Tailwind 4 SF/Alien theme, TypeScript types, i18n config, translations (en/fr), main.ts integration, App.vue theming. Type-check and dev server validation passed."
---

# Work Package WP01: Setup & Foundation

**Priority**: P0 (Foundational)
**Status**: Planned
**Estimated Effort**: 2-3 hours

## Objective

Establish the project structure, Tailwind 4 SF/Alien theming system, vue-i18n configuration with French/English support, and shared TypeScript type definitions. This work package creates the foundation for all subsequent implementation.

## Context

This is a Vue 3 + Tailwind 4 + TypeScript single-page application for tracking character stress in Alien RPG sessions. The application must be fully offline-capable (local-first), support French and English languages, and use a dark SF/Alien aesthetic consistent with the Alien film franchise.

**Key Design Decisions** (from research.md):
- Tailwind 4 `@theme` directive for CSS custom properties
- vue-i18n Composition API mode with browser locale detection
- TypeScript types copied from `contracts/types.ts` as starting point

**Constitution Requirements**:
- Responsive design (mobile-first, 320px/768px/1024px+ breakpoints)
- Internationalization first (French + English, no hard-coded strings)
- Type safety (explicit TypeScript annotations, no `any`)

## Detailed Implementation Guidance

### T001: Create Directory Structure

**Files to Create**:
```
src/
├── components/        # Vue SFC components
├── composables/       # Composition API composables
├── i18n/             # Internationalization
│   └── locales/      # Translation JSON files
├── types/            # Shared TypeScript types
└── (existing: App.vue, main.ts, style.css)

tests/
├── unit/             # Composable unit tests
└── components/       # Component tests
```

**Command**:
```bash
mkdir -p src/components src/composables src/i18n/locales src/types tests/unit tests/components
```

**Acceptance**:
- [ ] All directories exist
- [ ] Directory structure matches plan.md layout

---

### T002: Setup Tailwind 4 Theme with SF/Alien Color Palette

**File**: `src/style.css`

**Implementation**:

Replace or update the existing `src/style.css` with:

```css
@import "tailwindcss";

@theme {
  /* SF/Alien Color Palette - Dark, Industrial, Futuristic */

  /* Background Colors */
  --color-alien-bg-primary: #0a0e14;       /* Deep space black */
  --color-alien-bg-secondary: #151b23;     /* Panel gray */
  --color-alien-bg-tertiary: #1f2937;      /* Slightly lighter panel */

  /* Accent Colors */
  --color-alien-accent: #2d8f5f;           /* Xenomorph green */
  --color-alien-accent-hover: #3ba86e;     /* Brighter green on hover */
  --color-alien-danger: #c23616;           /* Emergency red */
  --color-alien-warning: #f39c12;          /* Alert amber */

  /* Text Colors */
  --color-alien-text: #d4d7dd;             /* Light gray text */
  --color-alien-text-dim: #7a8190;         /* Dimmed text */
  --color-alien-text-bright: #ffffff;      /* Pure white for emphasis */

  /* Border & Divider Colors */
  --color-alien-border: #2d3748;           /* Subtle border */
  --color-alien-border-bright: #4a5568;    /* Emphasized border */
}

/* Global Styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}
```

**Usage Pattern** (example for components):
```vue
<template>
  <div class="bg-[var(--color-alien-bg-primary)] text-[var(--color-alien-text)]">
    <button class="bg-[var(--color-alien-accent)] hover:bg-[var(--color-alien-accent-hover)]">
      Button
    </button>
  </div>
</template>
```

**Acceptance**:
- [ ] `@theme` directive defines all color variables
- [ ] Colors match research.md specifications
- [ ] CSS compiles without errors (test with `npm run dev`)

---

### T003: Create Shared TypeScript Types

**File**: `src/types/index.ts`

**Implementation**:

Copy type definitions from `contracts/types.ts` as starting point:

```typescript
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
  LANGUAGE_PREFERENCE: 'languagePreference'
} as const

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'fr'
}

export function isActionType(value: string): value is ActionType {
  return value === 'increment' || value === 'decrement' || value === 'reset'
}

export const DEFAULT_CHARACTER: Character = {
  name: '',
  stress: 0
}

export const DEFAULT_LOCALE: Locale = 'en'
```

**Acceptance**:
- [ ] All types exported from single `src/types/index.ts`
- [ ] No TypeScript errors when importing types
- [ ] Type guards (`isLocale`, `isActionType`) included

---

### T004: Setup i18n Configuration

**File**: `src/i18n/index.ts`

**Implementation**:

```typescript
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import { isLocale, DEFAULT_LOCALE } from '@/types'
import type { Locale } from '@/types'

/**
 * Detect user's preferred locale from browser settings
 * Fallback chain: navigator.language → DEFAULT_LOCALE ('en')
 */
function detectLocale(): Locale {
  try {
    const browserLocale = navigator.language.split('-')[0] // e.g., 'en-US' → 'en'
    return isLocale(browserLocale) ? browserLocale : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

/**
 * Create vue-i18n instance with Composition API mode
 */
export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
})
```

**Acceptance**:
- [ ] i18n instance created with Composition API mode (`legacy: false`)
- [ ] Browser locale detection implemented with fallback to 'en'
- [ ] Both `en` and `fr` messages imported

---

### T005: Create English Translations

**File**: `src/i18n/locales/en.json`

**Implementation**:

```json
{
  "app": {
    "title": "Stress Tracker",
    "characterName": "Character Name",
    "characterNamePlaceholder": "Enter character name",
    "stress": "Stress",
    "actions": {
      "increment": "Increase",
      "decrement": "Decrease",
      "reset": "Reset"
    },
    "actionLog": {
      "title": "Action History",
      "toggle": "Toggle History",
      "empty": "No actions recorded yet",
      "incrementLabel": "+1",
      "decrementLabel": "-1",
      "resetLabel": "Reset to 0"
    },
    "language": {
      "label": "Language",
      "en": "English",
      "fr": "French"
    },
    "errors": {
      "storageUnavailable": "Warning: Data will not be saved. Enable localStorage or use regular browsing mode."
    }
  }
}
```

**Acceptance**:
- [ ] All UI strings covered (character name, stress controls, action log, language selector, errors)
- [ ] Nested structure matches research.md example
- [ ] JSON valid (no syntax errors)

---

### T006: Create French Translations

**File**: `src/i18n/locales/fr.json`

**Implementation**:

```json
{
  "app": {
    "title": "Suivi du Stress",
    "characterName": "Nom du Personnage",
    "characterNamePlaceholder": "Entrez le nom du personnage",
    "stress": "Stress",
    "actions": {
      "increment": "Augmenter",
      "decrement": "Diminuer",
      "reset": "Réinitialiser"
    },
    "actionLog": {
      "title": "Historique des Actions",
      "toggle": "Basculer l'Historique",
      "empty": "Aucune action enregistrée",
      "incrementLabel": "+1",
      "decrementLabel": "-1",
      "resetLabel": "Réinitialisation à 0"
    },
    "language": {
      "label": "Langue",
      "en": "Anglais",
      "fr": "Français"
    },
    "errors": {
      "storageUnavailable": "Avertissement : Les données ne seront pas sauvegardées. Activez localStorage ou utilisez le mode de navigation normal."
    }
  }
}
```

**Acceptance**:
- [ ] All keys match `en.json` structure exactly
- [ ] French translations accurate and natural (Alien RPG terminology)
- [ ] JSON valid (no syntax errors)

---

### T007: Integrate i18n in main.ts

**File**: `src/main.ts`

**Implementation**:

Update existing `main.ts` to include i18n:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import './style.css'

const app = createApp(App)

app.use(i18n)

app.mount('#app')
```

**Acceptance**:
- [ ] `app.use(i18n)` called before `app.mount()`
- [ ] Application starts without errors
- [ ] i18n available in all components via `useI18n()`

---

### T008: Apply Theme in App.vue

**File**: `src/App.vue`

**Implementation**:

Update `App.vue` to apply Tailwind theme:

```vue
<script setup lang="ts">
// App.vue will be further populated in WP03
// For now, just apply base theming
</script>

<template>
  <div class="min-h-screen bg-[var(--color-alien-bg-primary)] text-[var(--color-alien-text)] p-4">
    <!-- Content will be added in WP03 -->
    <h1 class="text-2xl font-bold text-center mb-4">
      {{ $t('app.title') }}
    </h1>
  </div>
</template>
```

**Acceptance**:
- [ ] Background uses `--color-alien-bg-primary`
- [ ] Text uses `--color-alien-text`
- [ ] `$t('app.title')` displays translated title
- [ ] Page renders with SF/Alien dark theme

---

## Test Strategy

**Unit Tests**: Not required for this foundational work package (directory structure, configuration)

**Manual Validation**:
1. Run `npm run dev`
2. Verify application loads without errors
3. Check browser console - no TypeScript or runtime errors
4. Inspect page with DevTools - CSS variables applied correctly
5. Change browser language to French, reload - verify title switches (if browser locale detection works)

**Type Checking**:
```bash
npm run type-check
```
Expected: No TypeScript errors

---

## Definition of Done

- [ ] All 8 subtasks (T001-T008) completed
- [ ] Directory structure created and matches plan.md
- [ ] Tailwind 4 theme defined with SF/Alien colors
- [ ] Shared TypeScript types exported from `src/types/index.ts`
- [ ] i18n configured with browser locale detection
- [ ] English and French translations complete and matching structure
- [ ] i18n integrated in `main.ts`
- [ ] `App.vue` applies base theming
- [ ] `npm run dev` starts without errors
- [ ] `npm run type-check` passes without errors
- [ ] Browser displays dark SF/Alien themed page with translated title

---

## Risks & Contingencies

**Risk**: Tailwind 4 CSS variable syntax not working
- **Indicator**: Build errors or CSS variables not applied
- **Mitigation**: Verify `@tailwindcss/vite` plugin installed, check Tailwind 4 docs for syntax changes

**Risk**: i18n locale detection fails in some browsers
- **Indicator**: Always defaults to 'en' even in French browser
- **Mitigation**: Fallback is acceptable (user can manually switch via language selector in WP03)

**Risk**: Type imports fail due to path alias misconfiguration
- **Indicator**: TypeScript errors: `Cannot find module '@/types'`
- **Mitigation**: Verify `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`

---

## Next Work Package

After completing WP01, proceed to **WP02: Core Composables** to implement reusable business logic for localStorage persistence, character state management, action logging, and i18n wrapper.
