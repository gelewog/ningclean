'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void; // Callback saat file dipilih/tidak dipilih
  folder: 'gallery' | 'services' | 'team' | 'testimonials' | 'settings';
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  previewClassName?: string;
  autoUpload?: boolean; // true = upload langsung, false = preview lokal saja
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BASE_URL = API_URL.replace(/\/api$/, '');

export function ImageUpload({
  value,
  onChange,
  onFileSelect,
  folder,
  label = 'Image',
  placeholder = 'https://...',
  required = false,
  error,
  previewClassName = 'h-40 w-full',
  autoUpload = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URL saat unmount atau value berubah
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  // Reset local state saat value external berubah (misalnya saat edit item)
  useEffect(() => {
    if (value && !value.startsWith('blob:')) {
      setLocalPreview(null);
      setSelectedFile(null);
    }
  }, [value]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BASE_URL}/api/upload/${folder}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      
      // Clear local preview setelah upload sukses
      if (localPreview && localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
      setLocalPreview(null);
      setSelectedFile(null);
      
      onChange(data.data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed');
      return;
    }

    // Buat preview lokal
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setSelectedFile(file);
    setUploadError(null);

    // Notify parent tentang file yang dipilih
    onFileSelect?.(file);

    if (autoUpload) {
      uploadFile(file);
    } else {
      // Mode deferred: kirim blob URL sementara ke parent
      onChange(previewUrl);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const triggerFileInput = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  const clearImage = () => {
    if (localPreview && localPreview.startsWith('blob:')) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview(null);
    setSelectedFile(null);
    setUploadError(null);
    onChange('');
    onFileSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Method untuk upload manual (dipanggil saat form submit)
  const uploadSelectedFile = async (): Promise<string | null> => {
    if (!selectedFile) return value; // Return existing value if no new file
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${BASE_URL}/api/upload/${folder}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      
      // Clear local preview
      if (localPreview && localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
      setLocalPreview(null);
      setSelectedFile(null);
      
      // Log compression info
      console.log('[ImageUpload] Compressed:', data.data.compression, 'saved');
      console.log('[ImageUpload] Original:', data.data.originalSize, '→ WebP:', data.data.size);
      
      onChange(data.data.url);
      onFileSelect?.(null);
      return data.data.url;
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    }
  };

  // Determine which URL to show
  const displayUrl = localPreview || value;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {displayUrl ? (
        <div className="relative">
          <div className={`relative overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 ${previewClassName}`}>
            <img
              src={displayUrl.startsWith('http') || displayUrl.startsWith('blob:') 
                ? displayUrl 
                : `${BASE_URL}${displayUrl}`}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af"%3EError loading image%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Drop zone - also clickable */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerFileInput(e);
            }}
            className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer hover:border-gray-400 dark:hover:border-slate-500 ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-slate-600'
            } ${previewClassName} flex flex-col items-center justify-center`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center text-gray-500">
                <Loader2 size={32} className="animate-spin mb-2" />
                <span className="text-sm">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon size={32} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
                  Drag & drop image here
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  or click to browse
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual URL Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white ${
            error || uploadError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } focus:outline-none focus:ring-1`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerFileInput(e);
          }}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-md transition-colors"
          title="Upload from computer"
        >
          <Upload size={18} />
        </button>
      </div>

      {(error || uploadError) && (
        <p className="text-sm text-red-500">{error || uploadError}</p>
      )}
    </div>
  );
}

// Hook untuk handle upload saat form submit
export function useImageUpload() {
  const uploadImage = async (
    file: File | null,
    folder: 'gallery' | 'services' | 'team' | 'testimonials' | 'settings',
    subfolder?: string
  ): Promise<string | null> => {
    if (!file) {
      console.log('[useImageUpload] No file provided, returning null')
      return null;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const BASE_URL = API_URL.replace(/\/api$/, '');

    // Build URL with optional subfolder query parameter
    let uploadUrl = `${BASE_URL}/api/upload/${folder}`;
    if (subfolder) {
      uploadUrl += `?subfolder=${subfolder}`;
    }

    console.log('[useImageUpload] Starting upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      folder,
      subfolder,
      uploadUrl
    })

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('[useImageUpload] Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[useImageUpload] Upload failed:', errorData)
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('[useImageUpload] Upload success:', data.data.url)
      return data.data.url;
    } catch (err) {
      console.error('[useImageUpload] Upload error:', err);
      return null;
    }
  };

  return { uploadImage };
}
