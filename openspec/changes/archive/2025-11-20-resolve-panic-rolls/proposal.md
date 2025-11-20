# Proposal: Resolve Panic Rolls

This proposal introduces the capability for users to make panic rolls for their characters.

## Overview

The core of this feature is to automate the process of making a panic roll, as described in the Alien RPG rules. This includes:
- A button to trigger a panic roll.
- A checkbox to apply the "Nerve of Steel" talent (-2 modifier).
- The display of the panic effect.
- Automatic application of stress changes.
- A notification area for effects on other characters or loss of actions.

This feature will be integrated into the existing `StressTracker` component and will leverage the `useCharacterState` composable.

The panic roll tables (for English and French) are required to complete this feature. They are not currently present in the codebase.
