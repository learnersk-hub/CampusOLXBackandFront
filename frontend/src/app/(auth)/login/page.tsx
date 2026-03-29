'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fafafa] dark:bg-black px-4 relative overflow-hidden">
      {/* Premium Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10 space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-200 dark:shadow-none mx-auto mb-6">
            <span className="text-white font-black text-2xl tracking-tighter text-center leading-none">C</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            Log in to your CampusOLX account
          </p>
        </div>

        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border-none rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 p-8 md:p-12">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  {...register('email')}
                  className={`h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium ${errors.email ? 'border-rose-500 bg-rose-50/30' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs font-bold text-rose-500 ml-1">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-gray-400">Password</Label>
                  <Link href="#" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Forgot?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium ${errors.password ? 'border-rose-500 bg-rose-50/30' : ''}`}
                />
                {errors.password && (
                  <p className="text-xs font-bold text-rose-500 ml-1">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-black rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center mt-10 text-gray-500 dark:text-gray-400 font-medium">
          New here?{' '}
          <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline font-black">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
