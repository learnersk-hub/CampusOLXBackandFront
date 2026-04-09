'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { itemsApi, reservationsApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, User, Tag, ShieldCheck, ArrowLeft, MessageCircle, Calendar, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const itemId = Number(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['item', itemId],
    queryFn: () => itemsApi.get(itemId),
  });

  const images = item ? [
    item.image_url,
    item.image_url_2,
    item.image_url_3,
    item.image_url_4
  ].filter(Boolean) as string[] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const reserveMutation = useMutation({
    mutationFn: () => reservationsApi.create(itemId),
    onSuccess: () => {
      toast.success('Reservation request sent!');
      queryClient.invalidateQueries({ queryKey: ['item', itemId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to reserve item');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-100 rounded-3xl" />
            <div className="space-y-6">
              <div className="h-10 bg-gray-100 rounded-lg w-3/4" />
              <div className="h-6 bg-gray-100 rounded-lg w-1/4" />
              <div className="h-32 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    );
  }

  const isOwner = user?.id === item.seller_id;
  const isAvailable = item.status === 'available';

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 md:mb-12 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-7 space-y-6 md:space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group"
            >
              {images.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full"
                    >
                      <Image
                        src={images[currentImageIndex]}
                        alt={`${item.title} - Image ${currentImageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                        className="object-contain p-6 md:p-10"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <div className="absolute inset-y-0 left-2 md:left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          onClick={(e) => { e.stopPropagation(); prevImage(); }}
                          className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl"
                        >
                          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                      </div>
                      <div className="absolute inset-y-0 right-2 md:right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          onClick={(e) => { e.stopPropagation(); nextImage(); }}
                          className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl"
                        >
                          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                      </div>
                      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`h-1.5 md:h-2 rounded-full transition-all ${
                              i === currentImageIndex ? 'w-6 md:w-8 bg-indigo-600' : 'w-1.5 md:w-2 bg-gray-300 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-200 dark:text-gray-800">
                  <Tag className="h-24 w-24 md:h-32 md:w-32 opacity-10" />
                </div>
              )}
            </motion.div>

            <div className="hidden lg:grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative aspect-square rounded-3xl overflow-hidden border-4 transition-all ${
                    i === currentImageIndex ? 'border-indigo-600 scale-95 shadow-lg shadow-indigo-100' : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-none px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">
                      {item.category?.name || 'Item'}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <Clock className="h-3 w-3" />
                      <span>{mounted ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : 'Recent'}</span>
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-[1.1]">
                    {item.title}
                  </h1>
                </div>

                <div className="flex items-baseline gap-2 mb-6 md:mb-10">
                  <span className="text-4xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">₹{item.price}</span>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">INR</span>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="p-5 md:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup Location</p>
                      <p className="text-sm md:text-base font-bold text-gray-900 dark:text-gray-100">{item.pickup_location}</p>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Till</p>
                      <p className="text-sm md:text-base font-bold text-gray-900 dark:text-gray-100">{mounted ? format(new Date(item.available_till), 'MMM dd, yyyy') : '...'}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

                <div className="flex items-center gap-4 p-5 md:p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30">
                  <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-white dark:border-gray-800 shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seller?.name}`} />
                    <AvatarFallback className="bg-indigo-600 text-white font-black">{item.seller?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Listed by</p>
                    <p className="text-base md:text-lg font-black text-gray-900 dark:text-gray-100">{item.seller?.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 md:mt-12 sticky bottom-8">
              <div className="p-6 md:p-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => isAuthenticated ? reserveMutation.mutate() : router.push('/login')}
                  disabled={!isAvailable || isOwner || reserveMutation.isPending}
                  className="flex-1 h-14 md:h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                >
                  {reserveMutation.isPending ? 'Processing...' : isAvailable ? 'Reserve Now' : `Item is ${item.status}`}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 md:h-16 w-full sm:w-16 p-0 rounded-2xl border-gray-100 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 transition-all"
                  asChild
                >
                  <a href={`mailto:${item.seller.email}?subject=Inquiry about ${item.title}`}>
                    <MessageCircle className="h-6 w-6" />
                  </a>
                </Button>
              </div>
              {isOwner && (
                <p className="text-center mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">This is your listing</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
