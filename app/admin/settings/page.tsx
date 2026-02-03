'use client'

import { useState } from 'react'
import { Save, Upload } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'عمومی' },
    { id: 'contact', name: 'اطلاعات تماس' },
    { id: 'social', name: 'شبکه‌های اجتماعی' },
    { id: 'seo', name: 'SEO' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">تنظیمات</h1>
        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          <Save className="w-5 h-5" />
          ذخیره تغییرات
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-dark'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام سایت (فارسی)
                </label>
                <input
                  type="text"
                  defaultValue="کرمان هاتف ارتباط"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام سایت (انگلیسی)
                </label>
                <input
                  type="text"
                  defaultValue="Kerman Hatef Ertebat"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات سایت
              </label>
              <textarea
                rows={3}
                defaultValue="نمایندگی رسمی موتورولا، آویژیلون و کمبیوم نتورکس در ایران"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لوگو سایت
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-orange-50 transition-colors w-fit">
                <Upload className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">آپلود لوگو</p>
                  <p className="text-xs text-gray-400">PNG, SVG - حداکثر ۱ مگابایت</p>
                </div>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره تلفن
                </label>
                <input
                  type="text"
                  defaultValue="021-24871000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره واتساپ
                </label>
                <input
                  type="text"
                  defaultValue="+989121234567"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ایمیل
              </label>
              <input
                type="email"
                defaultValue="info@hatefertebat.ir"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                آدرس
              </label>
              <textarea
                rows={2}
                defaultValue="تهران، رسالت، مجیدیه شمالی، خ اردکانی، کوچه مهتابی پور، پلاک ۲۸"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ساعات کاری
                </label>
                <input
                  type="text"
                  defaultValue="شنبه تا پنج‌شنبه ۹ تا ۱۸"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  موقعیت روی نقشه
                </label>
                <input
                  type="text"
                  placeholder="lat, lng"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اینستاگرام
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لینکدین
              </label>
              <input
                type="text"
                placeholder="https://linkedin.com/company/..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تلگرام
              </label>
              <input
                type="text"
                placeholder="https://t.me/..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان صفحه اصلی (Title)
              </label>
              <input
                type="text"
                defaultValue="کرمان هاتف ارتباط | نمایندگی رسمی موتورولا در ایران"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات متا (Meta Description)
              </label>
              <textarea
                rows={3}
                defaultValue="کرمان هاتف ارتباط، نمایندگی رسمی موتورولا، آویژیلون و کمبیوم نتورکس. فروش و خدمات تجهیزات مخابراتی، دوربین مداربسته و کنترل دسترسی."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کلمات کلیدی
              </label>
              <input
                type="text"
                defaultValue="موتورولا، دوربین مداربسته، تجهیزات مخابراتی، بی‌سیم، کنترل دسترسی"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کد Google Analytics
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                dir="ltr"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
