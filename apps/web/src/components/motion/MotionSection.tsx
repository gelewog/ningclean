'use client';

import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionSectionProps extends MotionProps {
  className?: string;
  children: React.ReactNode;
}

export default function MotionSection({ className, children, ...props }: MotionSectionProps) {
  return (
    <motion.section className={cn(className)} {...props}>
      {children}
    </motion.section>
  );
}