# Data Model: Character Stress Tracker
*Path: [kitty-specs/001-character-stress-tracker/data-model.md](kitty-specs/001-character-stress-tracker/data-model.md)*

**Feature**: Character Stress Tracker
**Date**: 2025-11-19
**Status**: Complete

## Overview

This document defines the data entities, attributes, constraints, and storage patterns for the Character Stress Tracker feature. All data is stored client-side using browser localStorage (persistent) or in-memory state (session-scoped). No backend or database required.

---

## Entity 1: Character

### Description

Represents the player's character being tracked during an Alien RPG game session. Stores the character's name and current stress level.

### Attributes

| Attribute | Type | Constraints | Default | Description |
|-----------|------|-------------|---------|-------------|
| `name` | `string` | Required, non-empty | `""` | Character's name entered by the player |
| `stress` | `number` | ≥ 0, integer | `0` | Current stress level (no upper limit per Alien RPG rules) |

### Validation Rules

- **Name**: Must be non-empty string before stress tracking begins (FR-001)
- **Stress**: Cannot go below 0 (FR-007), no upper limit (assumption: Alien RPG allows stress >10)
- **Stress increment**: Always +1 per action (FR-004)
- **Stress decrement**: Always -1 per action, but clamped to 0 minimum (FR-005, FR-007)
- **Stress reset**: Sets stress to 0 regardless of current value (FR-006)

### Storage Pattern

**Location**: Browser `localStorage`
**Key**: `character`
**Format**: JSON serialized

```json
{
  "name": "Ellen Ripley",
  "stress": 7
}
```

**Persistence Behavior**:
- **Write**: On every stress change (increment, decrement, reset) or name change
- **Read**: On application initialization
- **Clear**: When name is edited (stress resets to 0, new name saved)

### Lifecycle

1. **Creation**: When user enters character name for first time (FR-001)
2. **Update**: On stress manipulation (+/−/reset buttons) or name edit (FR-009)
3. **Reset**: When user edits character name → stress returns to 0, action log clears (FR-009, edge cases)
4. **Persistence**: Survives browser close/reload (FR-008, SC-003)

### Relationships

- **Character → ActionLogEntry**: One-to-many (implicit) - stress changes generate log entries, but log is session-only and does not persist

---

## Entity 2: ActionLogEntry

### Description

Represents a single stress manipulation event (increment, decrement, or reset) performed during the current session. Displayed in the action history log for audit purposes.

### Attributes

| Attribute | Type | Constraints | Default | Description |
|-----------|------|-------------|---------|-------------|
| `timestamp` | `string` | ISO 8601 datetime | (current time) | When the action occurred (stored as ISO, displayed as HH:MM) |
| `action` | `ActionType` | Enum: 'increment' \| 'decrement' \| 'reset' | N/A | Type of stress manipulation |
| `resultingStress` | `number` | ≥ 0, integer | N/A | Stress level after the action completed |

### Validation Rules

- **Timestamp**: Must be valid ISO 8601 datetime string, generated at time of action
- **Action**: Must be one of three enum values ('increment', 'decrement', 'reset')
- **ResultingStress**: Must match the character's stress value after the action (always ≥ 0)

### Storage Pattern

**Location**: In-memory (Vue reactive array)
**Key**: N/A (not persisted to localStorage)
**Format**: Array of objects

```typescript
[
  {
    timestamp: "2025-11-19T14:32:15.123Z",
    action: "increment",
    resultingStress: 1
  },
  {
    timestamp: "2025-11-19T14:33:42.789Z",
    action: "increment",
    resultingStress: 2
  },
  {
    timestamp: "2025-11-19T14:35:10.456Z",
    action: "reset",
    resultingStress: 0
  }
]
```

**Persistence Behavior**:
- **Write**: Entries added to in-memory array on each stress action
- **Read**: Not persisted - log is empty on app reload (FR assumption: session-scoped logs)
- **Clear**: When character name is edited or app reloads

### Lifecycle

1. **Creation**: When user clicks +/−/reset button (FR-010)
2. **Display**: Entries shown in reverse chronological order (newest first) when log toggled visible (FR-011, clarifications)
3. **Clear**: On character name edit or app reload (edge cases, clarifications)
4. **No persistence**: Does not survive browser close/reload (assumption: session-only)

### Relationships

- **ActionLogEntry → Character**: Many-to-one (conceptual) - each entry references the character's stress state at a point in time

---

## Entity 3: LanguagePreference

### Description

Stores the user's selected interface language (French or English). Persists across browser sessions independently of character data.

### Attributes

| Attribute | Type | Constraints | Default | Description |
|-----------|------|-------------|---------|-------------|
| `locale` | `Locale` | Enum: 'en' \| 'fr' | Browser locale or 'en' | User's language preference |

### Validation Rules

- **Locale**: Must be either 'en' (English) or 'fr' (French)
- **Default**: Detected from `navigator.language` on first load, fallback to 'en' if not 'fr'

### Storage Pattern

**Location**: Browser `localStorage`
**Key**: `languagePreference`
**Format**: Plain string (not JSON)

```
"fr"
```

**Persistence Behavior**:
- **Write**: When user selects language from dropdown (FR-017)
- **Read**: On application initialization to set i18n locale
- **Independent**: Persists even when character name changes (assumption: language independent of character data)

### Lifecycle

1. **Creation**: On first app load, default detected from browser locale
2. **Update**: When user selects different language from selector (FR-017)
3. **Persistence**: Survives browser close/reload (FR-018, SC-009)
4. **Independence**: Not affected by character name changes or stress resets

### Relationships

- **LanguagePreference → (no relations)**: Standalone preference, does not relate to Character or ActionLogEntry

---

## Storage Summary

### localStorage Keys

| Key | Entity | Type | Persistent |
|-----|--------|------|------------|
| `character` | Character | JSON object | Yes |
| `languagePreference` | LanguagePreference | String | Yes |

### In-Memory State

| State | Entity | Type | Persistent |
|-------|--------|------|------------|
| Action log entries | ActionLogEntry[] | Array of objects | No (session-only) |

### Edge Case Handling

1. **localStorage unavailable (private browsing, quota exceeded)**
   - Behavior: App functions in session-only mode
   - User notification: Warning displayed that state will not persist (spec edge cases)
   - Fallback: State kept in memory, lost on reload

2. **Concurrent tabs/windows**
   - Behavior: Last-write-wins (acceptable per spec edge cases)
   - Cross-tab sync: StorageEvent listener updates state when other tabs modify localStorage

3. **Character name edited**
   - Behavior: Stress resets to 0, action log clears (FR-009, clarifications)
   - Persistence: New name + stress=0 saved to localStorage immediately

---

## Type Definitions

See `contracts/types.ts` for full TypeScript interface definitions:

```typescript
interface Character {
  name: string
  stress: number
}

type ActionType = 'increment' | 'decrement' | 'reset'

interface ActionLogEntry {
  timestamp: string
  action: ActionType
  resultingStress: number
}

type Locale = 'en' | 'fr'
```

---

## State Flow Diagram

```
[User enters name] → Character created (stress=0) → localStorage write
         ↓
[User clicks +/-/reset] → Character updated → localStorage write
         ↓                       ↓
   ActionLogEntry created → In-memory array
         ↓
[User toggles log] → Display entries (reverse chronological)
         ↓
[User edits name] → Stress reset to 0 → Log cleared → localStorage write
```

---

## Validation & Constraints Summary

| Entity | Field | Constraint | Enforcement |
|--------|-------|------------|-------------|
| Character | name | Non-empty | UI blocks stress tracking until name entered |
| Character | stress | ≥ 0 | Decrement button clamped to 0 minimum |
| Character | stress | Integer | Always incremented/decremented by 1 |
| ActionLogEntry | timestamp | Valid ISO datetime | Generated by `new Date().toISOString()` |
| ActionLogEntry | action | Enum | TypeScript type enforced at compile time |
| ActionLogEntry | resultingStress | ≥ 0 | Matches character stress (already validated) |
| LanguagePreference | locale | 'en' \| 'fr' | Selector dropdown limited to these options |

---

## Testing Considerations

**Composable Unit Tests** (`useCharacterState`, `useActionLog`, `useLocalStorage`):
- Test stress increment/decrement/reset logic
- Test name change triggers stress reset
- Test localStorage read/write/error scenarios
- Mock localStorage in beforeEach/afterEach

**Component Tests** (`StressTracker.vue`, `ActionLog.vue`):
- Test user interactions (button clicks, name input blur)
- Test reactive updates (stress counter displays correctly)
- Test action log toggle visibility
- Test language selector updates UI text

**Integration Tests** (optional):
- Test full user journey: enter name → adjust stress → view log → change language
- Test persistence: modify state → reload → verify state restored

---

## Sign-off

**Data Model Complete**: 2025-11-19
**Next Phase**: Phase 1B (contracts/types.ts generation), Phase 1C (quickstart.md)
**Dependencies**: research.md findings inform storage patterns and validation rules
**Validation**: All entities mapped to functional requirements (FR-001 through FR-018)
