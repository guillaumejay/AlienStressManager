import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

describe('useLocalStorage', () => {
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

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default value when localStorage is empty', () => {
    const { storedValue } = useLocalStorage('test-key', 'default')

    expect(storedValue.value).toBe('default')
  })

  it('should load existing value from localStorage on initialization', () => {
    localStorageMock['test-key'] = JSON.stringify('stored-value')

    const { storedValue } = useLocalStorage('test-key', 'default')

    expect(storedValue.value).toBe('stored-value')
  })

  it('should reactively save changes to localStorage', async () => {
    const { storedValue } = useLocalStorage('test-key', 'initial')

    storedValue.value = 'updated'
    await nextTick()

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('updated')
    )
  })

  it('should support complex object types', async () => {
    interface TestObject {
      name: string
      count: number
    }

    const defaultValue: TestObject = { name: 'test', count: 0 }
    const { storedValue } = useLocalStorage('test-key', defaultValue)

    storedValue.value = { name: 'updated', count: 5 }
    await nextTick()

    expect(JSON.parse(localStorageMock['test-key'])).toEqual({
      name: 'updated',
      count: 5
    })
  })

  it('should handle QuotaExceededError gracefully', async () => {
    const { storedValue, error } = useLocalStorage('test-key', 'value')

    // Mock setItem to throw QuotaExceededError
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      const quotaError = new Error('QuotaExceededError')
      quotaError.name = 'QuotaExceededError'
      throw quotaError
    })

    storedValue.value = 'new-value'
    await nextTick()

    expect(error.value).toBeTruthy()
    expect(error.value?.message).toContain('quota exceeded')
  })

  it('should handle JSON parse errors when loading from localStorage', async () => {
    localStorageMock['test-key'] = 'invalid-json{{'

    const { storedValue } = useLocalStorage('test-key', 'default')

    // Should fall back to default value when JSON parsing fails
    expect(storedValue.value).toBe('default')
  })

  it('should sync value across tabs via StorageEvent', () => {
    const { storedValue } = useLocalStorage<string>('test-key', 'initial')

    // Simulate StorageEvent from another tab
    const storageEvent = new StorageEvent('storage', {
      key: 'test-key',
      newValue: JSON.stringify('value-from-another-tab'),
      oldValue: JSON.stringify('initial')
    })

    window.dispatchEvent(storageEvent)

    expect(storedValue.value).toBe('value-from-another-tab')
  })

  it('should ignore StorageEvent for different keys', () => {
    const { storedValue } = useLocalStorage<string>('test-key', 'initial')

    const storageEvent = new StorageEvent('storage', {
      key: 'different-key',
      newValue: JSON.stringify('other-value')
    })

    window.dispatchEvent(storageEvent)

    expect(storedValue.value).toBe('initial')
  })

  it('should use setStoredValue to update value', async () => {
    const { storedValue, setStoredValue } = useLocalStorage('test-key', 'initial')

    setStoredValue('manually-set')
    await nextTick()

    expect(storedValue.value).toBe('manually-set')
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('manually-set')
    )
  })

  it('should clear error after successful operation', async () => {
    const { storedValue, error } = useLocalStorage('test-key', 'value')

    // Cause an error
    vi.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('Storage error')
    })

    storedValue.value = 'error-value'
    await nextTick()

    expect(error.value).toBeTruthy()

    // Restore normal behavior
    vi.spyOn(window.localStorage, 'setItem').mockRestore()

    storedValue.value = 'success-value'
    await nextTick()

    expect(error.value).toBeNull()
  })
})
