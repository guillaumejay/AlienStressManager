# Spec: Panic Rolls

## ADDED Requirements

### Requirement: `panic-rolls:1` The user can trigger a panic roll.

The system MUST allow the user to trigger a panic roll. The outcome of the roll determines the panic effect on the character.

#### Scenario: Successful Panic Roll
- GIVEN a character has 10 stress points
- WHEN the user clicks the "Panic Roll" button
- THEN the system calculates the result, including any modifiers
- AND displays the corresponding panic effect.

### Requirement: `panic-rolls:2` The "Nerve of Steel" talent modifies the panic roll.

The system MUST modify the panic roll for a character with the "Nerve of Steel" talent, which gets a -2 modifier on their panic roll.

#### Scenario: Character with Nerve of Steel
- GIVEN a character has the "Nerve of Steel" talent
- WHEN the user clicks the "Panic Roll" button
- THEN the system applies a -2 modifier to the roll.

### Requirement: `panic-rolls:3` The panic effect automatically adjusts character stress.

The system MUST automatically adjust the character's stress level based on the panic effect.

#### Scenario: Panic Effect Reduces Stress
- GIVEN a character makes a panic roll
- AND the resulting effect is "Stress relief: Your stress level is reduced by 1"
- THEN the character's stress level is automatically reduced by 1.

### Requirement: `panic-rolls:4` The user is notified of effects on other characters.

The system MUST notify the user of panic effects that have consequences for other characters in the vicinity.

#### Scenario: Panic Effect Affects Others
- GIVEN a character makes a panic roll
- AND the resulting effect is "Dropped item: You drop a random item of importance"
- THEN the system displays a notification "Dropped item: You drop a random item of importance" in the alert zone.

### Requirement: `panic-rolls:5` The user is notified of action loss.

The system MUST notify the user when a panic effect causes the character to lose their next action.

#### Scenario: Panic Effect Causes Action Loss
- GIVEN a character makes a panic roll
- AND the resulting effect is "Freeze: You lose your next slow and fast action"
- THEN the system displays a notification "You lose your next slow and fast action" in the alert zone.
