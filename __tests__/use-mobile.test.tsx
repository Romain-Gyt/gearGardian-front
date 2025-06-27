import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

function setWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width })
  window.dispatchEvent(new Event('resize'))
}

describe('useIsMobile', () => {
  it('detects mobile width', () => {
    setWidth(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('detects desktop width', () => {
    setWidth(1024)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
