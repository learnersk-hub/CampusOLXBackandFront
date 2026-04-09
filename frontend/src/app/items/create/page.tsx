'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { itemsApi, categoriesApi } from '@/services/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, X, Tag, Package, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const itemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Invalid price'),
  pickup_location: z.string().min(3, 'Pickup location must be at least 3 characters'),
  available_till: z.string().min(1, 'Please select a date'),
  category_id: z.string().min(1, 'Please select a category'),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function CreateItemPage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormValues) => {
      const item = await itemsApi.create({
        ...data,
        price: Number(data.price),
        category_id: Number(data.category_id),
        available_till: new Date(data.available_till).toISOString(),
      });

      // Upload all selected images to their respective slots
      const uploadPromises = selectedImages.map((file, index) => {
        if (file) {
          return itemsApi.uploadImage(item.id, file, index + 1);
        }
        return null;
      });

      await Promise.all(uploadPromises.filter(p => p !== null));
      return item;
    },
    onSuccess: () => {
      toast.success('Item listed successfully!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to list item');
    },
  });

  const handleImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = file;
      setSelectedImages(newSelectedImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages[index] = null;
    setSelectedImages(newSelectedImages);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
  };

  const onSubmit = (data: ItemFormValues) => {
    createItemMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <header className="mb-16 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50 mb-2"
          >
            <Sparkles className="h-3 w-3" />
            New Listing
          </motion.div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight">What are you <br/><span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Selling Today?</span></h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">Fill in the details below to reach thousands of students on campus.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <ImagePlus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Product Images
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div 
                      key={index}
                      className={`relative aspect-square rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden group ${
                        imagePreviews[index] ? 'border-transparent' : 'border-gray-100 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'
                      }`}
                    >
                      {imagePreviews[index] ? (
                        <>
                          <Image src={imagePreviews[index]!} alt={`Preview ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 150px" className="object-cover transition-transform group-hover:scale-110 duration-700" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-lg shadow-xl active:scale-90 transition-transform"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer space-y-2 p-4 text-center">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform">
                            <ImagePlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            {index === 0 ? 'Cover' : `Image ${index + 1}`}
                          </span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange(index)} />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
              <Package className="h-32 w-32 absolute -right-8 -bottom-8 opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700" />
              <div className="relative z-10 space-y-4">
                <h4 className="font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Pro Tip
                </h4>
                <p className="text-sm font-medium text-indigo-50 leading-relaxed">
                  Clear, well-lit photos increase your chances of selling by 300%. Add up to 4 images to show all angles!
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[3rem] overflow-hidden bg-white dark:bg-gray-900">
              <CardHeader className="p-10 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <Tag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Item Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. MacBook Pro 2021 M1 Max"
                    {...register('title')}
                    className={`h-16 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-lg ${errors.title ? 'border-rose-500 bg-rose-50/30' : ''}`}
                  />
                  {errors.title && <p className="text-xs font-bold text-rose-500 ml-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Category</Label>
                    <Select onValueChange={(val: string | null) => val && setValue('category_id', val)}>
                      <SelectTrigger className={`h-16 px-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold ${errors.category_id ? 'border-rose-500 bg-rose-50/30' : ''}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()} className="rounded-xl font-bold">
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category_id && <p className="text-xs font-bold text-rose-500 ml-1">{errors.category_id.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Price (₹)</Label>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400 group-focus-within:text-indigo-600 transition-colors">₹</span>
                      <Input
                        id="price"
                        placeholder="0.00"
                        className={`h-16 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-black text-xl ${errors.price ? 'border-rose-500 bg-rose-50/30' : ''}`}
                        {...register('price')}
                      />
                    </div>
                    {errors.price && <p className="text-xs font-bold text-rose-500 ml-1">{errors.price.message}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about the condition, age, and why you're selling..."
                    className={`min-h-[180px] p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium leading-relaxed ${errors.description ? 'border-rose-500 bg-rose-50/30' : ''}`}
                    {...register('description')}
                  />
                  {errors.description && <p className="text-xs font-bold text-rose-500 ml-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="pickup_location" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Pickup Location</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <Input
                        id="pickup_location"
                        placeholder="e.g. Student Center"
                        className={`h-16 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold ${errors.pickup_location ? 'border-rose-500 bg-rose-50/30' : ''}`}
                        {...register('pickup_location')}
                      />
                    </div>
                    {errors.pickup_location && <p className="text-xs font-bold text-rose-500 ml-1">{errors.pickup_location.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="available_till" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Available Until</Label>
                    <div className="relative group">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <Input
                        id="available_till"
                        type="date"
                        className={`h-16 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold ${errors.available_till ? 'border-rose-500 bg-rose-50/30' : ''}`}
                        {...register('available_till')}
                      />
                    </div>
                    {errors.available_till && <p className="text-xs font-bold text-rose-500 ml-1">{errors.available_till.message}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-10 pt-0 flex flex-col sm:flex-row gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs"
                  onClick={() => router.back()}
                >
                  Discard
                </Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-16 flex-1 text-lg font-black rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                  disabled={createItemMutation.isPending}
                >
                  {createItemMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </div>
                  ) : 'Publish Listing'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}
