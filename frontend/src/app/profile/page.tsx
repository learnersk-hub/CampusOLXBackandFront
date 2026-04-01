'use client';

import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Calendar, ShieldCheck, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex justify-center">
          <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Manage your account settings and preferences.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 p-8 text-center">
              <div className="relative mx-auto w-32 h-32 mb-6">
                <Avatar className="w-full h-full border-4 border-indigo-50 dark:border-indigo-900/30 shadow-xl">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-3xl font-black">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white dark:border-gray-900 shadow-lg">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-tight">{user.name}</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                {user.role === 'admin' ? 'Administrator' : 'Student Member'}
              </p>
              
              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-8" />
              
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-black uppercase tracking-widest text-[10px] gap-3"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[3rem] overflow-hidden bg-white dark:bg-gray-900 p-10">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                Account Details
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                    <div className="h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center font-bold text-gray-900 dark:text-gray-100">
                      {user.name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</Label>
                    <div className="h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center font-bold text-gray-900 dark:text-gray-100">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      {user.phone}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                  <div className="h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center font-bold text-gray-900 dark:text-gray-100">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    {user.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Member Since</Label>
                  <div className="h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center font-bold text-gray-900 dark:text-gray-100">
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    {format(new Date(user.created_at), 'MMMM dd, yyyy')}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[3rem] overflow-hidden bg-white dark:bg-gray-900 p-10">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                Security
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">
                Keep your account secure by using a strong password and not sharing your credentials.
              </p>
              <Button className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 transition-all">
                Change Password
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
