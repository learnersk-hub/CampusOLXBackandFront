'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { itemsApi, reservationsApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, User, Tag, ShieldCheck, ArrowLeft, MessageCircle, Calendar, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const itemId = Number(id);

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['item', itemId],
    queryFn: () => itemsApi.get(itemId),
  });

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
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-12 hover:bg-white dark:hover:bg-gray-900 group rounded-2xl px-6 h-12 font-bold"
          >
            <ArrowLeft className="mr-3 h-5 w-5 transition-transform group-hover:-translate-x-1.5" />
            Back to explore
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square overflow-hidden rounded-[3.5rem] shadow-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            >
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                  className="object-contain p-10"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-200 dark:text-gray-800">
                  <Tag className="h-32 w-32 opacity-10" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-none shadow-sm rounded-[2.5rem] bg-white dark:bg-gray-900 p-10">
                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6">Product Details</h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-medium">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-28 space-y-8"
            >
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-xl shadow-indigo-500/5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <Badge className={`${
                    item.status === 'available' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  } border-none font-black px-4 py-2 rounded-full text-[10px] tracking-widest shadow-sm`}>
                    {item.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-4 leading-tight tracking-tight">
                  {item.title}
                </h1>
                
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">${item.price}</span>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">USD</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="flex flex-col gap-2 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100/50 dark:border-gray-800/50">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-[0.2em]">Location</span>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">{item.pickup_location}</span>
                  </div>
                  <div className="flex flex-col gap-2 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100/50 dark:border-gray-800/50">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-[0.2em]">Available Until</span>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">{format(new Date(item.available_till), 'MMM dd')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {isOwner ? (
                    <Button className="w-full h-16 text-lg font-black rounded-2xl bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 transition-all shadow-xl" asChild>
                      <Link href="/dashboard/listings">Manage My Listing</Link>
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className="w-full h-16 text-lg font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50" 
                        disabled={!isAvailable || reserveMutation.isPending}
                        onClick={() => isAuthenticated ? reserveMutation.mutate() : router.push('/login')}
                      >
                        {isAvailable ? 'Reserve This Item' : `Item is ${item.status}`}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full h-14 rounded-2xl gap-3 font-black uppercase tracking-widest text-xs border-2 border-gray-100 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                        asChild
                      >
                        <a href={`mailto:${item.seller.email}?subject=Inquiry about ${item.title}`}>
                          <MessageCircle className="h-5 w-5" />
                          Message Seller
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Avatar className="h-14 w-14 rounded-2xl border-2 border-indigo-50 dark:border-indigo-900/30">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seller.name}`} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-black text-xl">
                      {item.seller.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-gray-100 leading-none mb-1">{item.seller.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                      {item.seller.role === 'admin' ? 'Administrator' : 'Student Member'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <Link href={`/profile/${item.seller_id}`}>
                    <ArrowUpRight className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </Link>
                </Button>
              </div>

              <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none overflow-hidden relative group">
                <ShieldCheck className="h-32 w-32 absolute -right-8 -bottom-8 opacity-10 rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0 duration-700" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6" />
                    <h4 className="font-black text-sm uppercase tracking-[0.2em]">Safety Guarantee</h4>
                  </div>
                  <p className="text-sm font-medium text-indigo-50 leading-relaxed">
                    Meet in public campus areas and verify the item's condition before finalizing payment. Stay safe!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
