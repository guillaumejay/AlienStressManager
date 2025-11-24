import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DiceRoller from '@/components/DiceRoller.vue'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import fr from '@/i18n/locales/fr.json'

describe('DiceRoller', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, fr },
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display stress dice as character current stress (read-only)', () => {
    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 5,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Find the stress dice display - it should show 5
    const stressDiceDisplay = wrapper.find('.text-yellow-400')
    expect(stressDiceDisplay.text()).toBe('5')
  })

  it('should update stress dice display when prop changes', async () => {
    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 3,
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.find('.text-yellow-400').text()).toBe('3')

    await wrapper.setProps({ stressDice: 7 })
    expect(wrapper.find('.text-yellow-400').text()).toBe('7')
  })

  it('should emit roll event when roll button is clicked', async () => {
    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 2,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Increase base dice to enable rolling
    const incrementButton = wrapper.find('button[aria-label="Increase base dice"]')
    await incrementButton.trigger('click')
    await nextTick()

    // Click roll button
    const rollButton = wrapper.findAll('button').find((btn) => btn.text().includes('Roll'))
    await rollButton?.trigger('click')
    await nextTick()

    expect(wrapper.emitted('roll')).toBeTruthy()
    expect(wrapper.emitted('roll')?.length).toBe(1)

    const emittedResult = wrapper.emitted('roll')?.[0][0] as {
      baseDiceResults: number[]
      stressDiceResults: number[]
      successes: number
      panicTriggered: boolean
    }
    expect(emittedResult.baseDiceResults).toHaveLength(1)
    expect(emittedResult.stressDiceResults).toHaveLength(2)
  })

  it('should show panic button when panic is triggered', async () => {
    // Mock random to always return 0 (which gives die result of 1)
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 2, // At least one stress die to trigger panic
      },
      global: {
        plugins: [i18n],
      },
    })

    // Increase base dice
    const incrementButton = wrapper.find('button[aria-label="Increase base dice"]')
    await incrementButton.trigger('click')
    await nextTick()

    // Roll
    const rollButton = wrapper.findAll('button').find((btn) => btn.text().includes('Roll'))
    await rollButton?.trigger('click')
    await nextTick()

    // Should show panic indicator and panic button
    expect(wrapper.text()).toContain('PANIC!')
    expect(wrapper.text()).toContain('Start Panic Roll')
  })

  it('should not show panic button when panic is not triggered', async () => {
    // Mock random to always return 0.999 (which gives die result of 6, no 1s)
    vi.spyOn(Math, 'random').mockReturnValue(0.999)

    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 2,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Increase base dice
    const incrementButton = wrapper.find('button[aria-label="Increase base dice"]')
    await incrementButton.trigger('click')
    await nextTick()

    // Roll
    const rollButton = wrapper.findAll('button').find((btn) => btn.text().includes('Roll'))
    await rollButton?.trigger('click')
    await nextTick()

    // Should NOT show panic button
    expect(wrapper.text()).not.toContain('PANIC!')
    expect(wrapper.text()).not.toContain('Start Panic Roll')
  })

  it('should emit startPanicRoll when panic roll button is clicked', async () => {
    // Mock random to trigger panic
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 1,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Increase base dice
    const incrementButton = wrapper.find('button[aria-label="Increase base dice"]')
    await incrementButton.trigger('click')
    await nextTick()

    // Roll
    const rollButton = wrapper.findAll('button').find((btn) => btn.text().includes('Roll'))
    await rollButton?.trigger('click')
    await nextTick()

    // Click panic roll button
    const panicButton = wrapper.findAll('button').find((btn) =>
      btn.text().includes('Start Panic Roll')
    )
    await panicButton?.trigger('click')
    await nextTick()

    expect(wrapper.emitted('startPanicRoll')).toBeTruthy()
  })

  it('should allow incrementing and decrementing base dice', async () => {
    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 0,
      },
      global: {
        plugins: [i18n],
      },
    })

    const incrementButton = wrapper.find('button[aria-label="Increase base dice"]')
    const decrementButton = wrapper.find('button[aria-label="Decrease base dice"]')

    // Initial value should be 0
    expect(wrapper.find('.text-2xl.font-bold.text-\\[var\\(--color-alien-text-bright\\)\\]').text()).toBe('0')

    // Increment
    await incrementButton.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.text-2xl.font-bold')[0].text()).toBe('1')

    // Increment again
    await incrementButton.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.text-2xl.font-bold')[0].text()).toBe('2')

    // Decrement
    await decrementButton.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.text-2xl.font-bold')[0].text()).toBe('1')
  })

  it('should not allow decrementing base dice below 0', async () => {
    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 0,
      },
      global: {
        plugins: [i18n],
      },
    })

    const decrementButton = wrapper.find('button[aria-label="Decrease base dice"]')

    // Should be disabled when base dice is 0
    expect(decrementButton.attributes('disabled')).toBe('')
  })

  it('should disable roll button when no dice are configured', async () => {
    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 0,
      },
      global: {
        plugins: [i18n],
      },
    })

    const rollButton = wrapper.findAll('button').find((btn) => btn.text().includes('Roll'))
    expect(rollButton?.attributes('disabled')).toBe('')
  })

  it('should display success count in results', async () => {
    // Mock to get all 6s (successes)
    vi.spyOn(Math, 'random').mockReturnValue(0.999)

    const wrapper = mount(DiceRoller, {
      props: {
        stressDice: 2,
      },
      global: {
        plugins: [i18n],
      },
    })

    // Increase base dice to 3
    const incrementButton = wrapper.find('button[aria-label="Increase base dice"]')
    await incrementButton.trigger('click')
    await incrementButton.trigger('click')
    await incrementButton.trigger('click')
    await nextTick()

    // Roll
    const rollButton = wrapper.findAll('button').find((btn) => btn.text().includes('Roll'))
    await rollButton?.trigger('click')
    await nextTick()

    // Should show 5 successes (3 base + 2 stress, all 6s)
    expect(wrapper.text()).toContain('5 successes')
  })
})
