<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import type { ActionLogEntry } from '@/types'

interface Props {
  entries: ActionLogEntry[]
  isVisible: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggle: []
}>()

const { t } = useI18n()

/**
 * Format timestamp to HH:MM display format
 */
function formatTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Get translated action label
 */
function getActionLabel(action: ActionLogEntry['action']): string {
  switch (action) {
    case 'increment':
      return t('app.actionLog.incrementLabel')
    case 'decrement':
      return t('app.actionLog.decrementLabel')
    case 'reset':
      return t('app.actionLog.resetLabel')
  }
}
</script>

<template>
  <div class="mt-8">
    <!-- Toggle Button -->
    <button
      @click="emit('toggle')"
      :aria-label="t('app.actionLog.toggle')"
      :aria-expanded="isVisible"
      class="flex items-center gap-2 px-4 py-2 bg-[var(--color-alien-bg-secondary)] hover:bg-[var(--color-alien-bg-tertiary)] text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded transition-all hover:border-[var(--color-alien-accent)]"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="text-sm font-medium">{{ t('app.actionLog.toggle') }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isVisible }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Action Log Panel (Collapsible) -->
    <div
      class="overflow-hidden transition-all duration-300"
      :class="isVisible ? 'max-h-96 mt-4' : 'max-h-0'"
    >
      <div
        class="bg-[var(--color-alien-bg-secondary)] border border-[var(--color-alien-border)] rounded p-4"
      >
        <h3 class="text-lg font-semibold text-[var(--color-alien-text)] mb-3">
          {{ t('app.actionLog.title') }}
        </h3>

        <!-- Empty State -->
        <div
          v-if="entries.length === 0"
          class="text-center py-8 text-[var(--color-alien-text-dim)]"
        >
          {{ t('app.actionLog.empty') }}
        </div>

        <!-- Log Entries -->
        <div v-else class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="(entry, index) in entries"
            :key="`${entry.timestamp}-${index}`"
            class="flex items-center justify-between px-3 py-2 bg-[var(--color-alien-bg-tertiary)] rounded border border-[var(--color-alien-border)]"
          >
            <!-- Timestamp -->
            <span class="text-sm font-mono text-[var(--color-alien-text-dim)]">
              {{ formatTime(entry.timestamp) }}
            </span>

            <!-- Action -->
            <span
              class="text-sm font-medium"
              :class="{
                'text-[var(--color-alien-accent)]': entry.action === 'increment',
                'text-[var(--color-alien-warning)]': entry.action === 'decrement',
                'text-[var(--color-alien-danger)]': entry.action === 'reset',
              }"
            >
              {{ getActionLabel(entry.action) }}
            </span>

            <!-- Resulting Stress -->
            <span class="text-sm font-bold text-[var(--color-alien-text)]">
              {{ entry.resultingStress }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
