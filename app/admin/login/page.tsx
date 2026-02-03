'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'

const loginSchema = z.object({
  email: z.string().email('ایمیل معتبر وارد کنید'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const error = searchParams.get('error')

  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(
    error === 'CredentialsSignin' ? 'ایمیل یا رمز عبور اشتباه است' : null
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setLoginError('ایمیل یا رمز عبور اشتباه است')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setLoginError('خطا در ورود به سیستم')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        ورود به پنل
      </h2>

      {loginError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{loginError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <div className="relative">
            <input
              type="email"
              dir="ltr"
              className={`w-full px-4 py-3 pr-11 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="admin@example.com"
              {...register('email')}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رمز عبور
          </label>
          <div className="relative">
            <input
              type="password"
              dir="ltr"
              className={`w-full px-4 py-3 pr-11 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              {...register('password')}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              در حال ورود...
            </>
          ) : (
            'ورود به پنل'
          )}
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <Image
              src="/images/logo.png"
              alt="کرمان هاتف ارتباط"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">پنل مدیریت</h1>
          <p className="text-gray-400 mt-2">کرمان هاتف ارتباط</p>
        </div>

        {/* Login Form */}
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-2xl p-8 animate-pulse h-96" />}>
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © ۱۴۰۳ کرمان هاتف ارتباط - تمامی حقوق محفوظ است
        </p>
      </div>
    </div>
  )
}
