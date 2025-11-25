# Push Roll Feature Implementation Plan

## Summary
Add a "Push Roll" button that appears after a dice roll, allowing players to re-roll all non-6 dice at the cost of +1 stress (standard Alien RPG rules).

## Mechanics
- Re-roll ALL dice that didn't show 6 (both base and stress dice)
- Keep all 6s from the original roll
- Add +1 stress and roll that new stress die as part of the push
- Can only push once per roll
- **Cannot push if original roll triggered panic** (panic = no push allowed)
- Panic check applies only to newly rolled dice (re-rolled + new stress die)

## Files to Modify

### 1. `src/types/index.ts`
- Add `'pushRoll'` to `ActionType` union
- Extend `DiceRollResult` with `isPushed?: boolean` flag
- Extend `DiceRollDetails` with `isPushed?: boolean` and `keptDice?` for logging
- Update `isActionType()` validator

### 2. `src/composables/useDiceRoll.ts`
- Add new `pushRoll(previousResult: DiceRollResult): DiceRollResult` function
- Keep 6s from original roll, re-roll non-6s, add 1 new stress die
- Check panic only on newly rolled stress dice

### 3. `src/components/DiceRoller.vue`
- Add `canPush` ref to track push availability
- Add `handlePush()` function with 1.5s animation
- Add Push button below results (orange themed, shows "+1 Stress")
- Emit new `push` event with result and stress increase
- Set `canPush = !result.panicTriggered` after roll (no push if panic)
- Reset `canPush` on new roll or after pushing

### 4. `src/components/StressTracker.vue`
- Add `handlePushRoll(result, stressIncrease)` handler
- Increment stress by 1 before logging
- Log action as `'pushRoll'` with dice details
- Set `panicRequired = true` if panic triggered

### 5. `src/components/ActionLog.vue`
- Add case for `'pushRoll'` in `getActionLabel()`
- Add orange color styling (`text-orange-400`) for push entries

### 6. `src/i18n/locales/en.json` & `fr.json`
- Add translations:
  - `app.diceRoller.push`: "Push" / "Relancer"
  - `app.diceRoller.pushed`: "Pushed!" / "Relancé !"
  - `app.actionLog.pushRollLabel`: "Push Roll" / "Relance"

### 7. `tests/unit/useDiceRoll.spec.ts`
- Test `pushRoll` keeps 6s
- Test correct re-roll count
- Test adds exactly 1 new stress die
- Test panic check on new dice only
- Test `isPushed` flag set correctly

### 8. `tests/unit/DiceRoller.spec.ts` (new or existing)
- Test Push button NOT shown when `panicTriggered = true`
- Test Push button shown when `panicTriggered = false`
- Test Push button hidden after pushing once

## Implementation Order
1. Types (`types/index.ts`)
2. Composable (`useDiceRoll.ts`)
3. i18n translations (both locales)
4. DiceRoller component (UI + logic)
5. StressTracker component (event handling)
6. ActionLog component (display)
7. Unit tests

## UI Design
- Push button: Orange background (`bg-orange-600`), appears below dice results
- Shows refresh icon + "Push" text + "(+1 Stress)" hint
- "Pushed!" indicator shown after pushing
- Button hidden after push or when rolling animation active
