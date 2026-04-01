'use client';

import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface BlogListSectionProps {
  children: React.ReactNode;
}

export default function BlogListSection({ children }: BlogListSectionProps) {
  return (
    <section className="py-24 page-bg">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
