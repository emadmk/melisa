'use client'

import { useState, useRef } from 'react'
import { Upload, File, X, Loader2 } from 'lucide-react'

interface FileUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  folder?: string
  label?: string
  accept?: string
}

export default function FileUpload({
  value,
  onChange,
  folder = 'files',
  label = 'File',
  accept = '.pdf,.doc,.docx,.xls,.xlsx',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        onChange(data.data.url)
        setFileName(data.data.originalName)
      } else {
        setError(data.message || 'Upload error')
      }
    } catch {
      setError('Error uploading file')
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(null)
    setFileName(null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {value ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <File className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              {fileName || value.split('/').pop()}
            </p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              View File
            </a>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click or drag file here</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
