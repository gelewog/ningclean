'use client'

import * as React from 'react'

export interface AdminPreferences {
  compactView: boolean
  showLiveIndicator: boolean
  autoRefresh: boolean
  refreshInterval: number
}

const defaultPreferences: AdminPreferences = {
  compactView: false,
  showLiveIndicator: true,
  autoRefresh: true,
  refreshInterval: 30,
}

const STORAGE_KEY = 'admin_preferences'

export function useAdminPreferences() {
  const [preferences, setPreferences] = React.useState<AdminPreferences>(defaultPreferences)
  const [loaded, setLoaded] = React.useState(false)

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) })
      } catch (e) {
        console.error('Failed to parse admin preferences:', e)
      }
    }
    setLoaded(true)
  }, [])

  // Auto-save to localStorage when preferences change
  React.useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    }
  }, [preferences, loaded])

  const updatePreference = <K extends keyof AdminPreferences>(
    key: K,
    value: AdminPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return {
    preferences,
    updatePreference,
    loaded,
  }
}

// Singleton instance for components that need to read preferences without re-rendering
export function getAdminPreferences(): AdminPreferences {
  if (typeof window === 'undefined') return defaultPreferences
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...defaultPreferences, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to get admin preferences:', e)
  }
  return defaultPreferences
}