import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useActionLog } from '@/composables/useActionLog'

describe('useActionLog', () => {
  beforeEach(() => {
    const { clearLog } = useActionLog()
    clearLog()
    // Reset time mocking
    vi.useFakeTimers()
  })

  it('should initialize with empty entries', () => {
    const { entries } = useActionLog()

    expect(entries.value).toEqual([])
  })

  it('should log increment action with timestamp', () => {
    const mockDate = new Date('2025-11-19T14:30:00.000Z')
    vi.setSystemTime(mockDate)

    const { entries, logAction } = useActionLog()

    logAction('increment', 5)

    expect(entries.value).toHaveLength(1)
    expect(entries.value[0].action).toBe('increment')
    expect(entries.value[0].resultingStress).toBe(5)
    expect(entries.value[0].timestamp).toBe(mockDate.toISOString())

    vi.useRealTimers()
  })

  it('should log decrement action', () => {
    const { entries, logAction } = useActionLog()

    logAction('decrement', 3)

    expect(entries.value[0].action).toBe('decrement')
    expect(entries.value[0].resultingStress).toBe(3)

    vi.useRealTimers()
  })

  it('should log reset action', () => {
    const { entries, logAction } = useActionLog()

    logAction('reset', 0)

    expect(entries.value[0].action).toBe('reset')
    expect(entries.value[0].resultingStress).toBe(0)

    vi.useRealTimers()
  })

  it('should maintain entries in reverse chronological order (newest first)', () => {
    const { entries, logAction } = useActionLog()

    // Log three actions at different times
    vi.setSystemTime(new Date('2025-11-19T14:30:00.000Z'))
    logAction('increment', 1)

    vi.setSystemTime(new Date('2025-11-19T14:31:00.000Z'))
    logAction('increment', 2)

    vi.setSystemTime(new Date('2025-11-19T14:32:00.000Z'))
    logAction('decrement', 1)

    // Newest entry should be first
    expect(entries.value).toHaveLength(3)
    expect(entries.value[0].timestamp).toBe('2025-11-19T14:32:00.000Z')
    expect(entries.value[1].timestamp).toBe('2025-11-19T14:31:00.000Z')
    expect(entries.value[2].timestamp).toBe('2025-11-19T14:30:00.000Z')

    vi.useRealTimers()
  })

  it('should clear all log entries', () => {
    const { entries, logAction, clearLog } = useActionLog()

    logAction('increment', 1)
    logAction('increment', 2)
    logAction('reset', 0)

    expect(entries.value).toHaveLength(3)

    clearLog()

    expect(entries.value).toEqual([])

    vi.useRealTimers()
  })

  it('should allow logging after clear', () => {
    const { entries, logAction, clearLog } = useActionLog()

    logAction('increment', 1)
    clearLog()
    logAction('increment', 2)

    expect(entries.value).toHaveLength(1)
    expect(entries.value[0].resultingStress).toBe(2)

    vi.useRealTimers()
  })

  it('should create valid ISO timestamp', () => {
    const { entries, logAction } = useActionLog()

    logAction('increment', 5)

    const timestamp = entries.value[0].timestamp
    const date = new Date(timestamp)

    expect(date.toISOString()).toBe(timestamp)
    expect(isNaN(date.getTime())).toBe(false)

    vi.useRealTimers()
  })

  it('should handle multiple rapid log entries', () => {
    const { entries, logAction } = useActionLog()

    // Simulate rapid button clicks
    logAction('increment', 1)
    logAction('increment', 2)
    logAction('increment', 3)
    logAction('decrement', 2)
    logAction('reset', 0)

    expect(entries.value).toHaveLength(5)
    expect(entries.value[0].action).toBe('reset') // Most recent
    expect(entries.value[4].action).toBe('increment') // Oldest

    vi.useRealTimers()
  })

  it('should track resulting stress correctly', () => {
    const { entries, logAction } = useActionLog()

    logAction('increment', 1)
    logAction('increment', 2)
    logAction('increment', 3)
    logAction('decrement', 2)
    logAction('reset', 0)

    // Check reverse chronological stress values
    expect(entries.value[0].resultingStress).toBe(0) // Reset
    expect(entries.value[1].resultingStress).toBe(2) // Decrement
    expect(entries.value[2].resultingStress).toBe(3) // Increment
    expect(entries.value[3].resultingStress).toBe(2) // Increment
    expect(entries.value[4].resultingStress).toBe(1) // Increment

    vi.useRealTimers()
  })
})
