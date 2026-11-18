import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRequestCache } from '../server/utils/request-cache'

afterEach(() => vi.useRealTimers())

describe('request cache', () => {
  it('shares a pending request and reloads it after expiry', async () => {
    vi.useFakeTimers()
    const load = vi.fn(async (key: string) => key)
    const get = createRequestCache(load)
    const first = get('character?page=1')
    const second = get('character?page=1')
    expect(await first).toBe('character?page=1')
    expect(await second).toBe('character?page=1')
    expect(load).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(3_600_001)
    await get('character?page=1')
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('evicts the oldest entry when capacity is reached', async () => {
    const load = vi.fn(async (key: string) => key)
    const get = createRequestCache(load, 2)
    await get('a')
    await get('b')
    await get('c')
    await get('a')
    expect(load).toHaveBeenCalledTimes(4)
  })

  it('retries a failed request after its short cooldown', async () => {
    vi.useFakeTimers()
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue('ok')
    const get = createRequestCache(load)
    await expect(get('a')).rejects.toThrow('offline')
    await expect(get('a')).rejects.toThrow('offline')
    expect(load).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(60_001)
    await expect(get('a')).resolves.toBe('ok')
    expect(load).toHaveBeenCalledTimes(2)
  })
})
