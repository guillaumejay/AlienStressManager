import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionLog from '@/components/ActionLog.vue'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import fr from '@/i18n/locales/fr.json'
import type { ActionLogEntry } from '@/types'

describe('ActionLog', () => {
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

  it('should render toggle button', () => {
    const wrapper = mount(ActionLog, {
      props: {
        entries: [],
        isVisible: false
      },
      global: {
        plugins: [i18n]
      }
    })

    const toggleButton = wrapper.find('button[aria-label="Toggle History"]')
    expect(toggleButton.exists()).toBe(true)
  })

  it('should emit toggle event when toggle button is clicked', async () => {
    const wrapper = mount(ActionLog, {
      props: {
        entries: [],
        isVisible: false
      },
      global: {
        plugins: [i18n]
      }
    })

    const toggleButton = wrapper.find('button[aria-label="Toggle History"]')
    await toggleButton.trigger('click')

    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('should show empty state when no entries', () => {
    const wrapper = mount(ActionLog, {
      props: {
        entries: [],
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('No actions recorded yet')
  })

  it('should hide log panel when isVisible is false', () => {
    const wrapper = mount(ActionLog, {
      props: {
        entries: [],
        isVisible: false
      },
      global: {
        plugins: [i18n]
      }
    })

    const panel = wrapper.find('.overflow-hidden')
    expect(panel.classes()).toContain('max-h-0')
  })

  it('should show log panel when isVisible is true', () => {
    const wrapper = mount(ActionLog, {
      props: {
        entries: [],
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const panel = wrapper.find('.overflow-hidden')
    expect(panel.classes()).toContain('max-h-96')
  })

  it('should display log entries with timestamps', () => {
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'increment',
        resultingStress: 1
      },
      {
        timestamp: '2025-11-19T14:31:00.000Z',
        action: 'increment',
        resultingStress: 2
      }
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const logItems = wrapper.findAll('.bg-\\[var\\(--color-alien-bg-tertiary\\)\\]')
    expect(logItems).toHaveLength(2)
  })

  it('should display entries in reverse chronological order (newest first)', () => {
    // Note: entries array is already in reverse chronological order from useActionLog
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:32:00.000Z',
        action: 'decrement',
        resultingStress: 1
      },
      {
        timestamp: '2025-11-19T14:31:00.000Z',
        action: 'increment',
        resultingStress: 2
      },
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'increment',
        resultingStress: 1
      }
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const logItems = wrapper.findAll('.bg-\\[var\\(--color-alien-bg-tertiary\\)\\]')

    // First item should be the most recent (decrement to 1)
    const firstItemHtml = logItems[0].html()
    expect(firstItemHtml).toContain('-1')

    // Last item should be the oldest (increment to 1)
    const lastItemHtml = logItems[2].html()
    expect(lastItemHtml).toContain('+1')
  })

  it('should display correct action labels', () => {
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'increment',
        resultingStress: 1
      },
      {
        timestamp: '2025-11-19T14:31:00.000Z',
        action: 'decrement',
        resultingStress: 0
      },
      {
        timestamp: '2025-11-19T14:32:00.000Z',
        action: 'reset',
        resultingStress: 0
      }
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const text = wrapper.text()
    expect(text).toContain('+1') // increment
    expect(text).toContain('-1') // decrement
    expect(text).toContain('Reset to 0') // reset
  })

  it('should format timestamps as HH:MM', () => {
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'increment',
        resultingStress: 1
      }
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    // Should contain time in HH:MM format
    const timeElements = wrapper.findAll('.font-mono')
    expect(timeElements.length).toBeGreaterThan(0)
    // The exact format depends on locale, but should be colon-separated
    expect(timeElements[0].text()).toMatch(/\d{2}:\d{2}/)
  })

  it('should apply different colors for different action types', () => {
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'increment',
        resultingStress: 1
      },
      {
        timestamp: '2025-11-19T14:31:00.000Z',
        action: 'decrement',
        resultingStress: 0
      },
      {
        timestamp: '2025-11-19T14:32:00.000Z',
        action: 'reset',
        resultingStress: 0
      }
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const html = wrapper.html()

    // Increment should have accent color
    expect(html).toContain('text-[var(--color-alien-accent)]')

    // Decrement should have warning color
    expect(html).toContain('text-[var(--color-alien-warning)]')

    // Reset should have danger color
    expect(html).toContain('text-[var(--color-alien-danger)]')
  })

  it('should display resulting stress value for each entry', () => {
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'increment',
        resultingStress: 5
      },
      {
        timestamp: '2025-11-19T14:31:00.000Z',
        action: 'increment',
        resultingStress: 6
      }
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const text = wrapper.text()
    expect(text).toContain('5')
    expect(text).toContain('6')
  })

  it('should have aria-expanded attribute on toggle button', () => {
    const wrapper = mount(ActionLog, {
      props: {
        entries: [],
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const toggleButton = wrapper.find('button[aria-label="Toggle History"]')
    expect(toggleButton.attributes('aria-expanded')).toBe('true')
  })

  it('should rotate chevron icon when expanded', () => {
    const wrapper = mount(ActionLog, {
      props: {
        entries: [],
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const chevron = wrapper.findAll('svg').find(svg =>
      svg.classes().includes('rotate-180')
    )
    expect(chevron).toBeDefined()
  })

  it('should display panic details for panic actions', () => {
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'panic',
        resultingStress: 7,
        panicDetails: {
          dieRoll: 1,
          stressBefore: 8,
          modifier: -2,
          finalRoll: 7,
          effectName: 'Nervous Twitch',
        },
      },
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Panic!')
    const details = wrapper.find('.text-xs')
    expect(details.text()).toContain('Nervous Twitch')
    expect(details.text()).toContain('1 (d6)')
    expect(details.text()).toContain('+ 8 (stress)')
    expect(details.text()).toContain('- 2 (mod)')
    expect(details.text()).toContain('= 7')
  })

  it('should display from panic label for stress changes from panic', () => {
    const entries: ActionLogEntry[] = [
      {
        timestamp: '2025-11-19T14:30:00.000Z',
        action: 'decrement',
        resultingStress: 7,
        fromPanic: true,
      },
    ]

    const wrapper = mount(ActionLog, {
      props: {
        entries,
        isVisible: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const actionLabel = wrapper.find('[data-testid="action-label"]')
    expect(actionLabel.text()).toContain(i18n.global.t('app.actionLog.decrementLabel'))
    expect(actionLabel.text()).toContain(`(${i18n.global.t('app.panic.roll')})`)
  })
})
