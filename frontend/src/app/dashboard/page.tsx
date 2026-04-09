'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi, reservationsApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ShoppingBag, Calendar, CheckCircle2, XCircle, Clock, Package, MessageSquare, Star, Trash2, PlusCircle, ShoppingCart, Phone, Mail, ExternalLink, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import RatingDialog from '@/components/RatingDialog';
import EmptyState from '@/components/EmptyState';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';


function DashboardContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'listings';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`/dashboard?${params.toString()}`);
  };

  const { data: myItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['my-items'],
    queryFn: () => itemsApi.list(),
    select: (data) => data.filter(item => item.seller_id === user?.id),
  });

  const { data: reservations, isLoading: resLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsApi.list(),
  });

  const updateReservationMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'accept' | 'reject' | 'cancel' | 'sold' }) => {
      if (action === 'accept') return reservationsApi.accept(id);
      if (action === 'reject') return reservationsApi.reject(id);
      if (action === 'sold') return reservationsApi.sold(id);
      return reservationsApi.cancel(id);
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['my-items'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => itemsApi.delete(id),
    onSuccess: () => {
      toast.success('Listing deleted');
      queryClient.invalidateQueries({ queryKey: ['my-items'] });
    },
  });

  const getStatusBadge = (status: string, itemStatus?: string) => {
    if (itemStatus === 'sold' && status === 'accepted') {
      return <Badge className="bg-emerald-600 text-white border-none font-bold px-2 py-0.5 tracking-wider">SOLD</Badge>;
    }
    const colors: any = {
      requested: 'bg-amber-100 text-amber-700',
      accepted: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-rose-100 text-rose-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return <Badge className={`${colors[status] || 'bg-gray-100'} border-none font-bold px-2 py-0.5`}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <header className="mb-10 md:mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 md:p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
              <LayoutDashboard className="h-5 w-5 md:h-6 md:w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Hello, <span className="text-indigo-600 dark:text-indigo-400">{user?.name.split(' ')[0]}!</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button asChild className="w-full sm:w-auto rounded-2xl h-11 md:h-12 px-5 md:px-6 font-black uppercase tracking-widest text-[10px] md:text-xs bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
              <Link href="/items/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Listing
              </Link>
            </Button>
          </div>
        </header>

        <Tabs value={currentTab} onValueChange={setTab} className="space-y-8 md:space-y-12">
          <TabsList className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-gray-100 dark:border-gray-800 w-full md:w-auto h-auto grid grid-cols-3 md:flex md:inline-flex">
            <TabsTrigger value="listings" className="rounded-2xl px-4 md:px-8 py-2.5 md:py-3 font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-lg shadow-indigo-100/50 transition-all">Listings</TabsTrigger>
            <TabsTrigger value="purchases" className="rounded-2xl px-4 md:px-8 py-2.5 md:py-3 font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-lg shadow-indigo-100/50 transition-all">Bought</TabsTrigger>
            <TabsTrigger value="reservations" className="rounded-2xl px-4 md:px-8 py-2.5 md:py-3 font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-lg shadow-indigo-100/50 transition-all">Sold</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-8 outline-none">
            {(() => {
              if (myItems?.length === 0) {
                return (
                  <EmptyState 
                    title="No active listings"
                    description="You haven't posted anything for sale yet. Turn your unused items into cash!"
                    actionLabel="Create First Listing"
                    actionHref="/items/create"
                  />
                );
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {myItems?.map((item) => (
                    <motion.div layout key={`listing-${item.id}`}>
                      <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 rounded-[2.5rem] group dark:bg-gray-900">
                        <div className="relative aspect-video">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                              <Package className="h-10 w-10 text-gray-200 dark:text-gray-700" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 font-black px-4 py-2 rounded-2xl shadow-sm text-sm">
                              ₹{item.price}
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {item.title}
                            </h3>
                            <Badge variant="outline" className="capitalize font-bold border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full px-3">
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm mb-6 font-medium">
                            {item.description}
                          </p>
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold border-gray-100 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all" asChild>
                              <Link href={`/items/${item.id}`}>View</Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="rounded-2xl h-12 w-12 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                              onClick={() => deleteItemMutation.mutate(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </TabsContent>

          <TabsContent value="purchases" className="space-y-8 outline-none">
            {(() => {
              const purchases = reservations?.filter(r => r.buyer_id === user?.id && r.status === 'accepted') || [];
              if (purchases.length === 0) {
                return (
                  <EmptyState 
                    icon={ShoppingCart}
                    title="No purchases yet"
                    description="Your accepted reservation requests will appear here as successful purchases."
                    actionLabel="Browse Marketplace"
                    actionHref="/"
                  />
                );
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {purchases.map((res) => (
                    <motion.div layout key={`purchase-${res.id}`}>
                      <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[2.5rem] dark:bg-gray-900">
                        <div className="relative aspect-video">
                          {res.item?.image_url ? (
                            <Image src={res.item.image_url} alt={res.item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                              <Package className="h-10 w-10 text-gray-200 dark:text-gray-700" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 line-clamp-1">{res.item?.title}</h3>
                            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-black text-[10px] tracking-widest px-3 py-1.5 rounded-full">PURCHASED</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-6 font-bold uppercase tracking-wider">
                            <Calendar className="h-4 w-4 text-indigo-500/50" />
                            <span>Bought on {mounted ? format(new Date(res.created_at), 'MMM dd, yyyy') : '...'}</span>
                          </div>

                          {res.seller_contact && (
                            <div className="mb-6 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Seller Contact</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 h-10 rounded-xl bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase" asChild>
                                  <a href={`tel:${res.seller_contact.phone}`}>
                                    <Phone className="h-3 w-3 mr-1.5" />
                                    Call
                                  </a>
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 h-10 rounded-xl bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase" asChild>
                                  <a href={`mailto:${res.seller_contact.email}?subject=Regarding reservation for ${res.item?.title}`}>
                                    <Mail className="h-3 w-3 mr-1.5" />
                                    Email
                                  </a>
                                </Button>
                              </div>
                            </div>
                          )}

                          <RatingDialog 
                            reservationId={res.id} 
                            sellerId={res.item?.seller_id || 0} 
                            trigger={
                              <Button className="w-full rounded-2xl font-bold h-12 bg-white dark:bg-gray-800 border-2 border-indigo-50 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                                Rate Seller
                              </Button>
                            }
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </TabsContent>

          <TabsContent value="reservations" className="space-y-8 outline-none">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                    <tr>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Item Details</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Your Role</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    <AnimatePresence mode="popLayout">
                      {reservations?.map((res) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={`reservation-${res.id}`} 
                          className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden flex-shrink-0 shadow-sm">
                                {res.item?.image_url && (
                                  <Image src={res.item.image_url} alt="Item" fill sizes="64px" className="object-cover transition-transform group-hover:scale-110" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-black text-gray-900 dark:text-gray-100 text-base line-clamp-1">{res.item?.title || `Item #${res.item_id}`}</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">₹{res.item?.price}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <Badge variant="secondary" className={`font-black text-[10px] tracking-widest px-3 py-1 rounded-full ${
                              res.buyer_id === user?.id ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                              {res.buyer_id === user?.id ? 'BUYING' : 'SELLING'}
                            </Badge>
                          </td>
                          <td className="px-8 py-6">
                            {getStatusBadge(res.status, res.item?.status)}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex flex-col items-end gap-3">
                              <div className="flex justify-end gap-3">
                                {res.status === 'requested' && res.item?.seller_id === user?.id && (
                                  <div className="flex gap-2">
                                    <Button 
                                      className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-none transition-all"
                                      onClick={() => updateReservationMutation.mutate({ id: res.id, action: 'accept' })}
                                    >
                                      Accept Request
                                    </Button>
                                    <Button 
                                      variant="ghost"
                                      className="h-10 px-4 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 text-xs font-black uppercase tracking-widest transition-all"
                                      onClick={() => updateReservationMutation.mutate({ id: res.id, action: 'reject' })}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}

                                {res.status === 'accepted' && res.item?.seller_id === user?.id && (
                                  <div className="flex gap-2">
                                    <Button 
                                      className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-none"
                                      onClick={() => updateReservationMutation.mutate({ id: res.id, action: 'sold' })}
                                    >
                                      Confirm Sale
                                    </Button>
                                    <Button 
                                      variant="ghost"
                                      className="h-10 px-4 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 text-xs font-black uppercase tracking-widest"
                                      onClick={() => updateReservationMutation.mutate({ id: res.id, action: 'cancel' })}
                                    >
                                      Cancel Deal
                                    </Button>
                                  </div>
                                )}

                                {res.status === 'requested' && res.buyer_id === user?.id && (
                                  <Button 
                                    variant="ghost"
                                    className="h-10 px-4 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-black uppercase tracking-widest"
                                    onClick={() => updateReservationMutation.mutate({ id: res.id, action: 'cancel' })}
                                  >
                                    Cancel Request
                                  </Button>
                                )}

                                {res.status === 'accepted' && res.buyer_id === user?.id && (
                                  <Button 
                                    variant="ghost"
                                    className="h-10 px-4 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-black uppercase tracking-widest"
                                    onClick={() => updateReservationMutation.mutate({ id: res.id, action: 'cancel' })}
                                  >
                                    Cancel Deal
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all" asChild>
                                  <Link href={`/items/${res.item_id}`}><ExternalLink className="h-5 w-5" /></Link>
                                </Button>
                              </div>

                              {res.status === 'accepted' && res.buyer_id === user?.id && res.seller_contact && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="flex flex-col gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50"
                                >
                                  <div className="flex items-center justify-end gap-2">
                                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Contact Seller:</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="h-8 rounded-lg bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase" asChild>
                                      <a href={`tel:${res.seller_contact.phone}`}>
                                        <Phone className="h-3 w-3 mr-1.5" />
                                        Call
                                      </a>
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-8 rounded-lg bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase" asChild>
                                      <a href={`mailto:${res.seller_contact.email}?subject=Regarding reservation for ${res.item?.title}`}>
                                        <Mail className="h-3 w-3 mr-1.5" />
                                        Email
                                      </a>
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {reservations?.length === 0 && (
                  <div className="py-24 flex flex-col items-center justify-center text-center">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-[2rem] mb-6">
                      <Clock className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-gray-100">No activity yet</h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-[280px] font-medium leading-relaxed">
                      Requests from buyers or your own purchase inquiries will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafafa] dark:bg-black">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
