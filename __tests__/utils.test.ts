import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('combines class names', () => {
    expect(cn('p-2', 'text-sm')).toBe('p-2 text-sm')
  })

  it('deduplicates tailwind classes', () => {
    expect(cn('text-black', 'text-white')).toBe('text-white')
  })
})
