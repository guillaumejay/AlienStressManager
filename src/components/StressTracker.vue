<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCharacterState } from '@/composables/useCharacterState'
import { useActionLog } from '@/composables/useActionLog'
import { useI18n } from '@/composables/useI18n'
import ActionLog from './ActionLog.vue'

const { t } = useI18n()
const { character, updateName, incrementStress, decrementStress, resetStress } = useCharacterState()
const { entries, logAction, clearLog } = useActionLog()

const isNameEntered = ref(character.value.name !== '')
const isLogVisible = ref(false)

function toggleLog(): void {
  isLogVisible.value = !isLogVisible.value
}

function handleNameBlur(event: Event): void {
  const input = event.target as HTMLInputElement
  const newName = input.value.trim()

  if (newName && newName !== character.value.name) {
    updateName(newName)
    clearLog() // Clear log when character name changes
    isNameEntered.value = true
  } else if (!newName) {
    isNameEntered.value = false
  } else {
    isNameEntered.value = true
  }
}

function handleIncrement(): void {
  incrementStress()
  logAction('increment', character.value.stress)
}

function handleDecrement(): void {
  decrementStress()
  logAction('decrement', character.value.stress)
}

function handleReset(): void {
  resetStress()
  logAction('reset', character.value.stress)
}

// Watch for character name to update isNameEntered
watch(
  () => character.value.name,
  (newName) => {
    isNameEntered.value = newName !== ''
  },
)
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Character Name Input -->
    <div class="mb-8">
      <label
        for="character-name"
        class="block text-sm font-medium mb-2 text-[var(--color-alien-text)]"
      >
        {{ t('app.characterName') }}
      </label>
      <input
        id="character-name"
        type="text"
        :value="character.name"
        :placeholder="t('app.characterNamePlaceholder')"
        @blur="handleNameBlur"
        class="w-full px-4 py-3 bg-[var(--color-alien-bg-secondary)] text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded focus:outline-none focus:border-[var(--color-alien-accent)] transition-colors text-lg"
      />
    </div>

    <!-- Stress Tracker (only shown when name is entered) -->
    <div v-if="isNameEntered" class="space-y-6">
      <!-- Stress Counter Display -->
      <div class="text-center">
        <div class="text-sm text-[var(--color-alien-text-dim)] mb-2">
          {{ t('app.stress') }}
        </div>
        <div class="text-6xl md:text-8xl font-bold text-[var(--color-alien-text-bright)] mb-8">
          {{ character.stress }}
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
        <!-- Decrement Button -->
        <button
          @click="handleDecrement"
          :disabled="character.stress === 0"
          :aria-label="t('app.actions.decrement')"
          class="flex-1 sm:flex-none px-6 py-4 bg-[var(--color-alien-bg-secondary)] hover:bg-[var(--color-alien-bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded transition-all hover:border-[var(--color-alien-accent)] flex items-center justify-center gap-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
          <span class="text-lg font-medium">{{ t('app.actions.decrement') }}</span>
        </button>

        <!-- Reset Button -->
        <button
          @click="handleReset"
          :aria-label="t('app.actions.reset')"
          class="flex-1 sm:flex-none px-6 py-4 bg-[var(--color-alien-danger)] hover:brightness-110 text-[var(--color-alien-text-bright)] border border-[var(--color-alien-danger)] rounded transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span class="text-lg font-medium">{{ t('app.actions.reset') }}</span>
        </button>

        <!-- Increment Button -->
        <button
          @click="handleIncrement"
          :aria-label="t('app.actions.increment')"
          class="flex-1 sm:flex-none px-6 py-4 bg-[var(--color-alien-accent)] hover:bg-[var(--color-alien-accent-hover)] text-[var(--color-alien-text-bright)] border border-[var(--color-alien-accent)] rounded transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span class="text-lg font-medium">{{ t('app.actions.increment') }}</span>
        </button>
      </div>

      <!-- Action Log -->
      <ActionLog :entries="entries" :is-visible="isLogVisible" @toggle="toggleLog" />
    </div>
  </div>
</template>
