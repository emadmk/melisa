'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, GripVertical, Loader2 } from 'lucide-react'

interface Service {
  id: string
  titleFa: string
  slug: string
  icon: string | null
  status: string
  order: number
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      if (data.success) {
        setServices(data.data.services || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchServices()
      } else {
        alert('Error deleting')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting')
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
        <h1 className="text-2xl font-bold text-dark">Services</h1>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {services.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No services found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-12">
                  Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Icon
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button className="cursor-grab text-gray-400 hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-dark">
                    {service.titleFa}
                  </td>
                  <td className="px-6 py-4 text-gray-500" dir="ltr">
                    {service.slug}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {service.icon || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        service.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {service.status === 'PUBLISHED' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/services/${service.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deleting === service.id}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === service.id ? (
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
    </div>
  )
}
