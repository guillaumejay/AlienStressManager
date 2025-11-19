<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/types'

const { t, locale, setLocale } = useI18n()

function handleLocaleChange(event: Event): void {
  const select = event.target as HTMLSelectElement
  const newLocale = select.value as Locale
  setLocale(newLocale)
}
</script>

<template>
  <div class="flex items-center gap-3">
    <label for="language-selector" class="text-sm font-medium text-[var(--color-alien-text-dim)]">
      {{ t('app.language.label') }}:
    </label>
    <select
      id="language-selector"
      :value="locale"
      @change="handleLocaleChange"
      class="px-3 py-2 bg-[var(--color-alien-bg-secondary)] text-[var(--color-alien-text)] border border-[var(--color-alien-border)] rounded focus:outline-none focus:border-[var(--color-alien-accent)] transition-colors cursor-pointer"
    >
      <option value="en">{{ t('app.language.en') }}</option>
      <option value="fr">{{ t('app.language.fr') }}</option>
    </select>
  </div>
</template>
