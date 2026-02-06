'use client'

import { motion } from 'framer-motion'
import { Breadcrumb } from '@/components/common'
import {
  Package,
  Tag,
  Cog,
  FileText,
  Building,
  MessageSquare,
  Radio,
  Camera,
  Shield,
  Headphones,
  Network,
  Volume2,
  Settings,
  Award,
  Newspaper,
  LucideIcon
} from 'lucide-react'

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  Package,
  Tag,
  Cog,
  FileText,
  Building,
  MessageSquare,
  Radio,
  Camera,
  Shield,
  Headphones,
  Network,
  Volume2,
  Settings,
  Award,
  Newspaper,
}

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumbItems: { name: string; url: string }[]
  iconName?: string
  showPattern?: boolean
}

export default function PageHero({
  title,
  subtitle,
  breadcrumbItems,
  iconName,
  showPattern = true,
}: PageHeroProps) {
  const Icon = iconName ? iconMap[iconName] : null

  return (
    <section className="relative bg-slate-900 overflow-hidden">
      {/* Background Pattern */}
      {showPattern && (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      )}

      {/* Red Accent Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Breadcrumb items={breadcrumbItems} variant="dark" />
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto"
        >
          {Icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
              <Icon className="w-8 h-8" />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            fill="rgb(249 250 251)"
          />
        </svg>
      </div>
    </section>
  )
}
