'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Loader2, Save } from 'lucide-react'
import ImageUpload from '../../../components/ImageUpload'
import SeoAnalyzer from '@/components/admin/SeoAnalyzer'

interface PostCategory {
  id: string
  nameFa: string
}

export default function EditPostPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [categories, setCategories] = useState<PostCategory[]>([])

  const [form, setForm] = useState({
    titleFa: '',
    titleEn: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    status: 'DRAFT',
    author: '',
    postCategoryId: '',
    tags: '',
    metaTitle: '',
    metaDesc: '',
    focusKeyword: '',
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/posts/${id}`).then((res) => res.json()),
      fetch('/api/admin/post-categories').then((res) => res.json()),
    ])
      .then(([postData, catData]) => {
        if (postData.success) {
          const post = postData.data
          setForm({
            titleFa: post.titleFa || '',
            titleEn: post.titleEn || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            image: post.image || '',
            status: post.status || 'DRAFT',
            author: post.author || '',
            postCategoryId: post.postCategoryId || '',
            tags: post.tags?.join(', ') || '',
            metaTitle: post.metaTitle || '',
            metaDesc: post.metaDesc || '',
            focusKeyword: post.focusKeyword || '',
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
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image: form.image || null,
          postCategoryId: form.postCategoryId || null,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/admin/posts')
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
          href="/admin/posts"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">Edit Post</h1>
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
              Author
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={form.postCategoryId}
              onChange={(e) => setForm({ ...form, postCategoryId: e.target.value })}
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Separate with commas"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              value={form.image || null}
              onChange={(url) => setForm({ ...form, image: url || '' })}
              folder="posts"
              label="Featured Image"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
              <span className={`mr-2 text-xs ${form.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
              <span className={`mr-2 text-xs ${form.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                ({form.metaDesc.length}/160)
              </span>
            </label>
            <textarea
              rows={2}
              value={form.metaDesc}
              onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* SEO Analyzer */}
          <div className="md:col-span-2">
            <SeoAnalyzer
              title={form.titleFa}
              metaTitle={form.metaTitle}
              metaDesc={form.metaDesc}
              content={form.content}
              slug={form.slug}
              focusKeyword={form.focusKeyword}
              onFocusKeywordChange={(keyword) => setForm({ ...form, focusKeyword: keyword })}
              baseUrl="https://hatefertebat.ir/blog"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
          <Link
            href="/admin/posts"
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
