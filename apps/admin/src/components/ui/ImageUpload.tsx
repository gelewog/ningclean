'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: 'gallery' | 'services' | 'team' | 'testimonials' | 'settings';
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  previewClassName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Image',
  placeholder = 'https://...',
  required = false,
  error,
  previewClassName = 'h-40 w-full',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload/${folder}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    }
  }, [folder]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [folder]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {value ? (
        <div className="relative">
          <div className={`relative overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 ${previewClassName}`}>
            <img
              src={value.startsWith('http') ? value : `${API_URL}${value}`}
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
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
          } ${previewClassName} flex flex-col items-center justify-center`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center text-gray-500">
              <Loader2 size={32} className="animate-spin mb-2" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <>
              <ImageIcon size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
                Drag & drop image here, or{' '}
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: JPEG, PNG, WebP, GIF (max 5MB)
              </p>
            </>
          )}
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
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        <button
          type="button"
          onClick={handleButtonClick}
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
