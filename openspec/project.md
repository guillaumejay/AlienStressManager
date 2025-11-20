# Project Context

## Purpose

AlienStressManager is a web application for managing stress mechanics in the Alien RPG tabletop game by Free League Publishing. The application enables players and game masters to track stress points, manage panic rolls, and handle condition states during gameplay sessions.

**Primary Goals:**
- Provide a reliable, offline-capable stress tracking tool for Alien RPG sessions
- Support play in diverse environments (home, game stores, on-the-go)
- Deliver seamless experience across mobile, tablet, and desktop devices
- Serve both French and English-speaking player communities with equal feature parity

## Tech Stack

**Core Framework & Language:**
- Vue 3 (^3.5.24) - Composition API preferred
- TypeScript (~5.9.3) - Strict type safety enforced
- Vite (^7.2.2) - Build tool and dev server

**UI & Styling:**
- Tailwind CSS 4 (^4.1.17) - Utility-first, mobile-first responsive design
- @tailwindcss/vite (^4.1.17) - Vite integration

**State Management & Routing:**
- vue-router (^4.6.3) - Client-side routing
- Local storage/IndexedDB - Client-side data persistence (no backend)

**Internationalization:**
- vue-i18n (^11.1.12) - French and English translations

**Testing & Quality:**
- Vitest (^4.0.10) - Unit testing framework
- @vue/test-utils (^2.4.6) - Vue component testing
- ESLint (^9.39.1) + oxlint (~1.29.0) - Dual-lint strategy
- Prettier (3.6.2) - Code formatting
- vue-tsc (^3.1.4) - TypeScript type checking

**Development Environment:**
- Node.js (^20.19.0 || >=22.12.0)
- npm-run-all2 (^8.0.4) - Script orchestration
- vite-plugin-vue-devtools (^8.0.5) - Development tooling

## Project Conventions

### Code Style

**Naming Conventions:**
- Components: PascalCase (e.g., `StressTracker.vue`, `PanicRollButton.vue`)
- Composables: camelCase with `use` prefix (e.g., `useStressCalculation.ts`, `usePanicRoll.ts`)
- Utilities: camelCase (e.g., `panicRollLogic.ts`, `stressHelpers.ts`)
- Types/Interfaces: PascalCase (e.g., `Character`, `StressState`)

**TypeScript Requirements:**
- All source code MUST use TypeScript
- Explicit type annotations required for functions, composables, and component props
- Use of `any` type prohibited without explicit justification in comments
- `npm run type-check` must pass without errors before completion

**Formatting:**
- Prettier (3.6.2) enforces consistent formatting
- Run `npm run format` before commits
- Dual-lint strategy: oxlint for correctness, ESLint for additional rules
- Both `npm run lint:oxlint` and `npm run lint:eslint` must pass

### Architecture Patterns

**Local-First Architecture (Core Principle I):**
- All data MUST be stored locally (localStorage, IndexedDB, or similar web APIs)
- NO remote servers or cloud services dependencies
- Application MUST function completely offline
- Data persistence is client-side only

**Component-Driven Development (Core Principle IV):**
- Build UI as reusable Vue 3 Composition API components
- Components must be self-contained with clear props interfaces
- Use emit events for parent communication
- Avoid tight coupling to application state
- Shared components MUST be documented with usage examples

**Responsive Design (Core Principle II - NON-NEGOTIABLE):**
- Mobile-first design using Tailwind 4 utilities
- Test at three viewport sizes minimum:
  - Mobile: 320px-768px
  - Tablet: 768px-1024px
  - Desktop: 1024px+
- All features must be fully functional across all device types

**Internationalization First (Core Principle III):**
- Support French and English with full feature parity
- All user-facing strings externalized through vue-i18n
- New features MUST include translations for both languages
- Hard-coded strings in components are prohibited

**Code Organization:**
- Source structure: `src/` contains components, composables, views, router, i18n
- Test structure: Unit tests co-located with source or in parallel `tests/` directory
- Asset management: Static assets in `public/`, processed assets in `src/assets/`

### Testing Strategy

**Testing Requirements:**
- Unit tests MUST cover all business logic (composables, utilities)
- Complex interactive components MUST have component tests verifying user interactions
- Type checking via `npm run type-check` MUST pass before commits
- Linting via `npm run lint` MUST pass before commits

**Test Execution:**
- `npm run test:unit` - Run unit tests with Vitest
- Tests use @vue/test-utils for component testing
- JSDOM environment for DOM simulation

**Quality Gates:**
- All tests passing
- Type check passing
- Lint checks passing (both oxlint and eslint)
- Accessibility review confirming keyboard navigation and screen reader compatibility
- Responsive design review verifying all breakpoints render correctly

### Git Workflow

**Development Process:**
- OpenSpec workflow: proposal → implementation
- Minimal manual code intervention (AI-driven development via OpenSpec)
- Human developers focus on specification, design review, and acceptance testing
- Manual edits reserved for edge cases, hotfixes, or clarifications

**Commit Standards:**
- Follow conventional commit format
- Commits must reference relevant specifications
- Changes reviewed against feature acceptance criteria

**Branching:**
- Main branch: `main`
- Feature branches for new work
- Pull requests required for merging

## Domain Context

**Alien RPG Mechanics:**
- Stress tracking: Players accumulate stress points during gameplay
- Panic rolls: When stress exceeds threshold, players roll for panic effects
- Condition management: Various states affecting character performance
- Character-specific tracking: Each player character maintains separate stress state

**Gaming Context:**
- Used during active tabletop gaming sessions
- Requires quick, reliable access to stress mechanics
- Multiple players may use simultaneously (local-first, no sync needed)
- Sessions can last 2-6 hours with intermittent tool access
- No internet connectivity can be assumed during sessions

**User Profiles:**
- Game Masters: Track stress for NPCs and monitor player states
- Players: Track individual character stress and trigger panic rolls
- Languages: French and English-speaking player communities

## Important Constraints

**Technical Constraints:**
- **Local-first only** - No backend servers, APIs, or cloud services
- **Offline-first** - Must function without internet connectivity
- **Type safety** - TypeScript strict mode enforced
- **Performance standards:**
  - Initial page load ≤ 3 seconds on 3G connections
  - UI interactions ≤ 100ms response time (no janky animations)
  - JavaScript bundle ≤ 500KB gzipped for initial load
- **Accessibility** - WCAG 2.1 AA compliance for core user journeys

**Design Constraints:**
- **Responsive design (NON-NEGOTIABLE)** - Full functionality on mobile, tablet, desktop
- **Bilingual (NON-NEGOTIABLE)** - French and English with feature parity
- **Mobile-first** - Design and build for smallest screens first

**Process Constraints:**
- **AI-driven development** - OpenSpec workflow is primary development mode
- **Minimal human intervention** - Manual code edits are exceptional, not routine
- **Specification-first** - All planned features go through formal spec process

**Business/License Constraints:**
- Alien RPG is property of Free League Publishing
- Application is a fan-made tool, not official product
- Must respect intellectual property (no copyrighted game text, rules, or artwork)

## External Dependencies

**No External Services:**
This application has NO external dependencies on APIs, services, or backends. It is intentionally designed to be fully self-contained and offline-capable.

**Build-time Dependencies Only:**
- npm registry for package installation (development only)
- Vite dev server (development only)
- All runtime dependencies bundled in the client application

**Browser APIs Used:**
- localStorage or IndexedDB for data persistence
- Standard DOM APIs for rendering and interaction
- No external API calls during runtime
