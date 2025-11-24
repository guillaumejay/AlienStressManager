# dice-rolling Specification

## Purpose
TBD - created by archiving change add-dice-rolling. Update Purpose after archive.
## Requirements
### Requirement: The user can input base dice count

The system MUST allow the user to specify the number of base dice for an action roll. The UI MUST provide quick, efficient input controls optimized for gameplay. Stress dice are automatically determined by the character's current stress level and cannot be modified.

#### Scenario: User configures base dice
- **WHEN** the user opens the dice roller
- **THEN** they see an input control for base dice count (default 0)
- **AND** the stress dice count is displayed as a read-only value matching the character's current stress

#### Scenario: Stress dice automatically match character stress
- **GIVEN** a character has 4 stress points
- **WHEN** the user views the dice roller
- **THEN** the stress dice is shown as 4 and cannot be changed

### Requirement: The user can roll action dice

The system MUST allow the user to roll the configured dice pool by clicking a roll button. The roll simulates d6 dice for both base dice and stress dice pools.

#### Scenario: Rolling dice
- **GIVEN** the user has configured 3 base dice and 2 stress dice
- **WHEN** the user clicks the "Roll" button
- **THEN** the system generates random results for 5 dice (3 base + 2 stress)
- **AND** each die result is a value from 1 to 6

### Requirement: The system displays roll results as a summary

The system MUST display the roll results in summary format showing the total number of successes and whether panic was triggered. A success is any die showing 6. Panic is triggered if any stress die shows 1.

#### Scenario: Successful roll with no panic
- **GIVEN** the user rolled 3 base dice with results [6, 4, 2]
- **AND** 2 stress dice with results [6, 3]
- **THEN** the system displays "2 successes"
- **AND** no panic indicator is shown

#### Scenario: Roll triggers panic
- **GIVEN** the user rolled 2 base dice with results [6, 3]
- **AND** 3 stress dice with results [1, 5, 6]
- **THEN** the system displays "2 successes"
- **AND** a panic indicator is prominently displayed

### Requirement: The system shows a panic roll button when panic is triggered

The system MUST display a prominent "Start Panic Roll" button when a dice roll triggers panic (any stress die shows 1). The panic roll is NOT started automatically.

#### Scenario: Panic triggered shows button
- **GIVEN** the user rolled dice
- **AND** a stress die showed 1
- **THEN** a prominent "Start Panic Roll" button appears
- **AND** clicking it initiates the existing panic roll flow

#### Scenario: No panic does not show button
- **GIVEN** the user rolled dice
- **AND** no stress die showed 1
- **THEN** no panic roll button is displayed

### Requirement: Dice roll results are logged

The system MUST log each dice roll to the action history. The log entry MUST include the dice configuration, success count, and whether panic was triggered.

#### Scenario: Roll logged to action history
- **GIVEN** the user rolled 3 base dice and 2 stress dice
- **AND** the result was 2 successes with panic triggered
- **WHEN** the user views the action log
- **THEN** they see an entry showing "Dice Roll: 3 base + 2 stress = 2 successes, Panic!"

