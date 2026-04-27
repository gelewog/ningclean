import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  // RED - Test basic className merging
  it('merges class names', () => {
    // RED - Should merge simple classes
    const result = cn('class1', 'class2')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })

  it('handles conditional classes', () => {
    // RED - Conditional classes
    const isActive = true
    const result = cn('base', isActive && 'active')
    // GREEN - Should include active when condition is true
    expect(result).toContain('base')
    expect(result).toContain('active')
  })

  it('filters out falsy values', () => {
    // RED - Falsy values should be filtered
    const result = cn('base', false && 'hidden', null, undefined)
    // GREEN - Should not contain falsy/empty classes
    expect(result).toBe('base')
  })

  it('resolves tailwind conflicts', () => {
    // RED - Same CSS property from different classes
    const result = cn('p-4', 'p-2')
    // GREEN - Should use last value (p-2)
    expect(result).toBe('p-2')
  })

  it('handles complex class merging', () => {
    // RED - Complex real-world example
    const result = cn(
      'bg-white dark:bg-slate-900',
      'px-4 py-2',
      true && 'hover:bg-gray-100',
      false && 'hidden',
      'rounded-lg'
    )
    // GREEN - Should merge all valid classes
    expect(result).toContain('bg-white')
    expect(result).toContain('dark:bg-slate-900')
    expect(result).toContain('hover:bg-gray-100')
    expect(result).not.toContain('hidden')
  })
})
