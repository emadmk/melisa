'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../../components/ImageUpload'
import FileUpload from '../../../components/FileUpload'

interface CatalogCategory {
  id: string
  nameFa: string
}

export default function EditCatalogPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [categories, setCategories] = useState<CatalogCategory[]>([])

  const [form, setForm] = useState({
    titleFa: '',
    titleEn: '',
    slug: '',
    description: '',
    file: '',
    thumbnail: '',
    categoryId: '',
    status: 'DRAFT',
    order: 0,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/catalogs/${id}`).then((res) => res.json()),
      fetch('/api/admin/catalog-categories').then((res) => res.json()),
    ])
      .then(([catalogData, catData]) => {
        if (catalogData.success) {
          const catalog = catalogData.data
          setForm({
            titleFa: catalog.titleFa || '',
            titleEn: catalog.titleEn || '',
            slug: catalog.slug || '',
            description: catalog.description || '',
            file: catalog.file || '',
            thumbnail: catalog.thumbnail || '',
            categoryId: catalog.categoryId || '',
            status: catalog.status || 'DRAFT',
            order: catalog.order || 0,
          })
        }
        if (catData.success) {
          setCategories(catData.data.categories || [])
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.file) {
      alert('Catalog file is required')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/admin/catalogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          thumbnail: form.thumbnail || null,
          categoryId: form.categoryId || null,
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/catalogs')
      } else {
        alert(data.message || 'Error saving')
      }
    } catch {
      alert('Error saving')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/catalogs"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">Edit Catalog</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persian Title *
            </label>
            <input
              type="text"
              value={form.titleFa}
              onChange={(e) => setForm({ ...form, titleFa: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Title
            </label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameFa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <FileUpload
              value={form.file || null}
              onChange={(url) => setForm({ ...form, file: url || '' })}
              folder="catalogs"
              label="Catalog File *"
              accept=".pdf,.doc,.docx"
            />
          </div>

          <div>
            <ImageUpload
              value={form.thumbnail || null}
              onChange={(url) => setForm({ ...form, thumbnail: url || '' })}
              folder="catalogs"
              label="Thumbnail"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Link
            href="/admin/catalogs"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
