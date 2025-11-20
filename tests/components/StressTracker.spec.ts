import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import StressTracker from '@/components/StressTracker.vue'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import fr from '@/i18n/locales/fr.json'

describe('StressTracker', () => {
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

  it('should render character name input', () => {
    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Enter character name')
  })

  it('should show stress tracker even when name is empty', () => {
    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    const stressCounter = wrapper.find('.text-6xl')
    expect(stressCounter.exists()).toBe(true)
    expect(stressCounter.text()).toBe('0')
  })

  it('should increment stress when increment button is clicked', async () => {
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 0 })

    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    await nextTick()

    const incrementButton = wrapper.findAll('button').find(btn =>
      btn.attributes('aria-label') === 'Increase'
    )

    await incrementButton?.trigger('click')
    await nextTick()

    const stressCounter = wrapper.find('.text-6xl')
    expect(stressCounter.text()).toBe('1')
  })

  it('should decrement stress when decrement button is clicked', async () => {
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 5 })

    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    await nextTick()

    const decrementButton = wrapper.findAll('button').find(btn =>
      btn.attributes('aria-label') === 'Decrease'
    )

    await decrementButton?.trigger('click')
    await nextTick()

    const stressCounter = wrapper.find('.text-6xl')
    expect(stressCounter.text()).toBe('4')
  })

  it('should not decrement stress below 0', async () => {
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 0 })

    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    await nextTick()

    const decrementButton = wrapper.findAll('button').find(btn =>
      btn.attributes('aria-label') === 'Decrease'
    )

    expect(decrementButton?.attributes('disabled')).toBe('')
  })

  it('should reset stress to 0 when reset button is clicked', async () => {
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 10 })

    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    await nextTick()

    const resetButton = wrapper.findAll('button').find(btn =>
      btn.attributes('aria-label') === 'Reset'
    )

    await resetButton?.trigger('click')
    await nextTick()

    const stressCounter = wrapper.find('.text-6xl')
    expect(stressCounter.text()).toBe('0')
  })

  it('should have ARIA labels on all control buttons', () => {
    localStorageMock['character'] = JSON.stringify({ name: 'Test', stress: 5 })

    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    const buttons = wrapper.findAll('button')
    const ariaLabels = buttons.map(btn => btn.attributes('aria-label')).filter(Boolean)

    expect(ariaLabels).toContain('Decrease')
    expect(ariaLabels).toContain('Reset')
    expect(ariaLabels).toContain('Increase')
  })

  it('should display character name in the input field', async () => {
    localStorageMock['character'] = JSON.stringify({ name: 'Ellen Ripley', stress: 3 })

    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    await nextTick()

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('Ellen Ripley')
  })
})
