export interface Product {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  shortDesc: string | null
  fullDesc: string | null
  image: string | null
  gallery: string[]
  catalogFile: string | null
  status: 'DRAFT' | 'PUBLISHED'
  featured: boolean
  metaTitle: string | null
  metaDesc: string | null
  keywords: string[]
  categoryId: string | null
  category: Category | null
  brandId: string | null
  brand: Brand | null
  attributes: ProductAttribute[]
  viewCount: number
  oldUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProductAttribute {
  id: string
  key: string
  value: string
  productId: string
  order: number
}

export interface Category {
  id: string
  nameFa: string
  nameEn: string | null
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  parent: Category | null
  children: Category[]
  order: number
  metaTitle: string | null
  metaDesc: string | null
  createdAt: Date
  updatedAt: Date
  _count?: {
    products: number
  }
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  description: string | null
  website: string | null
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
  _count?: {
    products: number
  }
}

export interface Service {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  shortDesc: string | null
  fullDesc: string | null
  icon: string | null
  image: string | null
  status: 'DRAFT' | 'PUBLISHED'
  order: number
  metaTitle: string | null
  metaDesc: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  excerpt: string | null
  content: string | null
  image: string | null
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt: Date | null
  author: string | null
  postCategoryId: string | null
  postCategory: PostCategory | null
  tags: string[]
  viewCount: number
  metaTitle: string | null
  metaDesc: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PostCategory {
  id: string
  nameFa: string
  nameEn: string | null
  slug: string
  createdAt: Date
  updatedAt: Date
  _count?: {
    posts: number
  }
}

export interface Project {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  description: string | null
  images: string[]
  client: string | null
  location: string | null
  year: string | null
  status: 'DRAFT' | 'PUBLISHED'
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Certificate {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  description: string | null
  image: string | null
  issuer: string | null
  issueDate: Date | null
  status: 'DRAFT' | 'PUBLISHED'
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Catalog {
  id: string
  titleFa: string
  titleEn: string | null
  slug: string
  description: string | null
  file: string
  thumbnail: string | null
  categoryId: string | null
  category: CatalogCategory | null
  downloads: number
  status: 'DRAFT' | 'PUBLISHED'
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CatalogCategory {
  id: string
  nameFa: string
  nameEn: string | null
  slug: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Faq {
  id: string
  question: string
  answer: string
  categoryId: string | null
  category: FaqCategory | null
  status: 'DRAFT' | 'PUBLISHED'
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface FaqCategory {
  id: string
  nameFa: string
  nameEn: string | null
  slug: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Inquiry {
  id: string
  name: string
  company: string | null
  phone: string
  email: string
  message: string | null
  productId: string | null
  product: Product | null
  status: 'NEW' | 'REVIEWED' | 'ANSWERED' | 'CLOSED'
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Setting {
  id: string
  key: string
  value: string
  createdAt: Date
  updatedAt: Date
}

// Form Types
export interface InquiryFormData {
  name: string
  company?: string
  phone: string
  email: string
  message?: string
  productId?: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ServiceRequestFormData {
  name: string
  phone: string
  serviceType: string
  message?: string
}

// Pagination
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Search
export interface SearchResult {
  products: Product[]
  posts: Post[]
  services: Service[]
  total: number
}

// Compare
export interface CompareItem {
  id: string
  titleFa: string
  image: string | null
  category: string | null
  brand: string | null
  attributes: ProductAttribute[]
}
