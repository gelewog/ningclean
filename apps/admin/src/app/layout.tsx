import type { Metadata } from 'next'
import { Toaster } from 'sonner'
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
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#fff',
              border: 'none',
            },
          }}
        />
      </body>
    </html>
  )
}
