'use client';

import { useQuery } from '@tanstack/react-query';
import { itemsApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, ShoppingCart, AlertTriangle, ArrowUpRight, Ban, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const { data: allItems } = useQuery({
    queryKey: ['admin-items'],
    queryFn: () => itemsApi.list(),
  });

  if (authLoading || user?.role !== 'admin') {
    return null;
  }

  const stats = [
    { title: 'Total Items', value: allItems?.length || 0, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Users', value: '1,234', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Reports', value: '12', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'New Today', value: '48', icon: ArrowUpRight, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] shadow-xl shadow-indigo-200 dark:shadow-none">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Admin Console</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                <Users className="h-5 w-5 opacity-50" />
                Marketplace health and moderation center
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.title}
            >
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[2.5rem] overflow-hidden group bg-white dark:bg-gray-900 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{stat.title}</p>
                  <p className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[3rem] overflow-hidden bg-white dark:bg-gray-900">
            <CardHeader className="bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 px-10 py-8">
              <CardTitle className="text-xl font-black text-gray-900 dark:text-gray-100">Recent Listings</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-5">Product</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {allItems?.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 dark:text-gray-100 text-base">{item.title}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">${item.price}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <Badge variant="outline" className="capitalize font-black border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full px-3 py-1 text-[10px] tracking-widest">
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 transition-all">
                          <Ban className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[3rem] overflow-hidden bg-white dark:bg-gray-900 p-10">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-8">System Control</h3>
              <div className="space-y-4">
                <Button className="w-full h-16 rounded-[1.25rem] bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 font-black uppercase tracking-widest text-xs justify-start px-8 gap-4 transition-all active:scale-95">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Users className="h-4 w-4 text-indigo-400" />
                  </div>
                  User Directory
                </Button>
                <Button className="w-full h-16 rounded-[1.25rem] bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 font-black uppercase tracking-widest text-xs justify-start px-8 gap-4 transition-all active:scale-95">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  </div>
                  Report Queue
                </Button>
                <Button className="w-full h-16 rounded-[1.25rem] bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 font-black uppercase tracking-widest text-xs justify-start px-8 gap-4 transition-all active:scale-95">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                  System Logs
                </Button>
              </div>
            </Card>

            <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
              <ShieldCheck className="h-32 w-32 absolute -right-8 -bottom-8 opacity-10 rotate-12" />
              <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-3 relative z-10">Security Note</h4>
              <p className="text-sm font-medium text-indigo-50 leading-relaxed relative z-10">
                All admin actions are audited. Ensure you follow campus data protection guidelines when handling user reports.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
