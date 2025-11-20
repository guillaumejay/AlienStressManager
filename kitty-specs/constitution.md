<!--
SYNC IMPACT REPORT
==================
Version Change: N/A → 1.0.0
Initial Constitution Creation

This is the initial constitution for the AlienStressManager project.

Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (5 principles defined)
  - Technical Standards
  - Quality Assurance
  - Governance

Removed Sections: N/A

Templates Requiring Updates:
  ✅ .kittify/templates/spec-template.md (reviewed - compatible)
  ✅ .kittify/templates/plan-template.md (reviewed - Constitution Check section compatible)
  ✅ .kittify/templates/tasks-template.md (reviewed - compatible)
  ✅ .kittify/templates/commands/*.md (reviewed - no agent-specific references)

Follow-up TODOs: None
-->

# AlienStressManager Constitution

## Core Principles

### I. Local-First Architecture

All application data MUST be stored locally on the user's device. The application MUST function completely offline with no dependency on remote servers or cloud services. Local storage mechanisms (localStorage, IndexedDB, or similar web APIs) are the only permitted data persistence layers.

**Rationale**: This application is designed for tabletop gaming sessions where internet connectivity cannot be assumed. Players must be able to track stress and panic mechanics reliably regardless of network availability.

### II. Responsive Design (NON-NEGOTIABLE)

All user interfaces MUST be fully responsive and functional across mobile phones, tablets, and desktop devices. Breakpoint design MUST follow mobile-first principles using Tailwind 4 utilities. Every feature MUST be tested at minimum three viewport sizes: mobile (320px-768px), tablet (768px-1024px), and desktop (1024px+).

**Rationale**: Tabletop gaming occurs in diverse environments - at home on laptops, at game stores on tablets, or referenced quickly on phones during active play. The interface must adapt seamlessly to all contexts.

### III. Internationalization First

The application MUST support French and English languages with full feature parity in both languages. All user-facing strings MUST be externalized through vue-i18n. New features MUST include translations for both languages before completion. Hard-coded strings in components are prohibited.

**Rationale**: Alien RPG has a strong francophone player base, and accessibility in both languages is a core commitment. Retrofitting i18n is costly; building it in from the start ensures quality and maintainability.

### IV. Component-Driven Development

UI features MUST be built as reusable Vue 3 Composition API components. Components MUST be self-contained with clear props interfaces, emit events for parent communication, and avoid tight coupling to application state. Shared components MUST be documented with usage examples.

**Rationale**: Vue 3 Composition API enables better code reuse, testing, and maintainability. The Alien RPG domain has recurring UI patterns (stress tracks, panic rolls, condition management) that benefit from well-designed component libraries.

### V. Type Safety

TypeScript MUST be used for all source code. Components, composables, and utility functions MUST have explicit type annotations. The `type-check` script MUST pass without errors before any feature is considered complete. Use of `any` type requires explicit justification in code comments.

**Rationale**: Type safety catches errors at compile time, improves IDE support, and serves as living documentation. For a gaming tool where incorrect calculations or state management could disrupt play sessions, type safety is a critical quality gate.

## Technical Standards

### Technology Stack

- **Framework**: Vue 3 (Composition API preferred)
- **Styling**: Tailwind CSS 4 (utility-first, no custom CSS unless justified)
- **Language**: TypeScript (~5.9.0)
- **Internationalization**: vue-i18n (^11.1.12)
- **Routing**: vue-router (^4.6.3)
- **Build Tool**: Vite (^7.1.11)
- **Testing**: Vitest (^3.2.4) + @vue/test-utils (^2.4.6)
- **Linting**: ESLint + oxlint (dual-lint strategy)
- **Formatting**: Prettier (3.6.2)

### Performance Standards

- **Load Time**: Initial page load MUST complete within 3 seconds on 3G connections
- **Runtime Performance**: UI interactions MUST respond within 100ms (no janky animations)
- **Bundle Size**: JavaScript bundle MUST remain under 500KB (gzipped) for initial load
- **Accessibility**: MUST achieve WCAG 2.1 AA compliance for core user journeys

### Code Organization

- **Source Structure**: `src/` contains components, composables, views, router, and i18n configuration
- **Test Structure**: Unit tests co-located with source files or in parallel `tests/` directory
- **Asset Management**: Static assets in `public/`, processed assets in `src/assets/`
- **Naming Conventions**:
  - Components: PascalCase (e.g., `StressTracker.vue`)
  - Composables: camelCase with `use` prefix (e.g., `useStressCalculation.ts`)
  - Utilities: camelCase (e.g., `panicRollLogic.ts`)

## Quality Assurance

### Testing Requirements

- **Unit Tests**: All business logic (composables, utilities) MUST have unit test coverage
- **Component Tests**: Complex interactive components MUST have component tests verifying user interactions
- **Type Checking**: `npm run type-check` MUST pass before commits
- **Linting**: `npm run lint` MUST pass before commits (both oxlint and eslint)

### Code Review Standards

- All features implemented via Spec-Kitty workflow MUST follow spec → plan → tasks → implementation sequence
- Changes MUST be reviewed against the feature specification's acceptance criteria
- Accessibility review MUST confirm keyboard navigation and screen reader compatibility
- Responsive design review MUST verify all breakpoints render correctly

### Minimal Manual Intervention

As stated in the README, this project is "Built using Spec-Kitty, human intervention on code files is to be minimal." This principle means:

- AI-driven implementation via Spec-Kitty commands is the primary development mode
- Manual code edits should be reserved for edge cases, hotfixes, or clarifications
- All planned features MUST go through the `/spec-kitty.specify` → `/spec-kitty.plan` → `/spec-kitty.tasks` → `/spec-kitty.implement` workflow
- Human developers focus on specification, design review, and acceptance testing rather than direct coding

## Governance

### Amendment Process

This constitution may be amended when project needs evolve. Proposed amendments MUST:

1. Document the rationale for the change
2. Identify affected templates and artifacts (spec-template.md, plan-template.md, tasks-template.md, command files)
3. Update the constitution version following semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible governance changes
   - **MINOR**: New principle additions or material expansions to existing principles
   - **PATCH**: Clarifications, wording improvements, or non-semantic refinements
4. Update the Last Amended date and prepend a Sync Impact Report

### Compliance Verification

- The `/spec-kitty.analyze` command validates feature artifacts against this constitution
- The Constitution Check section in `plan-template.md` enforces alignment before Phase 0 research and after Phase 1 design
- Violations of NON-NEGOTIABLE principles block feature acceptance
- Other principle violations require documented justification and simpler alternative analysis

### Conflict Resolution

When constitution principles conflict with implementation realities:

1. Document the conflict in the implementation plan's Complexity Tracking section
2. Explain why the principle cannot be upheld
3. Describe simpler alternatives considered and why they were rejected
4. Propose a temporary exception with clear scope and sunset conditions
5. Seek approval before proceeding (human decision required)

---

**Version**: 1.0.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
