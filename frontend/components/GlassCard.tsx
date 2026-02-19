import { motion, MotionProps } from 'framer-motion';
import { type FC, type ReactNode } from 'react';

interface GlassCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard: FC<GlassCardProps> = ({
  children,
  className = '',
  ...motionProps
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`relative p-6 rounded-[24px] bg-[#1a0b2e] border border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden ${className}`}
    {...motionProps}
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/10 blur-[60px] pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);
