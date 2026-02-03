import Link from 'next/link'
import { Home, ArrowRight, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-dark mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Unfortunately, the page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-dark px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border"
          >
            <Search className="w-5 h-5" />
            Search
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-4">These pages might be helpful:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/products" className="text-primary hover:underline flex items-center gap-1">
              <ArrowRight className="w-4 h-4" />
              Products
            </Link>
            <Link href="/services" className="text-primary hover:underline flex items-center gap-1">
              <ArrowRight className="w-4 h-4" />
              Services
            </Link>
            <Link href="/contact" className="text-primary hover:underline flex items-center gap-1">
              <ArrowRight className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
