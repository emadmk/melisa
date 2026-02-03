'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Hash,
  Globe,
} from 'lucide-react'

interface SeoAnalysis {
  score: number
  items: SeoItem[]
}

interface SeoItem {
  id: string
  title: string
  status: 'good' | 'warning' | 'error' | 'info'
  message: string
  suggestion?: string
}

interface SeoHelperProps {
  title?: string
  metaTitle?: string
  metaDescription?: string
  content?: string
  slug?: string
  focusKeyword?: string
  images?: { alt: string; src: string }[]
}

export default function SeoHelper({
  title = '',
  metaTitle = '',
  metaDescription = '',
  content = '',
  slug = '',
  focusKeyword = '',
  images = [],
}: SeoHelperProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [analysis, setAnalysis] = useState<SeoAnalysis>({ score: 0, items: [] })

  useEffect(() => {
    const items: SeoItem[] = []

    // Meta Title Analysis
    if (!metaTitle) {
      items.push({
        id: 'meta-title-empty',
        title: 'عنوان متا',
        status: 'error',
        message: 'عنوان متا وارد نشده است',
        suggestion: 'عنوان متا را وارد کنید. طول ایده‌آل: ۳۰-۶۰ کاراکتر',
      })
    } else if (metaTitle.length < 30) {
      items.push({
        id: 'meta-title-short',
        title: 'عنوان متا',
        status: 'warning',
        message: `عنوان متا کوتاه است (${metaTitle.length} کاراکتر)`,
        suggestion: 'عنوان متا حداقل ۳۰ کاراکتر باشد',
      })
    } else if (metaTitle.length > 60) {
      items.push({
        id: 'meta-title-long',
        title: 'عنوان متا',
        status: 'warning',
        message: `عنوان متا طولانی است (${metaTitle.length} کاراکتر)`,
        suggestion: 'عنوان متا حداکثر ۶۰ کاراکتر باشد',
      })
    } else {
      items.push({
        id: 'meta-title-ok',
        title: 'عنوان متا',
        status: 'good',
        message: `طول عنوان متا مناسب است (${metaTitle.length} کاراکتر)`,
      })
    }

    // Meta Description Analysis
    if (!metaDescription) {
      items.push({
        id: 'meta-desc-empty',
        title: 'توضیحات متا',
        status: 'error',
        message: 'توضیحات متا وارد نشده است',
        suggestion: 'توضیحات متا را وارد کنید. طول ایده‌آل: ۱۲۰-۱۶۰ کاراکتر',
      })
    } else if (metaDescription.length < 120) {
      items.push({
        id: 'meta-desc-short',
        title: 'توضیحات متا',
        status: 'warning',
        message: `توضیحات متا کوتاه است (${metaDescription.length} کاراکتر)`,
        suggestion: 'توضیحات متا حداقل ۱۲۰ کاراکتر باشد',
      })
    } else if (metaDescription.length > 160) {
      items.push({
        id: 'meta-desc-long',
        title: 'توضیحات متا',
        status: 'warning',
        message: `توضیحات متا طولانی است (${metaDescription.length} کاراکتر)`,
        suggestion: 'توضیحات متا حداکثر ۱۶۰ کاراکتر باشد',
      })
    } else {
      items.push({
        id: 'meta-desc-ok',
        title: 'توضیحات متا',
        status: 'good',
        message: `طول توضیحات متا مناسب است (${metaDescription.length} کاراکتر)`,
      })
    }

    // Slug Analysis
    if (!slug) {
      items.push({
        id: 'slug-empty',
        title: 'آدرس صفحه',
        status: 'error',
        message: 'آدرس صفحه (slug) وارد نشده است',
      })
    } else if (/[^\w-]/.test(slug)) {
      items.push({
        id: 'slug-invalid',
        title: 'آدرس صفحه',
        status: 'warning',
        message: 'آدرس صفحه فقط شامل حروف انگلیسی، اعداد و خط تیره باشد',
      })
    } else {
      items.push({
        id: 'slug-ok',
        title: 'آدرس صفحه',
        status: 'good',
        message: 'آدرس صفحه مناسب است',
      })
    }

    // Focus Keyword Analysis
    if (!focusKeyword) {
      items.push({
        id: 'keyword-empty',
        title: 'کلمه کلیدی',
        status: 'info',
        message: 'کلمه کلیدی اصلی مشخص نشده است',
        suggestion: 'یک کلمه کلیدی اصلی برای محتوا تعیین کنید',
      })
    } else {
      // Check keyword in title
      if (metaTitle.includes(focusKeyword)) {
        items.push({
          id: 'keyword-in-title',
          title: 'کلمه کلیدی در عنوان',
          status: 'good',
          message: 'کلمه کلیدی در عنوان متا موجود است',
        })
      } else {
        items.push({
          id: 'keyword-not-in-title',
          title: 'کلمه کلیدی در عنوان',
          status: 'warning',
          message: 'کلمه کلیدی در عنوان متا موجود نیست',
          suggestion: 'کلمه کلیدی را در ابتدای عنوان قرار دهید',
        })
      }

      // Check keyword in description
      if (metaDescription.includes(focusKeyword)) {
        items.push({
          id: 'keyword-in-desc',
          title: 'کلمه کلیدی در توضیحات',
          status: 'good',
          message: 'کلمه کلیدی در توضیحات متا موجود است',
        })
      } else {
        items.push({
          id: 'keyword-not-in-desc',
          title: 'کلمه کلیدی در توضیحات',
          status: 'warning',
          message: 'کلمه کلیدی در توضیحات متا موجود نیست',
        })
      }

      // Check keyword density in content
      if (content) {
        const wordCount = content.split(/\s+/).length
        const keywordCount = (content.match(new RegExp(focusKeyword, 'gi')) || []).length
        const density = (keywordCount / wordCount) * 100

        if (density < 0.5) {
          items.push({
            id: 'keyword-density-low',
            title: 'تراکم کلمه کلیدی',
            status: 'warning',
            message: `تراکم کلمه کلیدی کم است (${density.toFixed(1)}%)`,
            suggestion: 'کلمه کلیدی را بیشتر در متن استفاده کنید',
          })
        } else if (density > 2.5) {
          items.push({
            id: 'keyword-density-high',
            title: 'تراکم کلمه کلیدی',
            status: 'warning',
            message: `تراکم کلمه کلیدی زیاد است (${density.toFixed(1)}%)`,
            suggestion: 'از تکرار بیش از حد کلمه کلیدی خودداری کنید',
          })
        } else {
          items.push({
            id: 'keyword-density-ok',
            title: 'تراکم کلمه کلیدی',
            status: 'good',
            message: `تراکم کلمه کلیدی مناسب است (${density.toFixed(1)}%)`,
          })
        }
      }
    }

    // Content Length Analysis
    if (content) {
      const wordCount = content.split(/\s+/).filter(Boolean).length
      if (wordCount < 300) {
        items.push({
          id: 'content-short',
          title: 'طول محتوا',
          status: 'warning',
          message: `محتوا کوتاه است (${wordCount} کلمه)`,
          suggestion: 'محتوای بیشتری اضافه کنید. حداقل ۳۰۰ کلمه توصیه می‌شود',
        })
      } else {
        items.push({
          id: 'content-ok',
          title: 'طول محتوا',
          status: 'good',
          message: `طول محتوا مناسب است (${wordCount} کلمه)`,
        })
      }
    }

    // Image Alt Analysis
    if (images.length > 0) {
      const imagesWithoutAlt = images.filter((img) => !img.alt)
      if (imagesWithoutAlt.length > 0) {
        items.push({
          id: 'images-no-alt',
          title: 'متن جایگزین تصاویر',
          status: 'warning',
          message: `${imagesWithoutAlt.length} تصویر بدون متن جایگزین (alt)`,
          suggestion: 'برای همه تصاویر متن جایگزین تعریف کنید',
        })
      } else {
        items.push({
          id: 'images-alt-ok',
          title: 'متن جایگزین تصاویر',
          status: 'good',
          message: 'همه تصاویر دارای متن جایگزین هستند',
        })
      }
    }

    // Calculate score
    const totalItems = items.length
    const goodItems = items.filter((i) => i.status === 'good').length
    const warningItems = items.filter((i) => i.status === 'warning').length
    const score = Math.round(
      ((goodItems + warningItems * 0.5) / totalItems) * 100
    )

    setAnalysis({ score, items })
  }, [title, metaTitle, metaDescription, content, slug, focusKeyword, images])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStatusIcon = (status: SeoItem['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-primary" />
          <span className="font-bold text-dark">راهنمای سئو</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}%
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 border-t space-y-3">
          {/* Score Bar */}
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  analysis.score >= 80
                    ? 'bg-green-500'
                    : analysis.score >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          </div>

          {/* Items */}
          {analysis.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {getStatusIcon(item.status)}
              <div className="flex-1">
                <p className="font-medium text-dark text-sm">{item.title}</p>
                <p className="text-sm text-gray-600">{item.message}</p>
                {item.suggestion && (
                  <p className="text-xs text-gray-400 mt-1">💡 {item.suggestion}</p>
                )}
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2 text-sm">نکات سئو</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                عنوان متا بین ۳۰ تا ۶۰ کاراکتر باشد
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                توضیحات متا بین ۱۲۰ تا ۱۶۰ کاراکتر باشد
              </li>
              <li className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                کلمه کلیدی در ابتدای عنوان قرار گیرد
              </li>
              <li className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                همه تصاویر دارای alt باشند
              </li>
              <li className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                از لینک‌های داخلی استفاده کنید
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
