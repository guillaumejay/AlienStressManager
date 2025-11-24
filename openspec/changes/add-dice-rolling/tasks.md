## 1. Types and Domain Model

- [x] 1.1 Add `DiceRollConfig` type (baseDice: number, stressDice: number)
- [x] 1.2 Add `DiceRollResult` type (baseDiceResults: number[], stressDiceResults: number[], successes: number, panicTriggered: boolean)
- [x] 1.3 Add `DiceRollDetails` type for action log
- [x] 1.4 Extend `ActionType` to include `'diceRoll'`

## 2. Composable Implementation

- [x] 2.1 Create `useDiceRoll.ts` composable with:
  - [x] 2.1.1 `rollDice(config: DiceRollConfig): DiceRollResult` function
  - [x] 2.1.2 Logic to count successes (dice showing 6)
  - [x] 2.1.3 Logic to detect panic (any stress die showing 1)
- [x] 2.2 Update `useActionLog.ts` to handle `diceRoll` action type

## 3. Internationalization

- [x] 3.1 Add English translations in `en.json`:
  - [x] 3.1.1 `app.diceRoller.title`
  - [x] 3.1.2 `app.diceRoller.baseDice`
  - [x] 3.1.3 `app.diceRoller.stressDice`
  - [x] 3.1.4 `app.diceRoller.roll`
  - [x] 3.1.5 `app.diceRoller.successes`
  - [x] 3.1.6 `app.diceRoller.panic`
  - [x] 3.1.7 `app.diceRoller.startPanicRoll`
  - [x] 3.1.8 `app.actionLog.diceRollLabel`
- [x] 3.2 Add French translations in `fr.json` (same keys)

## 4. UI Component

- [x] 4.1 Create `DiceRoller.vue` component with:
  - [x] 4.1.1 Number input for base dice (stepper or direct input)
  - [x] 4.1.2 Read-only display for stress dice (auto-set from character stress)
  - [x] 4.1.3 Roll button
  - [x] 4.1.4 Results display (successes count)
  - [x] 4.1.5 Panic indicator when triggered
  - [x] 4.1.6 "Start Panic Roll" button when panic triggered
- [x] 4.2 Style component with Tailwind using existing design tokens
- [x] 4.3 Ensure mobile-first responsive design

## 5. Integration

- [x] 5.1 Integrate `DiceRoller` component into `StressTracker.vue`
- [x] 5.2 Connect panic roll button to existing `panicRoll()` function
- [x] 5.3 Log dice rolls to action history

## 6. Action Log Updates

- [x] 6.1 Update `ActionLog.vue` to display dice roll entries
- [x] 6.2 Show dice configuration (base + stress)
- [x] 6.3 Show successes and panic status

## 7. Testing

- [x] 7.1 Unit tests for `useDiceRoll` composable:
  - [x] 7.1.1 Test dice rolling generates valid results (1-6)
  - [x] 7.1.2 Test success counting (6s only)
  - [x] 7.1.3 Test panic detection (1 on stress dice)
- [x] 7.2 Component tests for `DiceRoller.vue`:
  - [x] 7.2.1 Test stress dice displays character's current stress (read-only)
  - [x] 7.2.2 Test roll button triggers roll
  - [x] 7.2.3 Test panic button appears when panic triggered
- [x] 7.3 Run type-check and lint

## 8. Validation

- [ ] 8.1 Manual testing on mobile viewport
- [ ] 8.2 Manual testing on desktop viewport
- [ ] 8.3 Verify both en/fr translations work
