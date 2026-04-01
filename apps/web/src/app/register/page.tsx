'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { authApi, isAuthenticated } from '@/lib/api';
import { useForm } from 'react-hook-form';
import AuthHeaderSection from '@/components/sections/AuthHeaderSection';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="pt-32 pb-16">
        <div className="container-fluid max-w-md mx-auto px-4">
          <AuthHeaderSection title="Daftar" subtitle="Buat akun baru dan mulai booking" />

          <Card>
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Nama wajib diisi',
                    minLength: {
                      value: 2,
                      message: 'Nama minimal 2 karakter',
                    },
                  })}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="nama@email.com"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email tidak valid',
                    },
                  })}
                />

                <Input
                  label="Nomor Telepon"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Nomor telepon wajib diisi',
                    pattern: {
                      value: /^[0-9]{10,13}$/,
                      message: 'Nomor telepon tidak valid',
                    },
                  })}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password wajib diisi',
                    minLength: {
                      value: 6,
                      message: 'Password minimal 6 karakter',
                    },
                  })}
                />

                <Input
                  label="Konfirmasi Password"
                  type="password"
                  placeholder="Ulangi password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Konfirmasi password wajib diisi',
                    validate: (value) =>
                      value === password || 'Password tidak cocok',
                  })}
                />

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Saya setuju dengan{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Syarat & Ketentuan
                    </Link>{' '}
                    dan{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Kebijakan Privasi
                    </Link>
                  </span>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Daftar
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Sudah punya akun?{' '}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Masuk
                  </Link>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
