# Change: Add Action Dice Rolling

## Why

Players currently track stress manually but cannot roll action dice within the app. In Alien RPG, action rolls use base dice (attribute + skill) plus stress dice. Rolling dice externally breaks gameplay flow. Adding integrated dice rolling improves the user experience and enables automatic panic detection when stress dice show a 1.

## What Changes

- **NEW**: Dice roller UI component with quick inputs for base dice and stress dice counts
- **NEW**: Roll button that simulates d6 rolls for both dice pools
- **NEW**: Results display showing success count and panic trigger status (summary format)
- **NEW**: Prominent "Start Panic Roll" button appears when panic is triggered
- **NEW**: Dice roll results logged to action history
- **NEW**: `useDiceRoll` composable for dice rolling logic
- **NEW**: Types for dice roll configuration and results
- **NEW**: i18n translations for dice rolling UI (en/fr)

## Impact

- Affected specs: NEW `dice-rolling` capability
- Affected code:
  - `src/types/index.ts` - new types
  - `src/composables/useDiceRoll.ts` - new composable
  - `src/composables/useActionLog.ts` - extended action types
  - `src/components/DiceRoller.vue` - new component
  - `src/components/StressTracker.vue` - integrate dice roller
  - `src/i18n/locales/en.json` - new translations
  - `src/i18n/locales/fr.json` - new translations
