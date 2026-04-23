'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import { authApi, isAuthenticated } from '@/lib/api';
import { useForm } from 'react-hook-form';
import AuthHeaderSection from '@/components/sections/AuthHeaderSection';
import { SectionLoader } from '@/components/ui/Spinner';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(redirect);
    }
  }, [router, redirect]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.login(data.email, data.password);
      router.push(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 select-none overflow-hidden">
        <div className="absolute -top-20 -left-24 w-[400px] h-[400px] rounded-full hero-glow-1 blur-[120px]" />
        <div className="absolute -bottom-20 -right-24 w-[350px] h-[350px] rounded-full hero-glow-2 blur-[100px]" />
      </div>

      <Navigation />

      <main className="relative z-10">
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-md">
            <AuthHeaderSection title="Masuk" subtitle="Selamat datang kembali!" />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="page-card rounded-2xl p-6"
            >
              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[13px]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-[13px] page-text-muted mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    {...register('email', {
                      required: 'Email wajib diisi',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email tidak valid',
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl page-input border
                               text-[14px]
                               focus:outline-none focus:border-emerald-400
                               transition-colors duration-200"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-rose-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[13px] page-text-muted mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Password wajib diisi',
                        minLength: {
                          value: 6,
                          message: 'Password minimal 6 karakter',
                        },
                      })}
                      className="w-full px-4 py-3 rounded-xl page-input border
                                 text-[14px]
                                 focus:outline-none focus:border-emerald-400
                                 transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 page-text-muted hover:page-text transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-[11px] text-rose-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.05] text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-[13px] page-text-muted">Ingat saya</span>
                  </label>
                  <Link href="/forgot-password" className="text-[13px] text-emerald-400 hover:text-emerald-300 transition-colors">
                    Lupa password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="accent" className="w-full" isLoading={isLoading}>
                  Masuk
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-6 pt-6 border-t page-border text-center">
                <p className="text-[13px] page-text-muted">
                  Belum punya akun?{' '}
                  <Link href="/register" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                    Daftar
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 bg-emerald-500/[0.05] border border-emerald-500/[0.15] rounded-xl"
            >
              <p className="text-[13px] font-medium text-emerald-400 mb-2">Akun Demo:</p>
              <div className="text-[12px] page-text-muted space-y-1">
                <p>Customer: customer1@ningclean.id / cust123</p>
                <p>Admin: admin@ningclean.id / admin123</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <LoginForm />
    </Suspense>
  );
}
