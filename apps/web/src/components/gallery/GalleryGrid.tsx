'use client';

import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

interface GalleryGridProps {
  items: {
    id: string;
    title: string;
    location: string;
    category: string;
    image: string;
  }[];
  onItemClick?: (id: string) => void;
}

export function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => onItemClick?.(item.id)}
          className="group cursor-pointer page-card border rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Zoom icon */}
            <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-white" />
            </div>
            {/* Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[11px] text-white/80">
              {item.category}
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold page-text mb-1 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
            <p className="text-[12px] page-text-muted">{item.location}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
