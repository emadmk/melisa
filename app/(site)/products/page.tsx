import { Metadata } from 'next'
import ProductsCategoryLanding from '@/components/products/ProductsCategoryLanding'

export const metadata: Metadata = {
  title: 'Products | Melisa Trading',
  description:
    'Explore our comprehensive range of telecommunications, security, and surveillance solutions. PAGA systems, CCTV, radar, radio communication, microwave, and fiber optic networks.',
  keywords: [
    'PAGA systems',
    'industrial CCTV',
    'radar security',
    'radio communication',
    'microwave links',
    'fiber optic',
    'OTN systems',
    'telecommunications equipment',
    'security solutions',
    'Melisa Trading',
  ],
}

export default function ProductsPage() {
  return <ProductsCategoryLanding />
}
