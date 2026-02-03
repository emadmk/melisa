'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import {
  Upload,
  X,
  Search,
  Grid,
  List,
  Check,
  Trash2,
  Download,
  Copy,
  File,
} from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  url: string
  type: 'image' | 'pdf' | 'other'
  size: string
  uploadedAt: string
  dimensions?: string
}

interface MediaLibraryProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (file: MediaFile) => void
  multiple?: boolean
}

const mockFiles: MediaFile[] = [
  {
    id: '1',
    name: 'product-1.jpg',
    url: '/images/products/product-1.jpg',
    type: 'image',
    size: '245 KB',
    uploadedAt: '۱۴۰۲/۱۰/۱۵',
    dimensions: '800×600',
  },
  {
    id: '2',
    name: 'catalog-motorola.pdf',
    url: '/uploads/catalogs/motorola.pdf',
    type: 'pdf',
    size: '2.5 MB',
    uploadedAt: '۱۴۰۲/۱۰/۱۴',
  },
  {
    id: '3',
    name: 'product-2.jpg',
    url: '/images/products/product-2.jpg',
    type: 'image',
    size: '312 KB',
    uploadedAt: '۱۴۰۲/۱۰/۱۳',
    dimensions: '1200×800',
  },
]

export default function MediaLibrary({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
}: MediaLibraryProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'documents'>('all')
  const [isDragging, setIsDragging] = useState(false)

  const filteredFiles = mockFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'images' && file.type === 'image') ||
      (activeTab === 'documents' && file.type !== 'image')
    return matchesSearch && matchesTab
  })

  const toggleSelect = (id: string) => {
    if (multiple) {
      setSelectedFiles((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      )
    } else {
      setSelectedFiles([id])
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file upload
    const files = Array.from(e.dataTransfer.files)
    console.log('Files dropped:', files)
  }, [])

  const handleInsert = () => {
    const selected = mockFiles.filter((f) => selectedFiles.includes(f.id))
    if (selected.length > 0 && onSelect) {
      onSelect(selected[0])
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">کتابخانه رسانه</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === 'all' ? 'bg-primary text-white' : 'hover:bg-gray-200'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === 'images' ? 'bg-primary text-white' : 'hover:bg-gray-200'
              }`}
            >
              تصاویر
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                activeTab === 'documents' ? 'bg-primary text-white' : 'hover:bg-gray-200'
              }`}
            >
              اسناد
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو..."
                className="pr-9 pl-4 py-1.5 border rounded-lg text-sm w-48"
              />
            </div>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${view === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">فایل‌ها را اینجا بکشید یا</p>
            <label className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors">
              <Upload className="w-4 h-4" />
              انتخاب فایل
              <input type="file" multiple className="hidden" accept="image/*,.pdf" />
            </label>
            <p className="text-xs text-gray-400 mt-2">
              حداکثر حجم: ۱۰ مگابایت | فرمت‌های مجاز: JPG, PNG, WebP, PDF
            </p>
          </div>

          {/* Files Grid/List */}
          {view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => toggleSelect(file.id)}
                  className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                    selectedFiles.includes(file.id)
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {file.type === 'image' ? (
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <File className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Selected Check */}
                  {selectedFiles.includes(file.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{file.size}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => toggleSelect(file.id)}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedFiles.includes(file.id)
                      ? 'border-primary bg-orange-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {file.type === 'image' ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <File className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {file.size} • {file.dimensions || file.type} • {file.uploadedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-200 rounded-lg">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} فایل انتخاب شده`
              : 'فایلی انتخاب نشده'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              انصراف
            </button>
            <button
              onClick={handleInsert}
              disabled={selectedFiles.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              درج
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
