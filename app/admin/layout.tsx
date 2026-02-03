'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building2,
  Wrench,
  FileText,
  FileDown,
  FolderKanban,
  Award,
  HelpCircle,
  MessageSquare,
  Settings,
  Database,
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { name: 'داشبورد', href: '/admin', icon: LayoutDashboard },
  { name: 'محصولات', href: '/admin/products', icon: Package },
  { name: 'دسته‌بندی‌ها', href: '/admin/categories', icon: FolderTree },
  { name: 'برندها', href: '/admin/brands', icon: Building2 },
  { name: 'خدمات', href: '/admin/services', icon: Wrench },
  { name: 'وبلاگ', href: '/admin/posts', icon: FileText },
  { name: 'کاتالوگ‌ها', href: '/admin/catalogs', icon: FileDown },
  { name: 'پروژه‌ها', href: '/admin/projects', icon: FolderKanban },
  { name: 'گواهینامه‌ها', href: '/admin/certificates', icon: Award },
  { name: 'سوالات متداول', href: '/admin/faqs', icon: HelpCircle },
  { name: 'استعلام‌ها', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'تنظیمات', href: '/admin/settings', icon: Settings },
  { name: 'پشتیبان‌گیری', href: '/admin/backup', icon: Database },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-64 bg-slate-800 text-white z-50 transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">
              ه
            </div>
            <span className="font-bold">پنل مدیریت</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white text-sm"
          >
            <LogOut className="w-4 h-4" />
            بازگشت به سایت
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:mr-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"
              >
                مشاهده سایت
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
