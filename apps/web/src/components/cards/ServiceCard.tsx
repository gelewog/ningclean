'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Service } from '@/types/api';
import { formatPrice, formatDuration } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  index?: number;
  variant?: 'default' | 'featured';
  isHovered?: boolean;
}

export default function ServiceCard({ service, index = 0, variant = 'default', isHovered = false }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Link href={`/booking?service=${service.id}`}>
        <div className="group relative page-card border rounded-2xl overflow-hidden h-full hover:border-emerald-500/20 transition-all duration-300">
          {/* Image */}
          <div className="relative h-44 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/[0.08]">
                  <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-full text-[11px] font-semibold text-white border border-white/[0.08]">
                {service.category}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-[11px] font-bold text-white">
                {formatPrice(service.price)}
              </span>
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-serif text-lg font-normal page-text mb-2 group-hover:text-emerald-400 transition-colors">
              {service.name}
            </h3>
            <p className="text-[13px] page-text-muted mb-4 line-clamp-2">
              {service.description}
            </p>

            {/* Features */}
            <ul className="space-y-1.5 mb-4">
              {service.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-center text-[12px] page-text-muted">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t page-border">
              <div className="flex items-center gap-1.5 page-text-muted text-[12px]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDuration(service.duration)}</span>
              </div>

              <span className="inline-flex items-center text-[12px] font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Booking
                <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
