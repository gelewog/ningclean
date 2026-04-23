'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/Spinner';
import { CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Masukkan email yang valid');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen page-bg">
        <div className="pointer-events-none fixed inset-0 select-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.06] blur-[130px]" />
        </div>

        <Navigation />

        <main className="relative z-10">
          <section className="pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </motion.div>

                <h1 className="font-serif text-3xl text-white mb-3">
                  Link Terkirim!
                </h1>
                <p className="text-[14px] text-white/45 mb-8 leading-relaxed">
                  Kami sudah kirim link reset password ke{' '}
                  <span className="text-emerald-400 font-medium">{email}</span>.
                  Cek inbox atau folder spam kamu.
                </p>

                {/* Info card */}
                <div className="page-section-card border rounded-2xl p-5 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400/70 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-medium text-white/70 mb-1">Link berlaku 24 jam</p>
                      <p className="text-[12px] text-white/35">
                        Jika tidak terima email dalam 5 menit, coba cek folder spam atau minta link lagi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/login" className="block">
                    <Button variant="accent" className="w-full">
                      Kembali ke Login
                    </Button>
                  </Link>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setEmail('');
                    }}
                    className="w-full text-[13px] text-white/45 hover:text-white/70 transition-colors py-2"
                  >
                    Kirim ke email lain
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 select-none overflow-hidden">
        <div className="absolute -top-20 -left-24 w-[400px] h-[400px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        <div className="absolute -bottom-20 -right-24 w-[350px] h-[350px] rounded-full bg-blue-600/[0.05] blur-[100px]" />
      </div>

      <Navigation />

      <main className="relative z-10">
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-md">
            {/* Back link */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[13px] text-white/45 hover:text-white/70 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke login
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="page-section-card border rounded-2xl p-6"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              <h1 className="font-serif text-2xl text-white text-center mb-2">
                Lupa Password?
              </h1>
              <p className="text-[13px] text-white/40 text-center mb-6 leading-relaxed">
                Tenang, masukkan email kamu dan kami kirim link untuk reset password.
              </p>

              <AnimatePresence mode="wait">
                {status === 'error' && errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[13px] text-rose-400"
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] text-white/60 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 rounded-xl page-input border
                               text-white text-[14px] placeholder-white/30
                               focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.04]
                               transition-colors duration-200"
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full"
                  isLoading={status === 'loading'}
                >
                  Kirim Link Reset
                </Button>
              </form>

              {/* Security note */}
              <div className="mt-5 pt-5 border-t page-border flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/30 leading-relaxed">
                  Email kamu aman. Kami tidak pernah simpan password dalam plaintext.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
