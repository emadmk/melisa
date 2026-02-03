import { Header, Footer } from '@/components/layout'
import { WhatsAppButton, BackToTop } from '@/components/common'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}
