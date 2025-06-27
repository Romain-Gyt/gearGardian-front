import { describe, it, expect } from 'vitest'
import { reducer } from '@/hooks/use-toast'

const baseToast = { id: '1', open: true, title: 'Hello' }

describe('useToast reducer', () => {
  it('adds a toast', () => {
    const state = reducer({ toasts: [] }, { type: 'ADD_TOAST', toast: baseToast })
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0]).toEqual(baseToast)
  })

  it('updates a toast', () => {
    const state = reducer({ toasts: [baseToast] }, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'Updated' }})
    expect(state.toasts[0].title).toBe('Updated')
  })

  it('dismisses a toast', () => {
    const state = reducer({ toasts: [baseToast] }, { type: 'DISMISS_TOAST', toastId: '1' })
    expect(state.toasts[0].open).toBe(false)
  })

  it('removes a toast', () => {
    const state = reducer({ toasts: [baseToast] }, { type: 'REMOVE_TOAST', toastId: '1' })
    expect(state.toasts).toHaveLength(0)
  })
})
