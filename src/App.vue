<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StressTracker from './components/StressTracker.vue'
import LanguageSelector from './components/LanguageSelector.vue'
import Footer from './components/Footer.vue'

const { t } = useI18n()
</script>

<template>
  <div
    class="min-h-screen bg-[var(--color-alien-bg-primary)] text-[var(--color-alien-text)] px-3 py-2 md:px-6 md:py-4"
  >
    <!-- Header with Title and Language Selector -->
    <header class="max-w-2xl mx-auto mb-3">
      <div class="flex items-center justify-between gap-2 pb-2 border-b border-[var(--color-alien-border)]">
        <h1 class="text-xl md:text-2xl font-bold text-[var(--color-alien-text-bright)]">
          {{ t('app.title') }}
        </h1>
        <LanguageSelector />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-2xl mx-auto">
      <StressTracker />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
