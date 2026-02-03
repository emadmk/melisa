'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, X, Plus, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../../components/ImageUpload'
import FileUpload from '../../../components/FileUpload'
import SeoAnalyzer from '@/components/admin/SeoAnalyzer'

interface Category {
  id: string
  nameFa: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface ProductData {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  shortDesc: string | null
  fullDesc: string | null
  image: string | null
  gallery: string[]
  catalogFile: string | null
  status: string
  featured: boolean
  categoryId: string | null
  brandId: string | null
  attributes: { key: string; value: string }[]
  metaTitle: string | null
  metaDesc: string | null
  focusKeyword: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  const [formData, setFormData] = useState<ProductData>({
    id: '',
    titleFa: '',
    titleEn: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    image: '',
    gallery: [],
    catalogFile: '',
    status: 'DRAFT',
    featured: false,
    categoryId: '',
    brandId: '',
    attributes: [{ key: '', value: '' }],
    metaTitle: '',
    metaDesc: '',
    focusKeyword: '',
  })

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`)
      const data = await res.json()

      if (data.success && data.data) {
        const product = data.data
        setFormData({
          id: product.id,
          titleFa: product.titleFa || '',
          titleEn: product.titleEn || '',
          slug: product.slug || '',
          shortDesc: product.shortDesc || '',
          fullDesc: product.fullDesc || '',
          image: product.image || '',
          gallery: product.gallery || [],
          catalogFile: product.catalogFile || '',
          status: product.status || 'DRAFT',
          featured: product.featured || false,
          categoryId: product.categoryId || '',
          brandId: product.brandId || '',
          attributes: product.attributes?.length > 0
            ? product.attributes.map((a: { key: string; value: string }) => ({ key: a.key, value: a.value }))
            : [{ key: '', value: '' }],
          metaTitle: product.metaTitle || '',
          metaDesc: product.metaDesc || '',
          focusKeyword: product.focusKeyword || '',
        })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }, [productId])

  const fetchFilters = useCallback(async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/brands'),
      ])
      const [catData, brandData] = await Promise.all([catRes.json(), brandRes.json()])

      if (catData.success) setCategories(catData.data?.categories || [])
      if (brandData.success) setBrands(brandData.data?.brands || [])
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }, [])

  useEffect(() => {
    fetchProduct()
    fetchFilters()
  }, [fetchProduct, fetchFilters])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          titleFa: formData.titleFa,
          titleEn: formData.titleEn || null,
          slug: formData.slug,
          shortDesc: formData.shortDesc || null,
          fullDesc: formData.fullDesc || null,
          image: formData.image || null,
          gallery: formData.gallery,
          catalogFile: formData.catalogFile || null,
          status: formData.status,
          featured: formData.featured,
          categoryId: formData.categoryId || null,
          brandId: formData.brandId || null,
          attributes: formData.attributes.filter(a => a.key && a.value),
          metaTitle: formData.metaTitle || null,
          metaDesc: formData.metaDesc || null,
          focusKeyword: formData.focusKeyword || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        alert('محصول با موفقیت ذخیره شد')
        router.push('/admin/products')
      } else {
        alert(data.message || 'خطا در ذخیره محصول')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('خطا در ذخیره محصول')
    } finally {
      setSaving(false)
    }
  }

  const addAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { key: '', value: '' }],
    })
  }

  const removeAttribute = (index: number) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((_, i) => i !== index),
    })
  }

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const newAttrs = [...formData.attributes]
    newAttrs[index][field] = value
    setFormData({ ...formData, attributes: newAttrs })
  }

  const handleAddGalleryImage = (url: string | null) => {
    if (url) {
      setFormData({ ...formData, gallery: [...formData.gallery, url] })
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) })
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
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">ویرایش محصول</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">اطلاعات اصلی</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان محصول (فارسی) *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.titleFa}
                      onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان محصول (انگلیسی)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.titleEn || ''}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسلاگ (URL)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات کوتاه
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.shortDesc || ''}
                    onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات کامل
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.fullDesc || ''}
                    onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">تصویر اصلی</h2>
              <ImageUpload
                value={formData.image || null}
                onChange={(url) => setFormData({ ...formData, image: url || '' })}
                folder="products"
                label="تصویر اصلی محصول"
              />
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">گالری تصاویر</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.gallery.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`تصویر ${index + 1}`}
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
                label="افزودن تصویر به گالری"
              />
            </div>

            {/* Attributes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-dark">مشخصات فنی</h2>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  افزودن مشخصه
                </button>
              </div>

              <div className="space-y-3">
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="نام مشخصه"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={attr.key}
                      onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="مقدار"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    />
                    {formData.attributes.length > 1 && (
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
              <h2 className="font-bold text-dark mb-4">سئو</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان متا
                    <span className={`mr-2 text-xs ${(formData.metaTitle?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                      ({formData.metaTitle?.length || 0}/60)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.metaTitle || ''}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات متا
                    <span className={`mr-2 text-xs ${(formData.metaDesc?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      ({formData.metaDesc?.length || 0}/160)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.metaDesc || ''}
                    onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* SEO Analyzer */}
            <SeoAnalyzer
              title={formData.titleFa}
              metaTitle={formData.metaTitle || ''}
              metaDesc={formData.metaDesc || ''}
              content={formData.fullDesc || ''}
              slug={formData.slug}
              focusKeyword={formData.focusKeyword}
              onFocusKeywordChange={(keyword) => setFormData({ ...formData, focusKeyword: keyword })}
              baseUrl="https://hatefertebat.ir/products"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">انتشار</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وضعیت
                  </label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="DRAFT">پیش‌نویس</option>
                    <option value="PUBLISHED">منتشر شده</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    محصول ویژه
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  ذخیره تغییرات
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">دسته‌بندی</h2>

              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameFa}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">برند</h2>

              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.brandId || ''}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              >
                <option value="">انتخاب برند</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Catalog */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-dark mb-4">کاتالوگ</h2>
              <FileUpload
                value={formData.catalogFile || null}
                onChange={(url) => setFormData({ ...formData, catalogFile: url || '' })}
                folder="products/catalogs"
                label="فایل کاتالوگ"
                accept=".pdf"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
