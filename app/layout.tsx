import { PageFooter } from '@/components/page-footer'
import { ThemeProvider } from '@/components/theme-provider'
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col justify-between bg-background">
            <div className="container max-w-7xl mx-auto mb-10 overflow-hidden">
              <PageHeader />
              <Providers>
                <main className="bg-primary/5 shadow rounded-3xl p-10">{children}</main>
                {modal}
                <Toaster />
              </Providers>
            </div>
            <PageFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
