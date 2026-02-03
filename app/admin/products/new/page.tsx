'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../components/ImageUpload'
import FileUpload from '../../components/FileUpload'
import SeoAnalyzer from '@/components/admin/SeoAnalyzer'

interface Category {
  id: string
  nameFa: string
}

interface Brand {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  const [form, setForm] = useState({
    titleFa: '',
    titleEn: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    image: '',
    gallery: [] as string[],
    catalogFile: '',
    status: 'DRAFT',
    featured: false,
    categoryId: '',
    brandId: '',
    metaTitle: '',
    metaDesc: '',
    focusKeyword: '',
  })

  const [attributes, setAttributes] = useState([{ key: '', value: '' }])

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories').then((res) => res.json()),
      fetch('/api/admin/brands').then((res) => res.json()),
    ])
      .then(([catData, brandData]) => {
        if (catData.success) setCategories(catData.data.categories || [])
        if (brandData.success) setBrands(brandData.data.brands || [])
      })
      .catch(console.error)
  }, [])

  const addAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  }

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const handleAddGalleryImage = (url: string | null) => {
    if (url) {
      setForm({ ...form, gallery: [...form.gallery, url] })
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setForm({ ...form, gallery: form.gallery.filter((_, i) => i !== index) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image: form.image || null,
          catalogFile: form.catalogFile || null,
          categoryId: form.categoryId || null,
          brandId: form.brandId || null,
          attributes: attributes.filter((a) => a.key && a.value),
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/products')
      } else {
        alert(data.message || 'Error saving')
      }
    } catch {
      alert('Error saving')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title (Persian) *
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title (English)
                    </label>
                    <input
                      type="text"
                      value={form.titleEn}
                      onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    dir="ltr"
                    placeholder="Leave empty to generate automatically"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.shortDesc}
                    onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={6}
                    value={form.fullDesc}
                    onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Main Image</h2>
              <ImageUpload
                value={form.image || null}
                onChange={(url) => setForm({ ...form, image: url || '' })}
                folder="products"
                label="Main Product Image"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Image Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {form.gallery.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <ImageUpload
                value={null}
                onChange={handleAddGalleryImage}
                folder="products"
                label="Add Image to Gallery"
              />
            </div>

            {/* Attributes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-dark">Technical Specifications</h2>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Attribute
                </button>
              </div>

              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Attribute Name"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={attr.key}
                      onChange={(e) => {
                        const newAttrs = [...attributes]
                        newAttrs[index].key = e.target.value
                        setAttributes(newAttrs)
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={attr.value}
                      onChange={(e) => {
                        const newAttrs = [...attributes]
                        newAttrs[index].value = e.target.value
                        setAttributes(newAttrs)
                      }}
                    />
                    {attributes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                    <span className={`ml-2 text-xs ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                      ({form.metaTitle.length}/60)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                    <span className={`ml-2 text-xs ${form.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      ({form.metaDesc.length}/160)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.metaDesc}
                    onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* SEO Analyzer */}
            <SeoAnalyzer
              title={form.titleFa}
              metaTitle={form.metaTitle}
              metaDesc={form.metaDesc}
              content={form.fullDesc}
              slug={form.slug}
              focusKeyword={form.focusKeyword}
              onFocusKeywordChange={(keyword) => setForm({ ...form, focusKeyword: keyword })}
              baseUrl="https://hatefertebat.ir/products"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Publish</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Featured Product</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Category</h2>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameFa}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Brand</h2>
              <select
                value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Catalog */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">Catalog</h2>
              <FileUpload
                value={form.catalogFile || null}
                onChange={(url) => setForm({ ...form, catalogFile: url || '' })}
                folder="products/catalogs"
                label="Catalog File"
                accept=".pdf"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
