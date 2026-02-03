import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import BrandsSection from '@/components/home/BrandsSection'
import ServicesSection from '@/components/home/ServicesSection'
import WhoWeAreSection from '@/components/home/WhoWeAreSection'
import CustomersSection from '@/components/home/CustomersSection'
import LatestPosts from '@/components/home/LatestPosts'

export const metadata: Metadata = {
  title: 'Melisa | Telecommunications & Security Solutions',
  description:
    'Melisa is a telecommunications company specializing in telecommunications, radio, CCTV, and paging projects. We provide high-quality and secure communication solutions in Dubai, UAE.',
  keywords: [
    'telecommunications equipment',
    'CCTV cameras',
    'security systems',
    'Motorola',
    'Avigilon',
    'Cambium Networks',
    'radio communication',
    'paging systems',
    'Dubai',
    'UAE',
  ],
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandsSection />
      <ServicesSection />
      <WhoWeAreSection />
      <CustomersSection />
      <LatestPosts />
    </>
  )
}
