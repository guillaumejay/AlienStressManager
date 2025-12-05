<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCharacterState } from '@/composables/useCharacterState'
import { useActionLog } from '@/composables/useActionLog'
import { useI18n } from '@/composables/useI18n'
import ActionLog from './ActionLog.vue'
import DiceRoller from './DiceRoller.vue'
import type { PanicRollResult, DiceRollResult } from '@/types'

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
const { entries, logAction } = useActionLog()

const isLogVisible = ref(false)
const panicResult = ref<PanicRollResult | null>(null)
const stressChangeClass = ref('')
const panicRequired = ref(false)
const showNerveInfo = ref(false)

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
  panicRequired.value = false
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

function handleDiceRoll(result: DiceRollResult): void {
  logAction('diceRoll', character.value.stress, undefined, undefined, {
    baseDiceResults: result.baseDiceResults,
    stressDiceResults: result.stressDiceResults,
    successes: result.successes,
    panicTriggered: result.panicTriggered,
  })

  if (result.panicTriggered) {
    panicRequired.value = true
  }
}

function handlePushRoll(result: DiceRollResult, stressIncrease: number): void {
  // Increment stress first (mandatory cost for pushing)
  for (let i = 0; i < stressIncrease; i++) {
    incrementStress()
  }

  // Log the push action with the new stress level
  logAction('pushRoll', character.value.stress, undefined, undefined, {
    baseDiceResults: result.baseDiceResults,
    stressDiceResults: result.stressDiceResults,
    successes: result.successes,
    panicTriggered: result.panicTriggered,
    isPushed: true,
  })

  // Check for panic trigger on the pushed roll
  if (result.panicTriggered) {
    panicRequired.value = true
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Character Name & Nerve of Steel - Compact Row -->
    <div class="flex gap-2 items-center mb-3">
      <input
        id="character-name"
        type="text"
        :value="character.name"
        :placeholder="t('app.characterNamePlaceholder')"
        @input="handleNameInput"
        class="flex-1 min-w-0 px-3 py-2 bg-[var(--color-alien-bg-secondary)] text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded focus:outline-none focus:border-[var(--color-alien-accent)] transition-colors"
      />
      <div class="flex items-center gap-1 shrink-0">
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            :checked="character.hasNerveOfSteel"
            @change="toggleNerveOfSteel"
            class="h-4 w-4 bg-[var(--color-alien-bg-secondary)] border-[var(--color-alien-border)] rounded text-[var(--color-alien-accent)] focus:ring-[var(--color-alien-accent)]"
          />
          <span class="text-xs text-[var(--color-alien-text)] hidden sm:inline">{{ t('app.panic.nerveOfSteel') }}</span>
        </label>
        <button
          type="button"
          @click="showNerveInfo = !showNerveInfo"
          class="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--color-alien-bg-tertiary)] text-[var(--color-alien-text-dim)] hover:text-[var(--color-alien-accent)] hover:bg-[var(--color-alien-border)] transition-colors text-xs font-bold"
          :aria-label="t('app.panic.nerveOfSteel')"
        >
          ?
        </button>
      </div>
    </div>

    <!-- Nerve of Steel Info Popup -->
    <div
      v-if="showNerveInfo"
      class="mb-3 p-2 bg-[var(--color-alien-bg-tertiary)] border border-[var(--color-alien-border)] rounded text-xs text-[var(--color-alien-text)]"
    >
      <div class="flex items-start justify-between gap-2">
        <div>
          <span class="font-semibold text-[var(--color-alien-text-bright)]">{{ t('app.panic.nerveOfSteel') }}:</span>
          {{ t('app.panic.nerveOfSteelInfo') }}
        </div>
        <button
          type="button"
          @click="showNerveInfo = false"
          class="text-[var(--color-alien-text-dim)] hover:text-[var(--color-alien-text)] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Stress Tracker - Compact -->
    <div class="space-y-3">
      <!-- Stress Counter + Controls in one row -->
      <div class="flex items-center justify-center gap-3">
        <!-- Decrement Button -->
        <button
          @click="handleDecrement"
          :disabled="character.stress === 0"
          :aria-label="t('app.actions.decrement')"
          class="w-12 h-12 bg-[var(--color-alien-bg-secondary)] hover:bg-[var(--color-alien-bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded-full transition-all hover:border-[var(--color-alien-accent)] flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>

        <!-- Stress Counter Display -->
        <div class="text-center min-w-[80px]">
          <div class="text-xs text-[var(--color-alien-text-dim)] uppercase tracking-wider">
            {{ t('app.stress') }}
          </div>
          <div
            class="text-5xl font-bold text-[var(--color-alien-text-bright)] transition-colors leading-none"
            :class="stressChangeClass"
          >
            {{ character.stress }}
          </div>
        </div>

        <!-- Increment Button -->
        <button
          @click="handleIncrement"
          :aria-label="t('app.actions.increment')"
          class="w-12 h-12 bg-[var(--color-alien-accent)] hover:bg-[var(--color-alien-accent-hover)] text-[var(--color-alien-text-bright)] border border-[var(--color-alien-accent)] rounded-full transition-all flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <!-- Reset Button (smaller) -->
        <button
          @click="handleReset"
          :aria-label="t('app.actions.reset')"
          class="w-10 h-10 bg-[var(--color-alien-danger)] hover:brightness-110 text-[var(--color-alien-text-bright)] border border-[var(--color-alien-danger)] rounded-full transition-all flex items-center justify-center"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <!-- Dice Roller -->
      <DiceRoller
        :stress-dice="character.stress"
        @roll="handleDiceRoll"
        @push="handlePushRoll"
      />

      <!-- Panic Roll Button - Compact -->
      <div class="flex justify-center">
        <button
          @click="handlePanicRoll"
          :aria-label="t('app.panic.roll')"
          class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black border border-yellow-600 rounded transition-all font-bold"
          :class="{ 'animate-pulse ring-4 ring-red-500 ring-opacity-75': panicRequired }"
        >
          {{ t('app.panic.roll') }}
        </button>
      </div>

      <!-- Panic Result - Compact -->
      <div v-if="panicResult" data-testid="panic-result" class="p-3 bg-[var(--color-alien-bg-secondary)] border border-[var(--color-alien-border)] rounded">
        <h3 class="text-lg font-bold text-[var(--color-alien-text-bright)] mb-1">
          {{ panicResult.effect.name }} <span class="text-sm font-normal text-[var(--color-alien-text-dim)]">({{ panicResult.roll }})</span>
        </h3>
        <p class="text-sm text-[var(--color-alien-text)]">{{ panicResult.effect.description }}</p>
        <div v-if="panicResult.effect.notes || panicResult.effect.actionLoss || panicResult.effect.otherStressChange" class="mt-2 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded text-xs">
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
