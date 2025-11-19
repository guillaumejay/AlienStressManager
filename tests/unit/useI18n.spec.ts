import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/types'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => {
    const locale = ref<Locale>('en')
    const t = vi.fn((key: string) => key)
    return { t, locale }
  }
}))

describe('useI18n', () => {
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {}

    const mockStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key]
      }),
      clear: vi.fn(() => {
        localStorageMock = {}
      })
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    })
  })

  it('should initialize with default locale when no stored preference', () => {
    const { locale } = useI18n()

    expect(['en', 'fr']).toContain(locale.value)
  })

  it('should load stored locale preference from localStorage', async () => {
    localStorageMock['languagePreference'] = JSON.stringify('fr')

    const { locale } = useI18n()
    await nextTick()

    expect(locale.value).toBe('fr')
  })

  it('should persist locale change to localStorage', async () => {
    const { setLocale } = useI18n()

    setLocale('fr')
    await nextTick()

    const stored = JSON.parse(localStorageMock['languagePreference'])
    expect(stored).toBe('fr')
  })

  it('should update vue-i18n locale when setLocale is called', async () => {
    const { locale, setLocale } = useI18n()

    setLocale('fr')
    await nextTick()

    expect(locale.value).toBe('fr')
  })

  it('should switch between English and French', async () => {
    const { locale, setLocale } = useI18n()

    setLocale('en')
    await nextTick()
    expect(locale.value).toBe('en')

    setLocale('fr')
    await nextTick()
    expect(locale.value).toBe('fr')

    setLocale('en')
    await nextTick()
    expect(locale.value).toBe('en')
  })

  it('should provide translation function', () => {
    const { t } = useI18n()

    expect(typeof t).toBe('function')
  })

  it('should persist locale across multiple useI18n calls', async () => {
    const { setLocale } = useI18n()

    setLocale('fr')
    await nextTick()

    // Simulate component remount
    const { locale: newLocale } = useI18n()
    await nextTick()

    expect(newLocale.value).toBe('fr')
  })
})
