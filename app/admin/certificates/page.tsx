'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'

interface Certificate {
  id: string
  title: string
  issuer: string | null
  image: string | null
  year: string | null
}

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const fetchCertificates = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/certificates')
      const data = await res.json()
      if (data.success) {
        setCertificates(data.data.certificates || [])
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این گواهینامه مطمئن هستید؟')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchCertificates()
      } else {
        alert('خطا در حذف')
      }
    } catch (error) {
      console.error('Error deleting certificate:', error)
      alert('خطا در حذف')
    } finally {
      setDeleting(null)
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
        <h1 className="text-2xl font-bold text-dark">گواهینامه‌ها</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          افزودن گواهینامه
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          گواهینامه‌ای یافت نشد
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-50">
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    بدون تصویر
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary font-medium">{cert.issuer || '-'}</span>
                  <span className="text-xs text-gray-400">{cert.year || '-'}</span>
                </div>
                <h3 className="font-medium text-dark mb-3">{cert.title}</h3>
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4" />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    disabled={deleting === cert.id}
                    className="p-2 border rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting === cert.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - TODO: implement form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-dark">افزودن گواهینامه</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6 text-center text-gray-500">
              فرم افزودن گواهینامه در حال توسعه است
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
