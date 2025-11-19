import { useI18n as useVueI18n } from 'vue-i18n'
import { watch } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, DEFAULT_LOCALE, isLocale } from '@/types'
import type { Locale } from '@/types'

/**
 * i18n composable wrapper with localStorage persistence
 *
 * Wraps vue-i18n's useI18n() and adds locale persistence to localStorage.
 * Locale changes are automatically saved and restored across sessions.
 *
 * @returns Translation function, current locale, and setLocale function
 */
export function useI18n() {
  const { t, locale: vueLocale } = useVueI18n()

  // Persist locale preference to localStorage
  const { storedValue: storedLocale } = useLocalStorage<Locale>(
    STORAGE_KEYS.LANGUAGE_PREFERENCE,
    DEFAULT_LOCALE,
  )

  // Sync vue-i18n locale with stored locale on initialization
  if (isLocale(storedLocale.value)) {
    vueLocale.value = storedLocale.value
  }

  /**
   * Set locale and persist to localStorage
   *
   * @param newLocale - Locale to switch to
   */
  function setLocale(newLocale: Locale): void {
    vueLocale.value = newLocale
    storedLocale.value = newLocale
  }

  // Watch for external locale changes (e.g., from other components)
  // and sync to localStorage
  watch(vueLocale, (newLocale) => {
    if (isLocale(newLocale as string)) {
      storedLocale.value = newLocale as Locale
    }
  })

  return {
    t,
    locale: vueLocale as import('vue').Ref<Locale>,
    setLocale,
  }
}
