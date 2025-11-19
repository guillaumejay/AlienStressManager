# Research: Character Stress Tracker
*Path: [kitty-specs/001-character-stress-tracker/research.md](kitty-specs/001-character-stress-tracker/research.md)*

**Feature**: Character Stress Tracker
**Date**: 2025-11-19
**Researcher**: AI Agent (spec-kitty research workflow)
**Status**: Complete

## Executive Summary

This research phase addresses four critical technical decisions for implementing the Character Stress Tracker: Tailwind 4 dark theming, vue-i18n TypeScript integration, localStorage patterns in Vue 3, and Composition API testing strategies. All decisions prioritize simplicity, type safety, and alignment with the project constitution.

**Key Decisions**:
1. Use Tailwind 4 arbitrary values with custom CSS variables for SF/Alien theme
2. Implement type-safe i18n with typed message schema and composable wrapper
3. Use reactive `watchEffect` pattern for localStorage sync with error boundaries
4. Test composables with Vitest in isolation, mock localStorage via setup/teardown

---

## Research Topic 1: Tailwind 4 Dark Theme Implementation

### Decision

**Chosen Approach**: Tailwind 4 arbitrary values + CSS custom properties for SF/Alien aesthetic

### Rationale

Tailwind 4's CSS-first architecture allows defining custom properties in `@theme` directive within CSS files, then referencing them via arbitrary values in Vue templates. This provides:
- **Type safety**: IDE autocomplete for Tailwind utilities
- **Maintainability**: Centralized theme in `src/style.css`
- **Performance**: No runtime overhead, compiled to static CSS
- **Flexibility**: Easy to adjust dark tones without touching components

### Implementation Pattern

**File**: `src/style.css`
```css
@import "tailwindcss";

@theme {
  --color-alien-bg-primary: #0a0e14;     /* Deep space black */
  --color-alien-bg-secondary: #151b23;   /* Panel gray */
  --color-alien-accent: #2d8f5f;         /* Xenomorph green */
  --color-alien-danger: #c23616;         /* Emergency red */
  --color-alien-text: #d4d7dd;           /* Light gray text */
  --color-alien-text-dim: #7a8190;       /* Dimmed text */
}
```

**Usage in Components**:
```vue
<template>
  <div class="bg-[var(--color-alien-bg-primary)] text-[var(--color-alien-text)]">
    <button class="bg-[var(--color-alien-accent)] hover:brightness-110">
      Increment
    </button>
  </div>
</template>
```

### Alternatives Considered

- **Tailwind config.js extension**: Rejected - Tailwind 4 prefers CSS-first configuration
- **Inline style objects**: Rejected - Loses Tailwind utility benefits, harder to maintain
- **Third-party dark theme library**: Rejected - Adds unnecessary dependency, constitution prefers minimal stack

### Evidence

- Tailwind 4 docs: `@theme` directive for custom properties (official migration guide)
- Vue 3 + Tailwind 4 integration: Vite plugin `@tailwindcss/vite` supports CSS custom properties

### Supporting Files

- See `research/evidence-log.csv` entry #1 for Tailwind 4 documentation references
- Example color palette based on Alien film franchise aesthetics (dark metallics, green accent lighting)

---

## Research Topic 2: vue-i18n Best Practices

### Decision

**Chosen Approach**: Typed message schema with composable wrapper for locale management

### Rationale

vue-i18n v11 supports TypeScript message schema generation via `@intlify/unplugin-vue-i18n/messages`. This enables:
- **Type safety**: Autocomplete for translation keys, compile-time error on missing keys
- **Locale detection**: Leverages `navigator.language` with fallback to 'en'
- **Persistence**: Custom composable wraps i18n and syncs locale to localStorage
- **Performance**: Tree-shakeable, only loads active locale

### Implementation Pattern

**File**: `src/i18n/locales/en.json`
```json
{
  "app": {
    "title": "Stress Tracker",
    "characterName": "Character Name",
    "stress": "Stress",
    "actions": {
      "increment": "Increase",
      "decrement": "Decrease",
      "reset": "Reset"
    },
    "actionLog": {
      "title": "Action History",
      "toggle": "Toggle History"
    },
    "language": {
      "label": "Language",
      "en": "English",
      "fr": "French"
    }
  }
}
```

**File**: `src/i18n/locales/fr.json`
```json
{
  "app": {
    "title": "Suivi du Stress",
    "characterName": "Nom du Personnage",
    "stress": "Stress",
    "actions": {
      "increment": "Augmenter",
      "decrement": "Diminuer",
      "reset": "Réinitialiser"
    },
    "actionLog": {
      "title": "Historique des Actions",
      "toggle": "Basculer l'Historique"
    },
    "language": {
      "label": "Langue",
      "en": "Anglais",
      "fr": "Français"
    }
  }
}
```

**File**: `src/i18n/index.ts`
```typescript
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import type { Locale } from '@/types'

export const i18n = createI18n({
  legacy: false, // Composition API mode
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { en, fr }
})

function detectLocale(): Locale {
  const browserLocale = navigator.language.split('-')[0]
  return browserLocale === 'fr' ? 'fr' : 'en'
}
```

**Custom Composable** (`src/composables/useI18n.ts`):
```typescript
import { useI18n as useVueI18n } from 'vue-i18n'
import { useLocalStorage } from './useLocalStorage'
import type { Locale } from '@/types'

export function useI18n() {
  const { t, locale } = useVueI18n()
  const { storedValue: persistedLocale, setStoredValue } =
    useLocalStorage<Locale>('languagePreference', locale.value as Locale)

  // Sync persisted locale with i18n
  locale.value = persistedLocale.value

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    setStoredValue(newLocale)
  }

  return { t, locale, setLocale }
}
```

### Alternatives Considered

- **Plain object imports without i18n**: Rejected - No reactivity, harder locale switching
- **Server-side translation API**: Rejected - Violates local-first architecture
- **Manual translation map**: Rejected - No type safety, error-prone at scale

### Evidence

- vue-i18n v11 TypeScript guide: Recommends Composition API mode with message schema types
- Browser locale detection: MDN `navigator.language` API standard across modern browsers

### Supporting Files

- See `research/evidence-log.csv` entry #2 for vue-i18n documentation
- Translation content sourced from Alien RPG official rulebook terminology (stress, panic, etc.)

---

## Research Topic 3: localStorage Best Practices for Vue 3

### Decision

**Chosen Approach**: Reactive `watchEffect` with error boundaries and quota handling

### Rationale

Vue 3's Composition API `watchEffect` provides automatic dependency tracking for reactive state changes. Wrapping localStorage operations in a composable with error handling addresses:
- **Reactivity**: Changes to `ref` automatically trigger localStorage write
- **Error handling**: Try/catch blocks handle `QuotaExceededError` gracefully
- **Cross-tab sync**: StorageEvent listener updates state when other tabs modify localStorage
- **Testability**: Composable can be mocked in unit tests

### Implementation Pattern

**File**: `src/composables/useLocalStorage.ts`
```typescript
import { ref, watchEffect, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const error = ref<Error | null>(null)
  const storedValue = ref<T>(defaultValue) as Ref<T>

  // Initialize from localStorage
  try {
    const item = localStorage.getItem(key)
    if (item !== null) {
      storedValue.value = JSON.parse(item)
    }
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('localStorage read failed')
  }

  // Watch for changes and persist
  watchEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue.value))
      error.value = null
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        error.value = new Error('Storage quota exceeded')
      } else {
        error.value = e instanceof Error ? e : new Error('localStorage write failed')
      }
    }
  })

  // Listen for cross-tab changes
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== null) {
      try {
        storedValue.value = JSON.parse(e.newValue)
      } catch (err) {
        error.value = err instanceof Error ? err : new Error('Storage sync failed')
      }
    }
  }
  window.addEventListener('storage', handleStorageChange)

  const setStoredValue = (value: T) => {
    storedValue.value = value
  }

  return { storedValue, setStoredValue, error }
}
```

### Alternatives Considered

- **Manual localStorage calls in components**: Rejected - Repetitive, not DRY, hard to test
- **Pinia with persistence plugin**: Rejected - User chose Composition API pattern (planning decision A)
- **VueUse `useLocalStorage`**: Rejected - Adds dependency, constitution prefers minimal stack

### Evidence

- Vue 3 docs: `watchEffect` triggers on reactive dependency changes
- MDN StorageEvent: Fires when localStorage modified in another tab (same origin)
- Edge case handling: `QuotaExceededError` documented in Web Storage API spec

### Supporting Files

- See `research/evidence-log.csv` entry #3 for localStorage API references
- Quota limits vary by browser: 5MB typical minimum, graceful degradation required per spec edge cases

---

## Research Topic 4: Component Testing Strategies for Composition API

### Decision

**Chosen Approach**: Isolated composable tests with Vitest, component tests with @vue/test-utils

### Rationale

Composition API composables are plain functions, making them ideal for unit testing without rendering components. This strategy:
- **Separation of concerns**: Test business logic (composables) separately from UI (components)
- **Speed**: Composable tests run in milliseconds without DOM overhead
- **Mocking**: localStorage mocked via `beforeEach`/`afterEach` setup
- **Coverage**: Component tests focus on user interactions (clicks, input) and rendering

### Implementation Pattern

**Composable Test Example** (`tests/unit/useCharacterState.spec.ts`):
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCharacterState } from '@/composables/useCharacterState'

describe('useCharacterState', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with empty character', () => {
    const { character } = useCharacterState()
    expect(character.value.name).toBe('')
    expect(character.value.stress).toBe(0)
  })

  it('increments stress by 1', () => {
    const { character, incrementStress } = useCharacterState()
    character.value.name = 'Ripley'
    incrementStress()
    expect(character.value.stress).toBe(1)
  })

  it('prevents stress from going negative', () => {
    const { character, decrementStress } = useCharacterState()
    character.value.name = 'Ripley'
    decrementStress()
    expect(character.value.stress).toBe(0)
  })
})
```

**Component Test Example** (`tests/components/StressTracker.spec.ts`):
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StressTracker from '@/components/StressTracker.vue'

describe('StressTracker', () => {
  it('renders character name input', () => {
    const wrapper = mount(StressTracker)
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
  })

  it('increments stress on button click', async () => {
    const wrapper = mount(StressTracker)
    await wrapper.find('input[type="text"]').setValue('Ripley')
    await wrapper.find('[data-testid="increment-btn"]').trigger('click')
    expect(wrapper.text()).toContain('1')
  })
})
```

### Alternatives Considered

- **E2E tests only (Playwright/Cypress)**: Rejected - Slower, constitution emphasizes unit tests first
- **Testing components without mounting**: Rejected - Misses integration issues (props, events)
- **Snapshot testing**: Rejected - Brittle for UI, better for regression of complex output

### Evidence

- Vitest docs: Built for Vite projects, fast HMR, Vue 3 compatible
- @vue/test-utils v2: Official Vue testing library, supports Composition API
- Testing best practices: Arrange-Act-Assert pattern, one assertion per test case

### Supporting Files

- See `research/evidence-log.csv` entry #4 for testing framework documentation
- Example test structure follows Vitest conventions (describe/it blocks, expect assertions)

---

## Open Questions & Risks

### Open Questions

1. **Icon Library**: Which icon library for +/-/reset/toggle buttons?
   - **Options**: Heroicons, Lucide, Material Icons, custom SVG
   - **Decision deferred to**: Implementation phase (tasks.md)
   - **Recommendation**: Heroicons (MIT license, Tailwind ecosystem, tree-shakeable)

2. **Accessibility (WCAG 2.1 AA)**: ARIA labels for icon-only buttons?
   - **Requirement**: SC must confirm keyboard navigation and screen reader compatibility
   - **Decision deferred to**: Implementation testing phase
   - **Recommendation**: Add `aria-label` to all icon buttons, test with screen reader

### Risks

1. **localStorage unavailable (private browsing, quota exceeded)**
   - **Mitigation**: Error boundaries in `useLocalStorage` composable, user warning UI
   - **Fallback**: Session-only mode (state lost on reload)
   - **Acceptance**: Spec edge case acknowledges this scenario (FR edge cases)

2. **Browser locale detection edge cases**
   - **Risk**: Non-standard locale formats, unsupported languages
   - **Mitigation**: Safe fallback to 'en', explicit user override via selector
   - **Testing**: Manual test with browser locale set to non-en/fr

3. **Tailwind 4 CSS variable browser support**
   - **Risk**: Older browsers may not support CSS custom properties
   - **Mitigation**: Target modern browsers (ES2020+ per plan), no IE11 support
   - **Acceptance**: Constitution targets modern web standards

---

## References & Evidence Trail

All research sources logged in:
- `research/evidence-log.csv` - timestamped findings with source URLs
- `research/source-register.csv` - master list of all references cited

**Key Sources**:
1. Tailwind CSS v4 documentation (official docs)
2. vue-i18n v11 TypeScript guide (official docs)
3. Vue 3 Composition API reference (official docs)
4. MDN Web Storage API (localStorage, StorageEvent)
5. Vitest + @vue/test-utils documentation

---

## Sign-off

**Research Complete**: 2025-11-19
**Next Phase**: Phase 1 Design (data-model.md, contracts/types.ts, quickstart.md)
**Blockers**: None - all major decisions resolved
**Follow-up Actions**: Defer icon library choice to implementation, test ARIA compliance during QA
