'use client';

import { motion } from 'framer-motion';
import { User } from '@/types/api';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface DashboardHeaderSectionProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardHeaderSection({ user, onLogout }: DashboardHeaderSectionProps) {
  return (
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
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}