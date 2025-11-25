<script setup lang="ts">
interface Props {
  baseDiceResults: number[]
  stressDiceResults: number[]
  showSummary?: boolean
  successes?: number
  panicTriggered?: boolean
}

withDefaults(defineProps<Props>(), {
  showSummary: false,
  successes: 0,
  panicTriggered: false,
})
</script>

<template>
  <div class="flex flex-wrap gap-1 items-center">
    <!-- Base dice (sorted descending) -->
    <span
      v-for="(die, i) in [...baseDiceResults].sort((a, b) => b - a)"
      :key="'base-' + i"
      class="inline-flex items-center justify-center w-6 h-6 rounded border font-mono font-bold"
      :class="die === 6 ? 'bg-green-800 border-green-600 text-green-300' : 'bg-[var(--color-alien-bg-secondary)] border-[var(--color-alien-border)] text-[var(--color-alien-text-dim)]'"
    >
      {{ die }}
    </span>
    <!-- Separator -->
    <span v-if="baseDiceResults.length > 0 && stressDiceResults.length > 0" class="text-[var(--color-alien-text-dim)] mx-1">|</span>
    <!-- Stress dice (sorted descending) -->
    <span
      v-for="(die, i) in [...stressDiceResults].sort((a, b) => b - a)"
      :key="'stress-' + i"
      class="inline-flex items-center justify-center w-6 h-6 rounded border font-mono font-bold"
      :class="{
        'bg-green-800 border-green-600 text-green-300': die === 6,
        'bg-red-800 border-red-600 text-red-300': die === 1,
        'bg-yellow-900 border-yellow-700 text-yellow-400': die !== 6 && die !== 1
      }"
    >
      {{ die }}
    </span>
    <!-- Result summary (optional) -->
    <span v-if="showSummary" class="ml-2 text-[var(--color-alien-text-dim)]">
      = {{ successes }} {{ successes === 1 ? 'success' : 'successes' }}
    </span>
    <span v-if="panicTriggered" class="text-red-400 font-bold ml-1">PANIC!</span>
  </div>
</template>
