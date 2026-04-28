import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { QueryProvider } from '@/lib/query-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ningclean Admin Dashboard',
  description: 'Professional admin dashboard for Ningclean cleaning services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              theme="system"
              toastOptions={{
                style: {
                  background: '#1E293B',
                  color: '#fff',
                  border: 'none',
                },
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
