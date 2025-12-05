<script setup lang="ts">
import { ref, computed } from 'vue'
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
const animatingDice = ref<Array<{ value: number; isStress: boolean }>>([])

// Generate animated dice based on actual dice count
const totalDice = computed(() => baseDice.value + props.stressDice)

function startDiceAnimation(): void {
  // Create dice array for animation
  const dice: Array<{ value: number; isStress: boolean }> = []
  for (let i = 0; i < baseDice.value; i++) {
    dice.push({ value: Math.floor(Math.random() * 6) + 1, isStress: false })
  }
  for (let i = 0; i < props.stressDice; i++) {
    dice.push({ value: Math.floor(Math.random() * 6) + 1, isStress: true })
  }
  animatingDice.value = dice

  // Animate dice values rapidly
  const animationInterval = setInterval(() => {
    animatingDice.value = animatingDice.value.map(d => ({
      ...d,
      value: Math.floor(Math.random() * 6) + 1
    }))
  }, 80)

  // Stop animation after delay
  setTimeout(() => {
    clearInterval(animationInterval)
  }, 1400)
}

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
  startDiceAnimation()

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
  startDiceAnimation()

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
    class="p-3 rounded transition-colors"
    :class="lastResult?.panicTriggered && !isRolling
      ? 'bg-red-950 border-2 border-red-700'
      : 'bg-[var(--color-alien-bg-secondary)] border border-[var(--color-alien-border)]'"
  >
    <!-- Dice Configuration - Compact inline -->
    <div class="flex items-center gap-3 mb-2">
      <!-- Base Dice -->
      <div class="flex items-center gap-1">
        <span class="text-xs text-[var(--color-alien-text-dim)] w-10">{{ t('app.diceRoller.baseDice') }}</span>
        <button
          type="button"
          @click="decrementBaseDice"
          :disabled="baseDice === 0 || isRolling"
          class="w-8 h-8 flex items-center justify-center bg-[var(--color-alien-bg-tertiary)] hover:bg-[var(--color-alien-border)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded transition-colors"
          aria-label="Decrease base dice"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <span class="w-8 text-center text-xl font-bold text-[var(--color-alien-text-bright)]">
          {{ baseDice }}
        </span>
        <button
          type="button"
          @click="incrementBaseDice"
          :disabled="isRolling"
          class="w-8 h-8 flex items-center justify-center bg-[var(--color-alien-bg-tertiary)] hover:bg-[var(--color-alien-border)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded transition-colors"
          aria-label="Increase base dice"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- Separator -->
      <span class="text-[var(--color-alien-border)]">+</span>

      <!-- Stress Dice Display -->
      <div class="flex items-center gap-1">
        <span class="text-xs text-[var(--color-alien-text-dim)]">{{ t('app.diceRoller.stressDice') }}</span>
        <span class="w-8 text-center text-xl font-bold text-yellow-400">
          {{ stressDice }}
        </span>
      </div>

      <!-- Roll Button -->
      <div class="flex-1">
        <button
          type="button"
          @click="handleRoll"
          :disabled="(baseDice === 0 && stressDice === 0) || isRolling"
          class="w-full py-2 bg-[var(--color-alien-accent)] hover:bg-[var(--color-alien-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-alien-text-bright)] font-bold rounded transition-colors text-sm"
        >
          {{ isRolling ? '...' : t('app.diceRoller.roll') }}
        </button>
      </div>
    </div>

    <!-- Dice Animation -->
    <div
      v-if="isRolling && animatingDice.length > 0"
      class="mb-2 p-3 bg-[var(--color-alien-bg-tertiary)] border border-[var(--color-alien-border)] rounded"
    >
      <div class="flex flex-wrap justify-center gap-2">
        <div
          v-for="(die, index) in animatingDice"
          :key="index"
          class="dice-3d"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div
            class="dice-cube"
            :class="die.isStress ? 'dice-stress' : 'dice-base'"
          >
            <div class="dice-face-3d font-mono font-bold">
              {{ die.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Display - Compact -->
    <div v-if="lastResult && !isRolling" class="p-2 bg-[var(--color-alien-bg-tertiary)] border border-[var(--color-alien-border)] rounded">
      <div class="flex flex-wrap items-center justify-center gap-2">
        <!-- Dice Rolled -->
        <DiceResultDisplay
          :base-dice-results="lastResult.baseDiceResults"
          :stress-dice-results="lastResult.stressDiceResults"
          :panic-triggered="lastResult.panicTriggered"
        />

        <!-- Successes -->
        <span class="text-lg font-bold ml-2" :class="lastResult.successes > 0 ? 'text-green-400' : 'text-[var(--color-alien-text-dim)]'">
          {{ formatSuccesses(lastResult.successes) }}
        </span>

        <!-- Push Button -->
        <button
          v-if="canPush"
          type="button"
          @click="handlePush"
          class="ml-2 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded transition-colors flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('app.diceRoller.push') }}
        </button>

        <!-- Pushed Indicator -->
        <span v-if="lastResult.isPushed" class="text-xs text-orange-400 font-semibold">
          {{ t('app.diceRoller.pushed') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dice-3d {
  perspective: 200px;
  animation: dice-jump 0.4s ease-in-out infinite;
}

.dice-cube {
  width: 32px;
  height: 32px;
  position: relative;
  transform-style: preserve-3d;
  animation: dice-spin 0.6s ease-in-out infinite;
}

.dice-base {
  --dice-bg: #ffffff;
  --dice-border: #d1d5db;
  --dice-text: #000000;
  --dice-shadow: rgba(255, 255, 255, 0.3);
}

.dice-stress {
  --dice-bg: #facc15;
  --dice-border: #ca8a04;
  --dice-text: #000000;
  --dice-shadow: rgba(250, 204, 21, 0.4);
}

.dice-face-3d {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dice-bg);
  border: 2px solid var(--dice-border);
  border-radius: 6px;
  font-size: 16px;
  color: var(--dice-text);
  box-shadow:
    0 0 10px var(--dice-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

@keyframes dice-spin {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  25% {
    transform: rotateX(90deg) rotateY(45deg) rotateZ(0deg);
  }
  50% {
    transform: rotateX(180deg) rotateY(90deg) rotateZ(90deg);
  }
  75% {
    transform: rotateX(270deg) rotateY(135deg) rotateZ(180deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);
  }
}

@keyframes dice-jump {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-12px) scale(1.1);
  }
}

/* Stagger animations for each die */
.dice-3d:nth-child(odd) {
  animation-duration: 0.35s;
}

.dice-3d:nth-child(odd) .dice-cube {
  animation-duration: 0.5s;
  animation-direction: reverse;
}

.dice-3d:nth-child(3n) .dice-cube {
  animation-duration: 0.7s;
}

.dice-3d:nth-child(4n) {
  animation-duration: 0.45s;
}
</style>
