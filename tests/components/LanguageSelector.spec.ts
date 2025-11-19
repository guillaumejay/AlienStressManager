import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import fr from '@/i18n/locales/fr.json'

describe('LanguageSelector', () => {
  let localStorageMock: Record<string, string>

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, fr }
  })

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
      writable: true,
      configurable: true
    })
  })

  it('should render language selector dropdown', () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
  })

  it('should have English and French options', () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    const options = wrapper.findAll('option')
    expect(options).toHaveLength(2)
    expect(options[0].attributes('value')).toBe('en')
    expect(options[1].attributes('value')).toBe('fr')
  })

  it('should display current locale as selected', () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    const select = wrapper.find('select')
    expect((select.element as HTMLSelectElement).value).toBe('en')
  })

  it('should change locale when selection changes', async () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    const select = wrapper.find('select')
    await select.setValue('fr')
    await nextTick()

    expect((select.element as HTMLSelectElement).value).toBe('fr')
  })

  it('should persist locale to localStorage when changed', async () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    const select = wrapper.find('select')
    await select.setValue('fr')
    await nextTick()

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'languagePreference',
      JSON.stringify('fr')
    )
  })

  it('should display label for language selector', () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Language:')
  })

  it('should update UI text when locale changes', async () => {
    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    // Switch to French
    const select = wrapper.find('select')
    await select.setValue('fr')
    await nextTick()

    // Get i18n instance and check locale
    const label = wrapper.find('label')
    expect(label.text()).toContain('Langue')
  })

  it('should load persisted locale from localStorage on mount', async () => {
    localStorageMock['languagePreference'] = JSON.stringify('fr')

    const wrapper = mount(LanguageSelector, {
      global: {
        plugins: [i18n]
      }
    })

    await nextTick()

    const select = wrapper.find('select')
    expect((select.element as HTMLSelectElement).value).toBe('fr')
  })
})
