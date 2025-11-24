# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AlienStressManager is a Vue 3 + Tailwind 4 application for tracking Stress points in the Alien RPG (Free League Publishing). All data is stored locally in the browser via localStorage.

## Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build with type-check (runs vue-tsc + vite build)
pnpm preview          # Preview production build

# Testing
pnpm test:unit        # Run all tests with Vitest (watch mode)
pnpm test:unit --run  # Run tests once (CI mode)
pnpm test:unit tests/unit/useCharacterState.spec.ts  # Run single test file

# Linting & Formatting
pnpm lint             # Run oxlint then eslint (both with --fix)
pnpm format           # Format src/ with Prettier
pnpm type-check       # TypeScript check via vue-tsc
```

## Architecture

### Core Composables (`src/composables/`)

State management uses Vue composables with localStorage persistence:

- **useCharacterState** - Manages character (name, stress, hasNerveOfSteel), persistence, and panic roll logic. Uses the panic table from i18n translations.
- **useActionLog** - Session-scoped action history (increment/decrement/reset/panic). In-memory only, displayed newest-first.
- **useLocalStorage** - Generic reactive localStorage wrapper with error handling.
- **useI18n** - Wrapper around vue-i18n for typed locale access (en/fr).

### Type System (`src/types/index.ts`)

All domain types, composable return types, and component props/emits are centralized. Key types:
- `Character`, `PanicEffect`, `PanicRollResult`
- `ActionType`, `ActionLogEntry`, `PanicRollDetails`
- Storage keys and locale constants

### Components (`src/components/`)

- **StressTracker** - Main character management UI (name input, stress controls, panic roll)
- **ActionLog** - Collapsible history panel
- **LanguageSelector** - en/fr toggle
- **Footer** - Page footer

### Internationalization (`src/i18n/`)

Uses vue-i18n with locale files in `src/i18n/locales/{en,fr}.json`. The panic table with 15 effects is defined in these locale files.

## Path Alias

`@` maps to `src/` (configured in vite.config.ts and tsconfig).

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->
