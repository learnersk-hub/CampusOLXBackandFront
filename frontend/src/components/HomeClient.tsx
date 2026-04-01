'use client';

import { useQuery } from '@tanstack/react-query';
import { itemsApi, categoriesApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import EmptyState from '@/components/EmptyState';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ListFilter, RefreshCw, ShoppingCart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || undefined;
  const category_id = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;

  const { data: items, isLoading, isError, refetch } = useQuery({
    queryKey: ['items', q, category_id],
    queryFn: () => itemsApi.list({ q, category_id }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50"
            >
              <Sparkles className="h-3 w-3" />
              Campus Marketplace
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1]"
            >
              {q ? (
                <>Found <span className="text-indigo-600 dark:text-indigo-400">"{q}"</span></>
              ) : (
                <>Buy & Sell within <br/><span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Your Community.</span></>
              )}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed"
            >
              The most trusted way to trade items with your fellow students. Safe, fast, and local.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <Button variant="outline" className="h-12 px-6 gap-2 rounded-2xl font-bold border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
              <ListFilter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="ghost" size="icon" onClick={() => refetch()} className="h-12 w-12 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
              <RefreshCw className={`h-5 w-5 text-indigo-600 dark:text-indigo-400 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </motion.div>
        </header>

        <section className="mb-16 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3">
            <Button
              variant={!category_id ? 'default' : 'outline'}
              className={`rounded-2xl px-8 h-12 font-black tracking-wide text-xs uppercase transition-all shadow-sm ${
                !category_id ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
              }`}
              asChild
            >
              <a href="/">All Items</a>
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={category_id === cat.id ? 'default' : 'outline'}
                className={`rounded-2xl px-8 h-12 font-black tracking-wide text-xs uppercase transition-all shadow-sm ${
                  category_id === cat.id ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-600'
                }`}
                asChild
              >
                <a href={`/?category_id=${cat.id}`}>{cat.name}</a>
              </Button>
            ))}
          </div>
        </section>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[1.1/1] w-full rounded-[2.5rem] bg-gray-100 dark:bg-gray-800" />
                <div className="space-y-3 px-2">
                  <Skeleton className="h-7 w-3/4 rounded-xl bg-gray-100 dark:bg-gray-800" />
                  <Skeleton className="h-4 w-1/2 rounded-lg bg-gray-100 dark:bg-gray-800 opacity-50" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <EmptyState 
            icon={RefreshCw}
            title="Something went wrong"
            description="We're having trouble loading the items. Please try again in a few moments."
            actionLabel="Try Again"
            actionHref="/"
          />
        ) : items?.length === 0 ? (
          <EmptyState 
            icon={ShoppingCart}
            title={q ? `No results for "${q}"` : "Marketplace is empty"}
            description={q 
              ? "We couldn't find any items matching your search. Try different keywords or clear filters." 
              : "Looks like no one has listed anything yet. Be the first to start the trade!"}
            actionLabel={q ? "Clear All Filters" : "List an Item"}
            actionHref={q ? "/" : "/items/create"}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
          >
            {items?.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
