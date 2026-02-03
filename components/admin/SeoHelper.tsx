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
        title: 'Meta Title',
        status: 'error',
        message: 'Meta title is not entered',
        suggestion: 'Enter a meta title. Ideal length: 30-60 characters',
      })
    } else if (metaTitle.length < 30) {
      items.push({
        id: 'meta-title-short',
        title: 'Meta Title',
        status: 'warning',
        message: `Meta title is too short (${metaTitle.length} characters)`,
        suggestion: 'Meta title should be at least 30 characters',
      })
    } else if (metaTitle.length > 60) {
      items.push({
        id: 'meta-title-long',
        title: 'Meta Title',
        status: 'warning',
        message: `Meta title is too long (${metaTitle.length} characters)`,
        suggestion: 'Meta title should be maximum 60 characters',
      })
    } else {
      items.push({
        id: 'meta-title-ok',
        title: 'Meta Title',
        status: 'good',
        message: `Meta title length is appropriate (${metaTitle.length} characters)`,
      })
    }

    // Meta Description Analysis
    if (!metaDescription) {
      items.push({
        id: 'meta-desc-empty',
        title: 'Meta Description',
        status: 'error',
        message: 'Meta description is not entered',
        suggestion: 'Enter a meta description. Ideal length: 120-160 characters',
      })
    } else if (metaDescription.length < 120) {
      items.push({
        id: 'meta-desc-short',
        title: 'Meta Description',
        status: 'warning',
        message: `Meta description is too short (${metaDescription.length} characters)`,
        suggestion: 'Meta description should be at least 120 characters',
      })
    } else if (metaDescription.length > 160) {
      items.push({
        id: 'meta-desc-long',
        title: 'Meta Description',
        status: 'warning',
        message: `Meta description is too long (${metaDescription.length} characters)`,
        suggestion: 'Meta description should be maximum 160 characters',
      })
    } else {
      items.push({
        id: 'meta-desc-ok',
        title: 'Meta Description',
        status: 'good',
        message: `Meta description length is appropriate (${metaDescription.length} characters)`,
      })
    }

    // Slug Analysis
    if (!slug) {
      items.push({
        id: 'slug-empty',
        title: 'Page URL',
        status: 'error',
        message: 'Page URL (slug) is not entered',
      })
    } else if (/[^\w-]/.test(slug)) {
      items.push({
        id: 'slug-invalid',
        title: 'Page URL',
        status: 'warning',
        message: 'Page URL should only contain English letters, numbers and hyphens',
      })
    } else {
      items.push({
        id: 'slug-ok',
        title: 'Page URL',
        status: 'good',
        message: 'Page URL is appropriate',
      })
    }

    // Focus Keyword Analysis
    if (!focusKeyword) {
      items.push({
        id: 'keyword-empty',
        title: 'Keyword',
        status: 'info',
        message: 'Focus keyword is not specified',
        suggestion: 'Set a focus keyword for your content',
      })
    } else {
      // Check keyword in title
      if (metaTitle.includes(focusKeyword)) {
        items.push({
          id: 'keyword-in-title',
          title: 'Keyword in Title',
          status: 'good',
          message: 'Keyword is present in meta title',
        })
      } else {
        items.push({
          id: 'keyword-not-in-title',
          title: 'Keyword in Title',
          status: 'warning',
          message: 'Keyword is not present in meta title',
          suggestion: 'Place the keyword at the beginning of the title',
        })
      }

      // Check keyword in description
      if (metaDescription.includes(focusKeyword)) {
        items.push({
          id: 'keyword-in-desc',
          title: 'Keyword in Description',
          status: 'good',
          message: 'Keyword is present in meta description',
        })
      } else {
        items.push({
          id: 'keyword-not-in-desc',
          title: 'Keyword in Description',
          status: 'warning',
          message: 'Keyword is not present in meta description',
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
            title: 'Keyword Density',
            status: 'warning',
            message: `Keyword density is low (${density.toFixed(1)}%)`,
            suggestion: 'Use the keyword more in the text',
          })
        } else if (density > 2.5) {
          items.push({
            id: 'keyword-density-high',
            title: 'Keyword Density',
            status: 'warning',
            message: `Keyword density is high (${density.toFixed(1)}%)`,
            suggestion: 'Avoid excessive keyword repetition',
          })
        } else {
          items.push({
            id: 'keyword-density-ok',
            title: 'Keyword Density',
            status: 'good',
            message: `Keyword density is appropriate (${density.toFixed(1)}%)`,
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
          title: 'Content Length',
          status: 'warning',
          message: `Content is short (${wordCount} words)`,
          suggestion: 'Add more content. At least 300 words is recommended',
        })
      } else {
        items.push({
          id: 'content-ok',
          title: 'Content Length',
          status: 'good',
          message: `Content length is appropriate (${wordCount} words)`,
        })
      }
    }

    // Image Alt Analysis
    if (images.length > 0) {
      const imagesWithoutAlt = images.filter((img) => !img.alt)
      if (imagesWithoutAlt.length > 0) {
        items.push({
          id: 'images-no-alt',
          title: 'Image Alt Text',
          status: 'warning',
          message: `${imagesWithoutAlt.length} image(s) without alt text`,
          suggestion: 'Define alt text for all images',
        })
      } else {
        items.push({
          id: 'images-alt-ok',
          title: 'Image Alt Text',
          status: 'good',
          message: 'All images have alt text',
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
          <span className="font-bold text-dark">SEO Guide</span>
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
                  <p className="text-xs text-gray-400 mt-1">Tip: {item.suggestion}</p>
                )}
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-2 text-sm">SEO Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Meta title should be between 30 and 60 characters
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Meta description should be between 120 and 160 characters
              </li>
              <li className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Place the keyword at the beginning of the title
              </li>
              <li className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                All images should have alt text
              </li>
              <li className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Use internal links
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
