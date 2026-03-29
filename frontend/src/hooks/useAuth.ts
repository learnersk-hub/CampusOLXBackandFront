import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, login, logout, checkAuth, setUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: any) => login(email, password),
    onSuccess: () => {
      toast.success('Login successful!');
      router.push('/');
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Login failed');
    },
  });

  const signupMutation = useMutation({
    mutationFn: (userData: any) => authApi.signup(userData),
    onSuccess: () => {
      toast.success('Signup successful! Please login.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Signup failed');
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    logout,
    checkAuth,
  };
};
