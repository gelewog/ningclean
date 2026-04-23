'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { BookingCard } from '@/components/cards';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { SectionLoader, PageLoader } from '@/components/ui/Spinner';
import { bookingsApi, authApi, isAuthenticated } from '@/lib/api';
import { Booking, User } from '@/types/api';
import { formatPrice } from '@/lib/utils';
import Cookies from 'js-cookie';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileData, bookingsData] = await Promise.all([
          authApi.getProfile(),
          bookingsApi.getMyBookings(),
        ]);
        setUser(profileData.data);
        setBookings(bookingsData.data || []);
        
        // Filter upcoming bookings (pending or confirmed, future date)
        const today = new Date().toISOString().split('T')[0];
        const upcoming = (bookingsData.data || []).filter(
          (b: Booking) =>
            ['PENDING', 'CONFIRMED'].includes(b.status) &&
            b.scheduledDate >= today
        );
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    authApi.logout();
    router.push('/');
  };

  if (loading) {
    return <PageLoader />;
  }

  const stats = [
    {
      label: 'Total Booking',
      value: bookings.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Menunggu',
      value: bookings.filter((b) => b.status === 'PENDING').length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Selesai',
      value: bookings.filter((b) => b.status === 'COMPLETED').length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600 bg-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-8 bg-gradient-to-br from-primary to-primary-700">
        <div className="container-fluid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <Avatar
                name={user?.name}
                size="lg"
                className="border-4 border-white/20"
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold">Halo, {user?.name || 'User'}!</h1>
                <p className="text-white/70">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/booking">
                <Button variant="accent" size="md">
                  + Booking Baru
                </Button>
              </Link>
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container-fluid">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <section className="py-8">
          <div className="container-fluid">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Booking Mendatang</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.slice(0, 3).map((booking, index) => (
                <BookingCard key={booking.id} booking={booking} index={index} showActions={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Bookings */}
      <section className="py-8 pb-16">
        <div className="container-fluid">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Riwayat Booking</h2>
          </div>

          {bookings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, index) => (
                <BookingCard key={booking.id} booking={booking} index={index} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Booking</h3>
              <p className="text-gray-500 mb-6">Mulai booking layanan cleaning pertama Anda</p>
              <Link href="/booking">
                <Button>Booking Sekarang</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white">
        <div className="container-fluid">
          <h2 className="text-xl font-bold text-foreground mb-6">Aksi Cepat</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/booking">
              <motion.div whileHover={{ y: -2 }} className="bg-primary-50 rounded-xl p-6 text-center cursor-pointer hover:bg-primary-100 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 bg-primary rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-semibold text-foreground">Booking Baru</p>
              </motion.div>
            </Link>
            <Link href="/services">
              <motion.div whileHover={{ y: -2 }} className="bg-secondary-50 rounded-xl p-6 text-center cursor-pointer hover:bg-secondary-100 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 bg-secondary rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <p className="font-semibold text-foreground">Lihat Layanan</p>
              </motion.div>
            </Link>
            <Link href="/blog">
              <motion.div whileHover={{ y: -2 }} className="bg-accent-50 rounded-xl p-6 text-center cursor-pointer hover:bg-accent-100 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 bg-accent rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="font-semibold text-foreground">Blog & Tips</p>
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div whileHover={{ y: -2 }} className="bg-green-50 rounded-xl p-6 text-center cursor-pointer hover:bg-green-100 transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="font-semibold text-foreground">Hubungi Kami</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}