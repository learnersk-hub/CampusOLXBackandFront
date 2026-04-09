'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, PlusCircle, User, LogOut, LayoutDashboard, ShoppingBag, ShieldCheck, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search)}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-gray-950/50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image 
                src="/logo.png" 
                alt="CampusOLX Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Campus OLX
            </span>
          </Link>
          <form onSubmit={handleSearch} className="hidden lg:flex relative w-[300px] xl:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search items..."
              className="pl-10 h-10 bg-gray-100/50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              suppressHydrationWarning
            />
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden rounded-xl"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            suppressHydrationWarning
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />
          
          {mounted && isAuthenticated ? (
            <>
              <Link href="/items/create" className="hidden sm:flex">
                <Button variant="outline" className="h-10 gap-2 border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl font-bold transition-all hover:shadow-md">
                  <PlusCircle className="h-4 w-4" />
                  Post Listing
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group">
                    <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-indigo-500/20 transition-all">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 rounded-2xl border-none shadow-2xl dark:bg-gray-900" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                  <div className="p-1">
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 cursor-pointer">
                      <Link href="/profile" className="flex items-center w-full px-4 py-2">
                        <User className="mr-2.5 h-4 w-4 opacity-70" />
                        <span className="font-bold">Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 cursor-pointer">
                      <Link href="/dashboard" className="flex items-center w-full px-4 py-2">
                        <LayoutDashboard className="mr-2.5 h-4 w-4 opacity-70" />
                        <span className="font-bold">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 cursor-pointer">
                      <Link href="/dashboard?tab=listings" className="flex items-center w-full px-4 py-2">
                        <ShoppingBag className="mr-2.5 h-4 w-4 opacity-70" />
                        <span className="font-bold">My Listings</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:text-indigo-400 cursor-pointer">
                        <Link href="/admin" className="flex items-center w-full px-4 py-2 text-indigo-600 dark:text-indigo-400">
                          <ShieldCheck className="mr-2.5 h-4 w-4 opacity-70" />
                          <span className="font-bold">Admin Console</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild className="sm:hidden rounded-xl focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 cursor-pointer">
                      <Link href="/items/create" className="flex items-center w-full px-4 py-2">
                        <PlusCircle className="mr-2.5 h-4 w-4 opacity-70" />
                        <span className="font-bold">Post Listing</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                  <div className="p-1">
                    <DropdownMenuItem onClick={() => logout()} className="rounded-xl focus:bg-rose-50 dark:focus:bg-rose-900/20 focus:text-rose-600 dark:focus:text-rose-400 text-rose-600 dark:text-rose-400 cursor-pointer flex items-center px-2 py-2">
                      <LogOut className="mr-2.5 h-4 w-4 opacity-70" />
                      <span className="font-bold">Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : mounted ? (
            <div className="flex items-center gap-1 md:gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl font-bold px-3 md:px-5 text-sm" suppressHydrationWarning>Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-3 md:px-5 text-sm shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95" suppressHydrationWarning>
                  Join
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full p-4 bg-white dark:bg-gray-950 border-b shadow-xl animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              autoFocus
              placeholder="Search items..."
              className="pl-10 h-12 bg-gray-100/50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              suppressHydrationWarning
            />
          </form>
        </div>
      )}
    </nav>
  );
}
