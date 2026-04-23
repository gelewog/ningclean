'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'

interface TiptapEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  error?: string
  label?: string
}

// Simple textarea-based editor as fallback when Tiptap is not installed
export function TiptapEditor({ value, onChange, placeholder = 'Write something...', error, label }: TiptapEditorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px]"
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}
