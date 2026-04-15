'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils'
import './preview.css'

interface DraftPost {
  title: string
  content: string
  excerpt: string
  coverImage: string
  author: string
  tags: string[]
  readTime: number
  createdAt: string
  slug: string
  category?: { id: string; name: string; slug: string }
}

export default function BlogPreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [post, setPost] = React.useState<DraftPost | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Get draft data from localStorage
    const draftData = localStorage.getItem('blog_draft_preview')
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData)
        setPost(parsed)
        // Clear the draft after loading
        // localStorage.removeItem('blog_draft_preview')
      } catch (e) {
        console.error('Failed to parse draft data', e)
      }
    }
    setLoading(false)
  }, [])

  // Helper untuk mendapatkan URL gambar full
  const getImageUrl = (url: string | undefined): string => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    return `${apiBase.replace('/api', '')}${url}`
  }

  // Helper untuk parse markdown-style headings untuk TOC
  const headings = post?.content?.match(/^##\s+(.+)$/gm) || []

  if (loading) {
    return <PageLoader />
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navigation />
        <div className="container-fluid py-32 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Preview Tidak Tersedia</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Data preview tidak ditemukan. Apakah kamu sudah menyimpan draft?</p>
          <Link href="/admin/blog" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Kembali ke Blog Admin
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation />

      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-amber-500 text-white py-2 px-4 text-center text-sm font-medium">
        <span>🔍 Preview Mode - Post belum disimpan ke database</span>
      </div>

      {/* Article Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-teal-950">
        <div className="container-fluid max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span className="text-white/50">/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span className="text-white/50">/</span>
              <span className="text-white font-medium truncate max-w-[200px]">{post.title}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="font-medium">{post.author || 'Admin Ningclean'}</span>
              <span className="text-white/50">•</span>
              <span>{post.createdAt ? formatDate(post.createdAt) : 'Draft'}</span>
              <span className="text-white/50">•</span>
              <span>{post.readTime || 5} menit baca</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.coverImage && (
        <section className="py-8 -mt-6 relative z-10">
          <div className="container-fluid max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50">
              <img
                src={getImageUrl(post.coverImage)}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-12">
        <div className="container-fluid max-w-4xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents - Desktop */}
            {headings.length > 0 && (
              <div className="hidden lg:block">
                <div className="sticky top-32 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Daftar Isi</h3>
                  <nav className="space-y-2">
                    {headings.map((heading, idx) => {
                      const title = heading.replace(/^##\s+/, '')
                      return (
                        <a
                          key={idx}
                          href={`#${title.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 border-l-2 border-transparent hover:border-emerald-500 pl-3 -ml-0.5"
                        >
                          {title}
                        </a>
                      )
                    })}
                  </nav>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none blog-content
                  prose-headings:text-slate-900 dark:prose-headings:text-slate-50
                  prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900 dark:prose-strong:text-slate-50
                  prose-em:text-slate-600 dark:prose-em:text-slate-400
                  prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-blockquote:border-l-emerald-500 dark:prose-blockquote:border-l-emerald-500
                  prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/30
                  prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                  prose-code:text-pink-600 dark:prose-code:text-pink-400
                  prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100
                  dark:prose-h1:text-slate-50 dark:prose-h2:text-slate-50 dark:prose-h3:text-slate-50
                  dark:prose-h4:text-slate-50 dark:prose-h5:text-slate-50 dark:prose-h6:text-slate-50
                  dark:prose-ol:text-slate-300 dark:prose-ul:text-slate-300"
              >
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </motion.article>

              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white mb-4">Bagikan Artikel</p>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166fe5] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1a91da] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.885 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:bg-[#22c35e] transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-slate-600 dark:bg-slate-700 text-white flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="container-fluid max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Artikel Terkait</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
              <p>Artikel terkait akan muncul di sini</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
              <p>Artikel terkait akan muncul di sini</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}