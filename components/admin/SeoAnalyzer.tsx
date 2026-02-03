'use client'

import { useState, useMemo } from 'react'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  FileText,
  Link as LinkIcon,
  Type,
  AlignLeft,
  Target,
  TrendingUp,
  Globe,
} from 'lucide-react'

interface SeoCheck {
  id: string
  category: 'basic' | 'keyword' | 'readability' | 'links'
  title: string
  status: 'good' | 'warning' | 'error' | 'info'
  message: string
  suggestion?: string
  weight: number
}

interface SeoAnalyzerProps {
  title: string
  metaTitle: string
  metaDesc: string
  content: string
  slug: string
  focusKeyword: string
  onFocusKeywordChange: (keyword: string) => void
  baseUrl?: string
}

export default function SeoAnalyzer({
  title,
  metaTitle,
  metaDesc,
  content,
  slug,
  focusKeyword,
  onFocusKeywordChange,
  baseUrl = 'https://hatefertebat.ir',
}: SeoAnalyzerProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<'seo' | 'readability' | 'preview'>('seo')

  // Strip HTML tags for text analysis
  const plainContent = useMemo(() => {
    return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }, [content])

  // Word count
  const wordCount = useMemo(() => {
    return plainContent.split(/\s+/).filter(Boolean).length
  }, [plainContent])

  // Sentence count
  const sentenceCount = useMemo(() => {
    return plainContent.split(/[.!?؟۔]+/).filter(Boolean).length
  }, [plainContent])

  // Check for internal links
  const internalLinks = useMemo(() => {
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi
    const matches = Array.from(content.matchAll(linkRegex))
    let internal = 0
    let external = 0
    for (const match of matches) {
      const href = match[1]
      if (href.startsWith('/') || href.includes('hatefertebat.ir')) {
        internal++
      } else if (href.startsWith('http')) {
        external++
      }
    }
    return { internal, external }
  }, [content])

  // Check for images
  const images = useMemo(() => {
    const imgRegex = /<img[^>]*>/gi
    const altRegex = /alt=["']([^"']*)["']/i
    const matches = content.match(imgRegex) || []
    let withAlt = 0
    let withoutAlt = 0
    matches.forEach(img => {
      const altMatch = img.match(altRegex)
      if (altMatch && altMatch[1].trim()) {
        withAlt++
      } else {
        withoutAlt++
      }
    })
    return { total: matches.length, withAlt, withoutAlt }
  }, [content])

  // Check for headings
  const headings = useMemo(() => {
    const h1 = (content.match(/<h1[^>]*>/gi) || []).length
    const h2 = (content.match(/<h2[^>]*>/gi) || []).length
    const h3 = (content.match(/<h3[^>]*>/gi) || []).length
    return { h1, h2, h3 }
  }, [content])

  // Keyword density
  const keywordDensity = useMemo(() => {
    if (!focusKeyword || !plainContent) return 0
    const keyword = focusKeyword.toLowerCase()
    const text = plainContent.toLowerCase()
    const count = (text.match(new RegExp(keyword, 'gi')) || []).length
    return wordCount > 0 ? (count / wordCount) * 100 : 0
  }, [focusKeyword, plainContent, wordCount])

  // Keyword in title
  const keywordInTitle = useMemo(() => {
    if (!focusKeyword) return false
    return (metaTitle || title).toLowerCase().includes(focusKeyword.toLowerCase())
  }, [focusKeyword, metaTitle, title])

  // Keyword in description
  const keywordInDesc = useMemo(() => {
    if (!focusKeyword) return false
    return metaDesc.toLowerCase().includes(focusKeyword.toLowerCase())
  }, [focusKeyword, metaDesc])

  // Keyword in slug
  const keywordInSlug = useMemo(() => {
    if (!focusKeyword || !slug) return false
    const normalizedKeyword = focusKeyword.toLowerCase().replace(/\s+/g, '-')
    const decodedSlug = decodeURIComponent(slug).toLowerCase()
    return decodedSlug.includes(normalizedKeyword) || decodedSlug.includes(focusKeyword.toLowerCase())
  }, [focusKeyword, slug])

  // Keyword in first paragraph
  const keywordInFirstPara = useMemo(() => {
    if (!focusKeyword || !plainContent) return false
    const firstPara = plainContent.slice(0, 200).toLowerCase()
    return firstPara.includes(focusKeyword.toLowerCase())
  }, [focusKeyword, plainContent])

  // SEO Checks
  const checks = useMemo<SeoCheck[]>(() => {
    const items: SeoCheck[] = []

    // === BASIC SEO ===

    // Meta Title
    if (!metaTitle) {
      items.push({
        id: 'meta-title-empty',
        category: 'basic',
        title: 'عنوان متا',
        status: 'error',
        message: 'عنوان متا وارد نشده است',
        suggestion: 'عنوان متا یکی از مهم‌ترین فاکتورهای سئو است. آن را وارد کنید.',
        weight: 15,
      })
    } else if (metaTitle.length < 30) {
      items.push({
        id: 'meta-title-short',
        category: 'basic',
        title: 'عنوان متا',
        status: 'warning',
        message: `عنوان متا کوتاه است (${metaTitle.length}/60 کاراکتر)`,
        suggestion: 'عنوان متا حداقل ۳۰ کاراکتر باشد',
        weight: 10,
      })
    } else if (metaTitle.length > 60) {
      items.push({
        id: 'meta-title-long',
        category: 'basic',
        title: 'عنوان متا',
        status: 'warning',
        message: `عنوان متا طولانی است (${metaTitle.length}/60 کاراکتر)`,
        suggestion: 'عنوان متا حداکثر ۶۰ کاراکتر باشد تا در گوگل کامل نمایش داده شود',
        weight: 10,
      })
    } else {
      items.push({
        id: 'meta-title-ok',
        category: 'basic',
        title: 'عنوان متا',
        status: 'good',
        message: `طول عنوان متا مناسب است (${metaTitle.length}/60 کاراکتر)`,
        weight: 15,
      })
    }

    // Meta Description
    if (!metaDesc) {
      items.push({
        id: 'meta-desc-empty',
        category: 'basic',
        title: 'توضیحات متا',
        status: 'error',
        message: 'توضیحات متا وارد نشده است',
        suggestion: 'توضیحات متا در نتایج گوگل نمایش داده می‌شود. آن را وارد کنید.',
        weight: 12,
      })
    } else if (metaDesc.length < 120) {
      items.push({
        id: 'meta-desc-short',
        category: 'basic',
        title: 'توضیحات متا',
        status: 'warning',
        message: `توضیحات متا کوتاه است (${metaDesc.length}/160 کاراکتر)`,
        suggestion: 'توضیحات متا حداقل ۱۲۰ کاراکتر باشد',
        weight: 8,
      })
    } else if (metaDesc.length > 160) {
      items.push({
        id: 'meta-desc-long',
        category: 'basic',
        title: 'توضیحات متا',
        status: 'warning',
        message: `توضیحات متا طولانی است (${metaDesc.length}/160 کاراکتر)`,
        suggestion: 'توضیحات متا حداکثر ۱۶۰ کاراکتر باشد',
        weight: 8,
      })
    } else {
      items.push({
        id: 'meta-desc-ok',
        category: 'basic',
        title: 'توضیحات متا',
        status: 'good',
        message: `طول توضیحات متا مناسب است (${metaDesc.length}/160 کاراکتر)`,
        weight: 12,
      })
    }

    // Slug
    if (!slug) {
      items.push({
        id: 'slug-empty',
        category: 'basic',
        title: 'آدرس صفحه (Slug)',
        status: 'error',
        message: 'آدرس صفحه وارد نشده است',
        weight: 8,
      })
    } else {
      items.push({
        id: 'slug-ok',
        category: 'basic',
        title: 'آدرس صفحه (Slug)',
        status: 'good',
        message: 'آدرس صفحه تنظیم شده است',
        weight: 8,
      })
    }

    // === KEYWORD ANALYSIS ===

    if (!focusKeyword) {
      items.push({
        id: 'keyword-empty',
        category: 'keyword',
        title: 'کلمه کلیدی اصلی',
        status: 'info',
        message: 'کلمه کلیدی اصلی تعیین نشده است',
        suggestion: 'یک کلمه کلیدی اصلی برای بهینه‌سازی محتوا انتخاب کنید',
        weight: 0,
      })
    } else {
      // Keyword in title
      if (keywordInTitle) {
        items.push({
          id: 'keyword-in-title',
          category: 'keyword',
          title: 'کلمه کلیدی در عنوان',
          status: 'good',
          message: 'کلمه کلیدی در عنوان متا موجود است',
          weight: 10,
        })
      } else {
        items.push({
          id: 'keyword-not-in-title',
          category: 'keyword',
          title: 'کلمه کلیدی در عنوان',
          status: 'error',
          message: 'کلمه کلیدی در عنوان متا موجود نیست',
          suggestion: 'کلمه کلیدی را ترجیحاً در ابتدای عنوان قرار دهید',
          weight: 10,
        })
      }

      // Keyword in description
      if (keywordInDesc) {
        items.push({
          id: 'keyword-in-desc',
          category: 'keyword',
          title: 'کلمه کلیدی در توضیحات',
          status: 'good',
          message: 'کلمه کلیدی در توضیحات متا موجود است',
          weight: 8,
        })
      } else {
        items.push({
          id: 'keyword-not-in-desc',
          category: 'keyword',
          title: 'کلمه کلیدی در توضیحات',
          status: 'warning',
          message: 'کلمه کلیدی در توضیحات متا موجود نیست',
          weight: 8,
        })
      }

      // Keyword in slug
      if (keywordInSlug) {
        items.push({
          id: 'keyword-in-slug',
          category: 'keyword',
          title: 'کلمه کلیدی در URL',
          status: 'good',
          message: 'کلمه کلیدی در آدرس صفحه موجود است',
          weight: 6,
        })
      } else {
        items.push({
          id: 'keyword-not-in-slug',
          category: 'keyword',
          title: 'کلمه کلیدی در URL',
          status: 'warning',
          message: 'کلمه کلیدی در آدرس صفحه موجود نیست',
          suggestion: 'سعی کنید کلمه کلیدی در URL باشد',
          weight: 6,
        })
      }

      // Keyword in first paragraph
      if (keywordInFirstPara) {
        items.push({
          id: 'keyword-in-first-para',
          category: 'keyword',
          title: 'کلمه کلیدی در پاراگراف اول',
          status: 'good',
          message: 'کلمه کلیدی در ابتدای محتوا آمده است',
          weight: 6,
        })
      } else if (plainContent.length > 0) {
        items.push({
          id: 'keyword-not-in-first-para',
          category: 'keyword',
          title: 'کلمه کلیدی در پاراگراف اول',
          status: 'warning',
          message: 'کلمه کلیدی در ۲۰۰ کاراکتر اول محتوا نیست',
          suggestion: 'کلمه کلیدی را در پاراگراف اول استفاده کنید',
          weight: 6,
        })
      }

      // Keyword density
      if (wordCount > 0) {
        if (keywordDensity < 0.5) {
          items.push({
            id: 'keyword-density-low',
            category: 'keyword',
            title: 'تراکم کلمه کلیدی',
            status: 'warning',
            message: `تراکم کلمه کلیدی کم است (${keywordDensity.toFixed(1)}%)`,
            suggestion: 'کلمه کلیدی را بیشتر در متن استفاده کنید (ایده‌آل: ۱-۲.۵٪)',
            weight: 5,
          })
        } else if (keywordDensity > 2.5) {
          items.push({
            id: 'keyword-density-high',
            category: 'keyword',
            title: 'تراکم کلمه کلیدی',
            status: 'warning',
            message: `تراکم کلمه کلیدی زیاد است (${keywordDensity.toFixed(1)}%)`,
            suggestion: 'از تکرار بیش از حد کلمه کلیدی خودداری کنید (خطر keyword stuffing)',
            weight: 5,
          })
        } else {
          items.push({
            id: 'keyword-density-ok',
            category: 'keyword',
            title: 'تراکم کلمه کلیدی',
            status: 'good',
            message: `تراکم کلمه کلیدی مناسب است (${keywordDensity.toFixed(1)}%)`,
            weight: 5,
          })
        }
      }
    }

    // === READABILITY ===

    // Content length
    if (wordCount < 100) {
      items.push({
        id: 'content-too-short',
        category: 'readability',
        title: 'طول محتوا',
        status: 'error',
        message: `محتوا بسیار کوتاه است (${wordCount} کلمه)`,
        suggestion: 'حداقل ۳۰۰ کلمه محتوا بنویسید',
        weight: 10,
      })
    } else if (wordCount < 300) {
      items.push({
        id: 'content-short',
        category: 'readability',
        title: 'طول محتوا',
        status: 'warning',
        message: `محتوا کوتاه است (${wordCount} کلمه)`,
        suggestion: 'برای رتبه‌بندی بهتر، حداقل ۳۰۰ کلمه توصیه می‌شود',
        weight: 10,
      })
    } else {
      items.push({
        id: 'content-ok',
        category: 'readability',
        title: 'طول محتوا',
        status: 'good',
        message: `طول محتوا مناسب است (${wordCount} کلمه)`,
        weight: 10,
      })
    }

    // Headings
    if (headings.h2 === 0 && wordCount > 150) {
      items.push({
        id: 'no-h2',
        category: 'readability',
        title: 'عناوین فرعی',
        status: 'warning',
        message: 'محتوا فاقد عنوان فرعی (H2) است',
        suggestion: 'از عناوین فرعی برای ساختاردهی بهتر استفاده کنید',
        weight: 5,
      })
    } else if (headings.h2 > 0) {
      items.push({
        id: 'has-h2',
        category: 'readability',
        title: 'عناوین فرعی',
        status: 'good',
        message: `${headings.h2} عنوان فرعی در محتوا موجود است`,
        weight: 5,
      })
    }

    // === LINKS ===

    // Internal links
    if (internalLinks.internal === 0 && wordCount > 150) {
      items.push({
        id: 'no-internal-links',
        category: 'links',
        title: 'لینک‌های داخلی',
        status: 'warning',
        message: 'محتوا فاقد لینک داخلی است',
        suggestion: 'به صفحات مرتبط سایت لینک بدهید',
        weight: 5,
      })
    } else if (internalLinks.internal > 0) {
      items.push({
        id: 'has-internal-links',
        category: 'links',
        title: 'لینک‌های داخلی',
        status: 'good',
        message: `${internalLinks.internal} لینک داخلی در محتوا موجود است`,
        weight: 5,
      })
    }

    // External links
    if (internalLinks.external > 0) {
      items.push({
        id: 'has-external-links',
        category: 'links',
        title: 'لینک‌های خارجی',
        status: 'good',
        message: `${internalLinks.external} لینک خارجی در محتوا موجود است`,
        weight: 3,
      })
    }

    // Images
    if (images.total > 0) {
      if (images.withoutAlt > 0) {
        items.push({
          id: 'images-no-alt',
          category: 'basic',
          title: 'متن جایگزین تصاویر',
          status: 'warning',
          message: `${images.withoutAlt} تصویر بدون alt`,
          suggestion: 'برای همه تصاویر متن جایگزین (alt) تعریف کنید',
          weight: 4,
        })
      } else {
        items.push({
          id: 'images-alt-ok',
          category: 'basic',
          title: 'متن جایگزین تصاویر',
          status: 'good',
          message: 'همه تصاویر دارای alt هستند',
          weight: 4,
        })
      }
    }

    return items
  }, [
    metaTitle, metaDesc, slug, focusKeyword, plainContent, wordCount,
    keywordInTitle, keywordInDesc, keywordInSlug, keywordInFirstPara,
    keywordDensity, headings, internalLinks, images
  ])

  // Calculate score
  const score = useMemo(() => {
    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0)
    const earnedWeight = checks.reduce((sum, c) => {
      if (c.status === 'good') return sum + c.weight
      if (c.status === 'warning') return sum + c.weight * 0.5
      return sum
    }, 0)
    return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0
  }, [checks])

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500'
    if (s >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (s: number) => {
    if (s >= 80) return 'bg-green-500'
    if (s >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusIcon = (status: SeoCheck['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
    }
  }

  const seoChecks = checks.filter(c => c.category === 'basic' || c.category === 'keyword')
  const readabilityChecks = checks.filter(c => c.category === 'readability' || c.category === 'links')

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-white hover:from-orange-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${getScoreBgColor(score)} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">{score}</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-dark block">آنالیز سئو</span>
            <span className="text-sm text-gray-500">
              {score >= 80 ? 'عالی! ادامه بدهید' : score >= 50 ? 'قابل بهبود' : 'نیاز به بهینه‌سازی'}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t">
          {/* Focus Keyword Input */}
          <div className="p-4 bg-gray-50 border-b">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 text-primary" />
              کلمه کلیدی اصلی
            </label>
            <input
              type="text"
              placeholder="مثال: بیسیم موتورولا"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              value={focusKeyword}
              onChange={(e) => onFocusKeywordChange(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'seo'
                  ? 'text-primary border-b-2 border-primary bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search className="w-4 h-4" />
              سئو
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('readability')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'readability'
                  ? 'text-primary border-b-2 border-primary bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
              خوانایی
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'preview'
                  ? 'text-primary border-b-2 border-primary bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              پیش‌نمایش
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-3">
                {/* Score bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">امتیاز سئو</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getScoreBgColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                {/* Checks */}
                {seoChecks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getStatusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark text-sm">{check.title}</p>
                      <p className="text-sm text-gray-600">{check.message}</p>
                      {check.suggestion && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {check.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Readability Tab */}
            {activeTab === 'readability' && (
              <div className="space-y-3">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Type className="w-5 h-5 mx-auto text-primary mb-1" />
                    <div className="text-lg font-bold text-dark">{wordCount}</div>
                    <div className="text-xs text-gray-500">کلمه</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 mx-auto text-primary mb-1" />
                    <div className="text-lg font-bold text-dark">{sentenceCount}</div>
                    <div className="text-xs text-gray-500">جمله</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <LinkIcon className="w-5 h-5 mx-auto text-primary mb-1" />
                    <div className="text-lg font-bold text-dark">{internalLinks.internal + internalLinks.external}</div>
                    <div className="text-xs text-gray-500">لینک</div>
                  </div>
                </div>

                {/* Checks */}
                {readabilityChecks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getStatusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark text-sm">{check.title}</p>
                      <p className="text-sm text-gray-600">{check.message}</p>
                      {check.suggestion && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {check.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Preview Tab - Google SERP */}
            {activeTab === 'preview' && (
              <div>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  پیش‌نمایش در نتایج گوگل
                </p>
                <div className="border rounded-lg p-4 bg-white" dir="rtl">
                  {/* Title */}
                  <div className="text-xl text-blue-700 hover:underline cursor-pointer truncate mb-1">
                    {metaTitle || title || 'عنوان صفحه را وارد کنید'}
                  </div>
                  {/* URL */}
                  <div className="text-sm text-green-700 mb-1 truncate" dir="ltr">
                    {baseUrl}/{slug || 'page-url'}
                  </div>
                  {/* Description */}
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {metaDesc || 'توضیحات متا را وارد کنید تا در نتایج گوگل نمایش داده شود...'}
                  </div>
                </div>

                {/* Character counts */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">عنوان متا:</span>
                    <span className={metaTitle.length > 60 ? 'text-red-500' : metaTitle.length < 30 ? 'text-yellow-500' : 'text-green-500'}>
                      {metaTitle.length}/60
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">توضیحات متا:</span>
                    <span className={metaDesc.length > 160 ? 'text-red-500' : metaDesc.length < 120 ? 'text-yellow-500' : 'text-green-500'}>
                      {metaDesc.length}/160
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
