# Tasks: Resolve Panic Rolls

1.  **Data Structure**:
    *   [ ] Define the data structure for the panic table entries in `src/types/index.ts`.
    *   [ ] Create placeholder panic tables in `src/i18n/locales/en.json` and `src/i18n/locales/fr.json`.

2.  **State Management (`useCharacterState.ts`)**:
    *   [ ] Add a `hasNerveOfSteel` boolean property to the character state.
    *   [ ] Implement a `panicRoll` function that:
        *   Calculates the roll, applying the "Nerve of Steel" modifier if applicable.
        *   Looks up the result in the panic table (based on the current locale).
        *   Applies the stress change to the character.
        *   Returns the full panic effect object.

3.  **UI (`StressTracker.vue`)**:
    *   [ ] Add a "Nerve of Steel" checkbox.
    *   [ ] Add a "Panic Roll" button, which becomes active when a panic roll is required.
    *   [ ] Add a display area for the panic effect description.
    *   [ ] Add a notification area for effects on other characters and action loss.

4.  **Internationalization**:
    *   [ ] Add all new UI text to `en.json` and `fr.json`.

5.  **Testing**:
    *   [ ] Write unit tests for the `panicRoll` function in `useCharacterState.spec.ts`.
    *   [ ] Write component tests for the new UI elements in `StressTracker.spec.ts`.

6.  **Documentation**:
    *   [ ] Create a new spec file for this capability under `openspec/changes/resolve-panic-rolls/specs/panic-rolls/spec.md`.
