'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query)
      
      // Initial check
      setMatches(media.matches)

      // Update on change
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      // Add listener
      media.addEventListener('change', listener)

      // Cleanup
      return () => {
        media.removeEventListener('change', listener)
      }
    }
  }, [query])

  return matches
}
