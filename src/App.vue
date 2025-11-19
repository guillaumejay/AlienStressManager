<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StressTracker from './components/StressTracker.vue'
import LanguageSelector from './components/LanguageSelector.vue'

const { t } = useI18n()
</script>

<template>
  <div
    class="min-h-screen bg-[var(--color-alien-bg-primary)] text-[var(--color-alien-text)] p-4 md:p-8"
  >
    <!-- Header with Title and Language Selector -->
    <header class="max-w-4xl mx-auto mb-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <h1 class="text-3xl md:text-4xl font-bold text-[var(--color-alien-text-bright)]">
          {{ t('app.title') }}
        </h1>
        <LanguageSelector />
      </div>
      <div class="h-px bg-[var(--color-alien-border)]"></div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto">
      <StressTracker />
    </main>
  </div>
</template>
