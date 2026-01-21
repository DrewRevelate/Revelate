'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingBookingButton from '@/components/FloatingBookingButton'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

/**
 * Conditionally renders marketing site chrome (Navigation, Footer, FloatingBookingButton)
 * based on the current route. RevOps routes get their own isolated layout.
 */
export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()

  // RevOps and admin routes use their own layouts
  const isAppRoute = pathname?.startsWith('/revops') || pathname?.startsWith('/admin')

  if (isAppRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <main role="main">
        {children}
      </main>
      <Footer />
      <FloatingBookingButton />
    </>
  )
}
