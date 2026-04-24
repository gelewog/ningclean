'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
  item: {
    id: string;
    title: string;
    location: string;
    beforeImage: string;
    afterImage: string;
    description?: string;
  };
  index: number;
  large?: boolean;
}

export function BeforeAfterSlider({ item, index, large }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="page-card border rounded-2xl overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4 border-b page-border">
        <div className="flex-1">
          <h3 className="font-semibold page-text text-[15px]">{item.title}</h3>
          <p className="text-[12px] page-text-muted">{item.location}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
            Before
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            After
          </span>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={containerRef}
        className={`relative select-none ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'} cursor-col-resize group overflow-hidden`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before Image (full width, fixed) - NO FILTER */}
        <div className="absolute inset-0 z-0">
          <img
            src={item.beforeImage}
            alt="Before"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* After Image (uses clip-path to reveal right portion) */}
        <div className="absolute inset-0 z-10">
          <img
            src={item.afterImage}
            alt="After"
            className="w-full h-full object-cover"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-col-resize z-20"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-white shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-0.5">
              <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[11px] font-medium text-white/80">
          Before
        </div>
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-sm text-[11px] font-medium text-white">
          After
        </div>

        {/* Hover hint */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm text-[12px] text-white/70">
            Geser untuk bandingkan
          </div>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="p-4 border-t page-border">
          <p className="text-[13px] page-text-muted">{item.description}</p>
        </div>
      )}
    </motion.div>
  );
}
