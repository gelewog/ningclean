'use client'

import * as React from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { triggerFileUpload } from './FileUploadZone'

interface UploadButtonProps {
  currentPath: string
}

export function UploadButton({ currentPath }: UploadButtonProps) {
  return (
    <Button variant="default" size="sm" onClick={triggerFileUpload} className="gap-2">
      <Upload className="w-4 h-4" />
      Upload
    </Button>
  )
}
