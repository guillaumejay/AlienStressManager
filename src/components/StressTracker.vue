<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCharacterState } from '@/composables/useCharacterState'
import { useActionLog } from '@/composables/useActionLog'
import { useI18n } from '@/composables/useI18n'
import ActionLog from './ActionLog.vue'
import type { PanicRollResult } from '@/types'

const { t } = useI18n()
const {
  character,
  updateName,
  incrementStress,
  decrementStress,
  resetStress,
  toggleNerveOfSteel,
  panicRoll,
} = useCharacterState()
const { entries } = useActionLog()

const isLogVisible = ref(false)
const panicResult = ref<PanicRollResult | null>(null)
const stressChangeClass = ref('')

watch(
  () => character.value.stress,
  (newStress, oldStress) => {
    if (newStress > oldStress) {
      stressChangeClass.value = 'text-red-500'
    } else if (newStress < oldStress) {
      stressChangeClass.value = 'text-green-500'
    }

    setTimeout(() => {
      stressChangeClass.value = ''
    }, 2000)
  }
)

function toggleLog(): void {
  isLogVisible.value = !isLogVisible.value
}

function handlePanicRoll(): void {
  panicResult.value = panicRoll()
}


function handleNameInput(event: Event): void {
  const input = event.target as HTMLInputElement
  const newName = input.value.trim()
  updateName(newName)
}

function handleIncrement(): void {
  incrementStress()
}

function handleDecrement(): void {
  decrementStress()
}

function handleReset(): void {
  resetStress()
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Character Name Input -->
    <div class="mb-4">
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
        @input="handleNameInput"
        class="w-full px-4 py-3 bg-[var(--color-alien-bg-secondary)] text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded focus:outline-none focus:border-[var(--color-alien-accent)] transition-colors text-lg"
      />
    </div>

    <!-- Nerve of Steel Checkbox -->
    <div class="mb-8">
      <label class="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          :checked="character.hasNerveOfSteel"
          @change="toggleNerveOfSteel"
          class="h-5 w-5 bg-[var(--color-alien-bg-secondary)] border-[var(--color-alien-border)] rounded text-[var(--color-alien-accent)] focus:ring-[var(--color-alien-accent)]"
        />
        <span class="text-[var(--color-alien-text)]">{{ t('app.panic.nerveOfSteel') }}</span>
      </label>
    </div>

    <!-- Stress Tracker -->
    <div class="space-y-6">
      <!-- Stress Counter Display -->
      <div class="text-center">
        <div class="text-sm text-[var(--color-alien-text-dim)] mb-2">
          {{ t('app.stress') }}
        </div>
        <div
          class="text-6xl md:text-8xl font-bold text-[var(--color-alien-text-bright)] mb-8 transition-colors"
          :class="stressChangeClass"
        >
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

      <!-- Panic Roll Button -->
      <div class="flex justify-center mt-4">
        <button
          @click="handlePanicRoll"
          :aria-label="t('app.panic.roll')"
          class="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black border border-yellow-600 rounded transition-all text-lg font-bold"
        >
          {{ t('app.panic.roll') }}
        </button>
      </div>

      <!-- Panic Result -->
      <div v-if="panicResult" data-testid="panic-result" class="mt-8 p-6 bg-[var(--color-alien-bg-secondary)] border border-[var(--color-alien-border)] rounded">
        <h3 class="text-2xl font-bold text-[var(--color-alien-text-bright)] mb-4">
          {{ panicResult.effect.name }} ({{ panicResult.roll }})
        </h3>
        <p class="text-[var(--color-alien-text)] mb-4">{{ panicResult.effect.description }}</p>
        <div v-if="panicResult.effect.notes || panicResult.effect.actionLoss || panicResult.effect.otherStressChange" class="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded">
          <p v-if="panicResult.effect.actionLoss === 'slow'" class="text-yellow-300">
            {{ t('app.panic.actionLossSlow') }}
          </p>
          <p v-else-if="panicResult.effect.actionLoss === 'all'" class="text-yellow-300">
            {{ t('app.panic.actionLossAll') }}
          </p>
          <p v-if="panicResult.effect.otherStressChange" class="text-yellow-300">
            {{ t('app.panic.otherStressChange', { n: panicResult.effect.otherStressChange }) }}
          </p>
          <p v-if="panicResult.effect.notes" class="text-yellow-300">
            {{ panicResult.effect.notes }}
          </p>
        </div>
      </div>

      <!-- Action Log -->
      <ActionLog :entries="entries" :is-visible="isLogVisible" @toggle="toggleLog" />
    </div>
  </div>
</template>
