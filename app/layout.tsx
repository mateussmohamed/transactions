import { PageFooter } from '@/components/page-footer'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/lib/react-query/react-query-provider'

import { PageHeader } from '@/components/page-header'
import './globals.css'

export const metadata = {
  title: 'Transactions'
}

interface RootLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="relative flex min-h-screen flex-col justify-between bg-gray-100">
          <div className="container max-w-7xl mx-auto mb-10">
            <PageHeader />
            <Providers>
              <main className="bg-white rounded-3xl p-10">{children}</main>
              {modal}
              <Toaster />
            </Providers>
          </div>
          <PageFooter />
        </div>
      </body>
    </html>
  )
}
