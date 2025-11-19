import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import { isLocale, DEFAULT_LOCALE } from '@/types'
import type { Locale } from '@/types'

/**
 * Detect user's preferred locale from browser settings
 * Fallback chain: navigator.language → DEFAULT_LOCALE ('en')
 */
function detectLocale(): Locale {
  try {
    const browserLang = navigator.language
    if (!browserLang) return DEFAULT_LOCALE
    const parts = browserLang.split('-')
    const browserLocale = parts[0] // e.g., 'en-US' → 'en'
    if (!browserLocale) return DEFAULT_LOCALE
    return isLocale(browserLocale) ? browserLocale : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

/**
 * Create vue-i18n instance with Composition API mode
 */
export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
  },
})
