'use client';

import { Item } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Tag, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const statusColors = {
    available: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    reserved: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    sold: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link href={`/items/${item.id}`}>
        <Card className="h-full overflow-hidden border-none bg-white dark:bg-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:bg-gray-800/80 transition-all duration-500 rounded-[2rem] group flex flex-col">
          <div className="relative aspect-[1.1/1] overflow-hidden bg-gray-50 dark:bg-gray-800">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-700">
                <Tag className="h-16 w-16 opacity-20" />
              </div>
            )}
            
            <div className="absolute top-4 left-4">
              <Badge className={`${statusColors[item.status]} border-none font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md text-[10px] tracking-wider`}>
                {item.status.toUpperCase()}
              </Badge>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start gap-4 mb-3">
              <h3 className="font-black text-xl leading-tight text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                ${item.price}
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 font-medium leading-relaxed">
              {item.description}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500/50" />
                  <span>{item.pickup_location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

              <div className="flex items-center justify-between group/btn">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  View Details
                </span>
                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <PlusCircle className="h-4 w-4 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
