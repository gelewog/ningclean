'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as React from 'react'

// Buat QueryClient dengan konfigurasi cache optimal
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data dianggap "fresh" selama waktu ini
        // Setelah lewat, dianggap "stale" dan akan di-refetch
        staleTime: 2 * 60 * 1000, // 2 menit default
        
        // Data di-cache selama waktu ini meskipun component unmounted
        gcTime: 10 * 60 * 1000, // 10 menit (sebelumnya cacheTime)
        
        // Retry 3 kali jika gagal
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch otomatis saat window kembali focus
        refetchOnWindowFocus: true,
        
        // Refetch jika network reconnect
        refetchOnReconnect: true,
        
        // Jangan refetch saat mount jika data masih fresh
        refetchOnMount: false,
      },
      mutations: {
        // Retry mutation 1 kali saja
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: selalu buat queryClient baru
    return makeQueryClient()
  } else {
    // Browser: buat queryClient sekali saja
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
