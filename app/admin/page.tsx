import Link from 'next/link'
import {
  Package,
  MessageSquare,
  FileText,
  Briefcase,
} from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Inquiry {
  id: string
  name: string
  status: string
  createdAt: Date
  product: { titleFa: string } | null
}

async function getStats() {
  const [
    productCount,
    inquiryCount,
    postCount,
    projectCount,
    pendingInquiries,
    recentInquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.inquiry.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { titleFa: true }
        }
      }
    }),
  ])

  return {
    productCount,
    inquiryCount,
    postCount,
    projectCount,
    pendingInquiries,
    recentInquiries: recentInquiries as Inquiry[],
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

function toPersianNumber(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)])
}

const quickActions = [
  { name: 'افزودن محصول', href: '/admin/products/new' },
  { name: 'افزودن مقاله', href: '/admin/posts/new' },
  { name: 'مشاهده استعلام‌ها', href: '/admin/inquiries' },
  { name: 'تنظیمات سایت', href: '/admin/settings' },
]

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      name: 'کل محصولات',
      value: toPersianNumber(stats.productCount),
      icon: Package,
      href: '/admin/products',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'استعلام‌های جدید',
      value: toPersianNumber(stats.pendingInquiries),
      icon: MessageSquare,
      href: '/admin/inquiries',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'مقالات منتشر شده',
      value: toPersianNumber(stats.postCount),
      icon: FileText,
      href: '/admin/posts',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      name: 'پروژه‌های انجام شده',
      value: toPersianNumber(stats.projectCount),
      icon: Briefcase,
      href: '/admin/projects',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">داشبورد</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.name}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="font-bold text-dark">آخرین استعلام‌ها</h2>
            <Link href="/admin/inquiries" className="text-sm text-primary hover:underline">
              مشاهده همه
            </Link>
          </div>

          <div className="divide-y">
            {stats.recentInquiries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                استعلامی ثبت نشده است
              </div>
            ) : (
              stats.recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-medium text-dark">{inquiry.name}</h4>
                    <p className="text-sm text-gray-500">{inquiry.product?.titleFa || 'بدون محصول'}</p>
                  </div>
                  <div className="text-left">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        inquiry.status === 'NEW'
                          ? 'bg-yellow-100 text-yellow-700'
                          : inquiry.status === 'ANSWERED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {inquiry.status === 'NEW' ? 'جدید' : inquiry.status === 'ANSWERED' ? 'پاسخ داده شده' : 'بسته شده'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(inquiry.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-dark mb-4">دسترسی سریع</h2>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="block w-full px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg text-dark hover:text-primary transition-colors text-sm font-medium"
              >
                {action.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-bold text-dark mb-3 text-sm">راهنما</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• برای افزودن محصول جدید از منوی محصولات استفاده کنید</li>
              <li>• استعلام‌های جدید را سریعاً پاسخ دهید</li>
              <li>• از پشتیبان‌گیری منظم غافل نشوید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
