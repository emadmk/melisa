'use client'

import { useState, useEffect, useCallback, FormEvent } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  _count?: { products: number }
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [logo, setLogo] = useState<string | null>(null)

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/brands')
      const data = await res.json()
      if (data.success) {
        setBrands(data.data.brands || [])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  const openAddModal = () => {
    setEditingBrand(null)
    setName('')
    setSlug('')
    setLogo(null)
    setShowModal(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setName(brand.name)
    setSlug(brand.slug)
    setLogo(brand.logo)
    setShowModal(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    try {
      const body = { name, slug: slug || undefined, logo: logo || null }
      const url = editingBrand
        ? `/api/admin/brands/${editingBrand.id}`
        : '/api/admin/brands'
      const method = editingBrand ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (data.success) {
        setShowModal(false)
        fetchBrands()
      } else {
        alert(data.error || 'Error saving')
      }
    } catch (error) {
      console.error('Error saving brand:', error)
      alert('Error saving')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        fetchBrands()
      } else {
        alert(data.error || 'Error deleting')
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
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
        <h1 className="text-2xl font-bold text-dark">Brands</h1>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      {brands.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          No brands found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-[3/2] bg-gray-50 p-6">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-dark">{brand.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {brand._count?.products || 0} product(s)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    disabled={deleting === brand.id}
                    className="p-2 border rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deleting === brand.id ? (
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-dark">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                x
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Motorola"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="motorola"
                  dir="ltr"
                />
              </div>

              <div>
                <ImageUpload
                  value={logo}
                  onChange={(url) => setLogo(url)}
                  folder="brands"
                  label="Brand Logo"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
