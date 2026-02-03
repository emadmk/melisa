'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, Download, FileText, Loader2 } from 'lucide-react'

interface Catalog {
  id: string
  title: string
  file: string
  category: string | null
  downloads: number
  createdAt: string
}

export default function CatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const fetchCatalogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/catalogs')
      const data = await res.json()
      if (data.success) {
        setCatalogs(data.data.catalogs || [])
      }
    } catch (error) {
      console.error('Error fetching catalogs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCatalogs()
  }, [fetchCatalogs])

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این کاتالوگ مطمئن هستید؟')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/catalogs/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchCatalogs()
      } else {
        alert('خطا در حذف')
      }
    } catch (error) {
      console.error('Error deleting catalog:', error)
      alert('خطا در حذف')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('fa-IR').format(date)
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">کاتالوگ‌ها</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          افزودن کاتالوگ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {catalogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            کاتالوگی یافت نشد
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  کاتالوگ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  دسته‌بندی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  دانلود
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  تاریخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {catalogs.map((catalog) => (
                <tr key={catalog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-dark">{catalog.title}</h3>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {catalog.category || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {catalog.downloads} بار
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(catalog.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {catalog.file && (
                        <a
                          href={catalog.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="دانلود"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(catalog.id)}
                        disabled={deleting === catalog.id}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="حذف"
                      >
                        {deleting === catalog.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal - TODO: implement form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-dark">افزودن کاتالوگ</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6 text-center text-gray-500">
              فرم افزودن کاتالوگ در حال توسعه است
            </div>
            <div className="p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 border rounded-lg hover:bg-gray-50"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
