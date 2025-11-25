<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { rollDice, pushRoll } from '@/composables/useDiceRoll'
import DiceResultDisplay from '@/components/DiceResultDisplay.vue'
import type { DiceRollResult } from '@/types'

interface Props {
  stressDice: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  roll: [result: DiceRollResult]
  push: [result: DiceRollResult, stressIncrease: number]
}>()

const { t } = useI18n()

const baseDice = ref(0)
const lastResult = ref<DiceRollResult | null>(null)
const isRolling = ref(false)
const canPush = ref(false)

function incrementBaseDice(): void {
  baseDice.value++
}

function decrementBaseDice(): void {
  if (baseDice.value > 0) {
    baseDice.value--
  }
}

function handleRoll(): void {
  if (isRolling.value) return

  isRolling.value = true
  lastResult.value = null
  canPush.value = false

  // Simulate dice rolling animation for 1.5 seconds
  setTimeout(() => {
    const result = rollDice({
      baseDice: baseDice.value,
      stressDice: props.stressDice,
    })
    lastResult.value = result
    isRolling.value = false
    // Can only push if no panic was triggered
    canPush.value = !result.panicTriggered
    emit('roll', result)
  }, 1500)
}

function handlePush(): void {
  if (!lastResult.value || !canPush.value || isRolling.value) return

  isRolling.value = true
  const previousResult = lastResult.value

  // Simulate dice rolling animation for 1.5 seconds
  setTimeout(() => {
    const result = pushRoll(previousResult)
    lastResult.value = result
    isRolling.value = false
    canPush.value = false // Can only push once
    emit('push', result, 1) // Signal stress increase of 1
  }, 1500)
}

function formatSuccesses(count: number): string {
  if (count === 0) {
    return t('app.diceRoller.noSuccesses')
  }
  return t('app.diceRoller.successes', { n: count })
}
</script>

<template>
  <div
    class="p-4 rounded transition-colors"
    :class="lastResult?.panicTriggered && !isRolling
      ? 'bg-red-950 border-2 border-red-700'
      : 'bg-[var(--color-alien-bg-secondary)] border border-[var(--color-alien-border)]'"
  >
    <h3 class="text-lg font-semibold text-[var(--color-alien-text)] mb-4">
      {{ t('app.diceRoller.title') }}
    </h3>

    <!-- Dice Configuration -->
    <div class="flex flex-col sm:flex-row gap-4 mb-4">
      <!-- Base Dice Input -->
      <div class="flex-1">
        <label class="block text-sm text-[var(--color-alien-text-dim)] mb-2">
          {{ t('app.diceRoller.baseDice') }}
        </label>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="decrementBaseDice"
            :disabled="baseDice === 0 || isRolling"
            class="w-10 h-10 flex items-center justify-center bg-[var(--color-alien-bg-tertiary)] hover:bg-[var(--color-alien-border)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded transition-colors"
            aria-label="Decrease base dice"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="w-12 text-center text-2xl font-bold text-[var(--color-alien-text-bright)]">
            {{ baseDice }}
          </span>
          <button
            type="button"
            @click="incrementBaseDice"
            :disabled="isRolling"
            class="w-10 h-10 flex items-center justify-center bg-[var(--color-alien-bg-tertiary)] hover:bg-[var(--color-alien-border)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded transition-colors"
            aria-label="Increase base dice"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Stress Dice Display (read-only) -->
      <div class="flex-1">
        <label class="block text-sm text-[var(--color-alien-text-dim)] mb-2">
          {{ t('app.diceRoller.stressDice') }}
        </label>
        <div class="flex items-center gap-2">
          <span class="w-full text-center text-2xl font-bold text-yellow-400 py-2">
            {{ stressDice }}
          </span>
        </div>
      </div>
    </div>

    <!-- Roll Button / Dice Animation -->
    <div class="relative">
      <!-- Rolling Animation -->
      <div
        v-if="isRolling"
        class="w-full py-3 bg-[var(--color-alien-accent)] text-[var(--color-alien-text-bright)] font-bold rounded flex items-center justify-center gap-3"
      >
        <div class="flex gap-2">
          <span class="dice-roll-anim inline-block w-8 h-8 bg-white text-black rounded font-mono font-bold text-lg flex items-center justify-center" style="animation-delay: 0ms;">
            <span class="dice-face">6</span>
          </span>
          <span class="dice-roll-anim inline-block w-8 h-8 bg-yellow-400 text-black rounded font-mono font-bold text-lg flex items-center justify-center" style="animation-delay: 100ms;">
            <span class="dice-face">3</span>
          </span>
          <span class="dice-roll-anim inline-block w-8 h-8 bg-white text-black rounded font-mono font-bold text-lg flex items-center justify-center" style="animation-delay: 200ms;">
            <span class="dice-face">1</span>
          </span>
        </div>
      </div>

      <!-- Roll Button -->
      <button
        v-else
        type="button"
        @click="handleRoll"
        :disabled="baseDice === 0 && stressDice === 0"
        class="w-full py-3 bg-[var(--color-alien-accent)] hover:bg-[var(--color-alien-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text-bright)] font-bold rounded transition-colors"
      >
        {{ t('app.diceRoller.roll') }}
      </button>
    </div>

    <!-- Results Display -->
    <div v-if="lastResult && !isRolling" class="mt-4 p-4 bg-[var(--color-alien-bg-tertiary)] border border-[var(--color-alien-border)] rounded">
      <!-- Dice Rolled -->
      <div class="flex justify-center mb-3">
        <DiceResultDisplay
          :base-dice-results="lastResult.baseDiceResults"
          :stress-dice-results="lastResult.stressDiceResults"
          :panic-triggered="lastResult.panicTriggered"
        />
      </div>

      <!-- Successes -->
      <div class="text-center">
        <span class="text-2xl font-bold" :class="lastResult.successes > 0 ? 'text-green-400' : 'text-[var(--color-alien-text-dim)]'">
          {{ formatSuccesses(lastResult.successes) }}
        </span>
      </div>

      <!-- Push Button -->
      <div v-if="canPush" class="mt-4 flex justify-center">
        <button
          type="button"
          @click="handlePush"
          class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('app.diceRoller.push') }}
          <span class="text-sm opacity-75">(+1 {{ t('app.stress') }})</span>
        </button>
      </div>

      <!-- Pushed Indicator -->
      <div v-if="lastResult.isPushed" class="mt-2 text-center text-sm text-orange-400 font-semibold">
        {{ t('app.diceRoller.pushed') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dice-roll-anim {
  animation: dice-bounce 0.3s ease-in-out infinite;
}

.dice-roll-anim .dice-face {
  animation: dice-number 0.15s steps(1) infinite;
}

@keyframes dice-bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(15deg);
  }
}

@keyframes dice-number {
  0% { content: '1'; }
  16.67% { content: '2'; }
  33.33% { content: '3'; }
  50% { content: '4'; }
  66.67% { content: '5'; }
  83.33% { content: '6'; }
}

/* Fallback for browsers that don't support content animation */
.dice-roll-anim:nth-child(1) .dice-face { animation-delay: 0ms; }
.dice-roll-anim:nth-child(2) .dice-face { animation-delay: 50ms; }
.dice-roll-anim:nth-child(3) .dice-face { animation-delay: 100ms; }
</style>
