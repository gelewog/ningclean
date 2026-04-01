'use client';

import { motion } from 'framer-motion';
import { Service } from '@/types/api';
import { ServiceCard } from '@/components/cards';

interface ServiceSelectionStepProps {
  services: Service[];
  selected: Service | null;
  onSelect: (service: Service) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function ServiceSelectionStep({ services, selected, onSelect }: ServiceSelectionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Pilih Layanan</h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6"
      >
        {services.map((service, index) => (
          <div
            key={service.id}
            onClick={() => onSelect(service)}
            className={`cursor-pointer transition-all rounded-2xl ${
              selected?.id === service.id
                ? 'ring-2 ring-primary'
                : ''
            }`}
          >
            <ServiceCard service={service} index={index} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
