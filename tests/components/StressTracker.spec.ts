import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
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
    messages: { en, fr },
  })

  beforeEach(() => {
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
      }),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
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
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 0, hasNerveOfSteel: false })

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
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 5, hasNerveOfSteel: false })

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
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 0, hasNerveOfSteel: false })

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
    localStorageMock['character'] = JSON.stringify({ name: 'Test Character', stress: 10, hasNerveOfSteel: false })

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
    localStorageMock['character'] = JSON.stringify({ name: 'Test', stress: 5, hasNerveOfSteel: false })

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
    localStorageMock['character'] = JSON.stringify({ name: 'Ellen Ripley', stress: 3, hasNerveOfSteel: false })

    const wrapper = mount(StressTracker, {
      global: {
        plugins: [i18n]
      }
    })

    await nextTick()

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('Ellen Ripley')
  })

  it('renders Nerve of Steel checkbox and reflects state', async () => {
    localStorageMock['character'] = JSON.stringify({
      name: 'Ripley',
      stress: 3,
      hasNerveOfSteel: true,
    })
    const wrapper = mount(StressTracker, { global: { plugins: [i18n] } })
    await nextTick()

    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.exists()).toBe(true)
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('toggles Nerve of Steel when checkbox is clicked', async () => {
    localStorageMock['character'] = JSON.stringify({
      name: 'Ripley',
      stress: 3,
      hasNerveOfSteel: false,
    })
    const wrapper = mount(StressTracker, { global: { plugins: [i18n] } })
    await nextTick()

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)

    const stored = JSON.parse(localStorageMock['character'])
    expect(stored.hasNerveOfSteel).toBe(true)
  })

  it('displays panic result after clicking panic button', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // Die roll will be 1
    localStorageMock['character'] = JSON.stringify({
      name: 'Ripley',
      stress: 8,
      hasNerveOfSteel: true,
    }) // Roll: 1 + 8 - 2 = 7

    const wrapper = mount(StressTracker, { global: { plugins: [i18n] } })
    await nextTick()

    expect(wrapper.find('[data-testid="panic-result"]').exists()).toBe(false)

    const panicButton = wrapper.find('button[aria-label="Panic Roll"]')
    await panicButton.trigger('click')
    await nextTick()

    const resultDisplay = wrapper.find('[data-testid="panic-result"]')
    expect(resultDisplay.exists()).toBe(true)
    expect(resultDisplay.text().toUpperCase()).toContain('NERVOUS TWITCH (7)')
    expect(resultDisplay.text()).toContain(
      'Your STRESS LEVEL, and the STRESS LEVEL of all friendly PCs in SHORT range of you, increases by one.'
    )

    // Check that stress was updated
    const stressCounter = wrapper.find('.text-6xl')
    expect(stressCounter.text()).toBe('9') // 8 + 1
  })

  it('displays alert zone for notes and action loss', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // Die roll will be 1
    localStorageMock['character'] = JSON.stringify({
      name: 'Ripley',
      stress: 11, // SEEK COVER roll is 11, Scream is 12
      hasNerveOfSteel: false,
    }) // Roll: 1 + 11 = 12

    const wrapper = mount(StressTracker, { global: { plugins: [i18n] } })
    await nextTick()

    const panicButton = wrapper.find('button[aria-label="Panic Roll"]')
    await panicButton.trigger('click')
    await nextTick()
    
    const alertZone = wrapper.find('.bg-red-900')
    expect(alertZone.exists()).toBe(true)
    expect(alertZone.text()).toContain('You lose your next slow action.')
    expect(alertZone.text()).toContain(
      'Every friendly character who hears your scream must make an immediate Panic Roll.'
    )
  })

  it('displays alert zone for other stress change', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // Die roll will be 1
    localStorageMock['character'] = JSON.stringify({
      name: 'Ripley',
      stress: 6,
      hasNerveOfSteel: false,
    }) // Roll: 1 + 6 = 7

    const wrapper = mount(StressTracker, { global: { plugins: [i18n] } })
    await nextTick()

    const panicButton = wrapper.find('button[aria-label="Panic Roll"]')
    await panicButton.trigger('click')
    await nextTick()
    
    const alertZone = wrapper.find('.bg-red-900')
    expect(alertZone.exists()).toBe(true)
    expect(alertZone.text()).toContain('Stress level of all friendly PCs in short range increases by 1.')
  })
})