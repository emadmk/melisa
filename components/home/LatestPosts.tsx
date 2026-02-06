'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, FileText, Calendar, Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n/LocaleContext'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  publishedAt: string
  postCategory: { name: string; slug: string } | null
}

const translations = {
  en: {
    badge: 'Latest News',
    title: 'From Our Blog',
    subtitle: 'Stay updated with the latest insights, news and trends in telecommunications and security',
    readMore: 'Read Article',
    viewAll: 'View All Articles',
  },
  ar: {
    badge: 'آخر الأخبار',
    title: 'من مدونتنا',
    subtitle: 'ابق على اطلاع بأحدث الأفكار والأخبار والاتجاهات في مجال الاتصالات والأمن',
    readMore: 'قراءة المقال',
    viewAll: 'عرض جميع المقالات',
  },
}

export default function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const localeContext = useLocale()
  const isArabic = localeContext?.locale === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']
  const basePath = isArabic ? '/ar' : ''

  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.posts) {
          setPosts(data.data.posts)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(isArabic ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <section className="py-20 lg:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-16 ${isArabic ? 'text-right' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            <Newspaper className="w-4 h-4" />
            {t.badge}
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`${basePath}/blog/${post.slug}`}>
                <div className="relative h-full rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {post.image ? (
                      <>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-slate-700" />
                      </div>
                    )}

                    {/* Category Badge */}
                    {post.postCategory && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-medium">
                          {post.postCategory.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${isArabic ? 'text-right' : ''}`}>
                    {/* Date */}
                    <div className={`flex items-center gap-2 text-slate-500 text-sm mb-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read More */}
                    <div className={`inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all ${isArabic ? 'flex-row-reverse' : ''}`}>
                      {t.readMore}
                      {isArabic ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href={`${basePath}/blog`}
            className={`inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-primary hover:text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25 ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {t.viewAll}
            {isArabic ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
