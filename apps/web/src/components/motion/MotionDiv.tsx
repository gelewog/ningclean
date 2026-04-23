'use client';

import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionDivProps extends MotionProps {
  className?: string;
  children: React.ReactNode;
}

export default function MotionDiv({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}