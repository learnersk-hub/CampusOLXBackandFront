'use client';

import { LucideIcon, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[2rem] mb-6">
        <Icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm font-medium leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild size="lg" className="rounded-2xl px-8 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </motion.div>
  );
}
