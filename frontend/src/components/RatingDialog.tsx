'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingsApi } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface RatingDialogProps {
  reservationId: number;
  sellerId: number;
  trigger?: React.ReactNode;
}

export default function RatingDialog({ reservationId, sellerId, trigger }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const ratingMutation = useMutation({
    mutationFn: () => ratingsApi.create({
      reservation_id: reservationId,
      rated_user_id: sellerId,
      score: rating,
      comment,
    }),
    onSuccess: () => {
      toast.success('Thank you for your rating!');
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to submit rating');
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm" className="rounded-2xl font-bold h-10 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">Rate Experience</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-[3rem] p-10 border-none shadow-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="space-y-4">
          <div className="mx-auto bg-indigo-50 dark:bg-indigo-900/30 p-5 rounded-[2rem] w-fit shadow-inner">
            <Star className="h-8 w-8 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
          </div>
          <DialogTitle className="text-3xl font-black text-center text-gray-900 dark:text-gray-100 tracking-tight">Share your thoughts</DialogTitle>
          <DialogDescription className="text-center font-medium text-gray-500 dark:text-gray-400 text-base leading-relaxed">
            How was your interaction with the seller? Your feedback builds trust in our campus community.
          </DialogDescription>
        </DialogHeader>
        <div className="py-8 space-y-10">
          <div className="flex flex-col items-center gap-5">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-75 hover:scale-110"
                >
                  <Star
                    className={`h-12 w-12 transition-all duration-300 ${
                      rating >= star 
                        ? 'fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400 filter drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]' 
                        : 'text-gray-200 dark:text-gray-800 fill-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                {rating === 0 ? 'Choose a rating' : rating === 5 ? 'Exceptional!' : rating === 1 ? 'Needs Work' : 'Great Experience'}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Optional Feedback</Label>
            <Textarea
              id="comment"
              placeholder="What made this experience great? Any tips for the seller?"
              className="min-h-[140px] p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium leading-relaxed"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            className="w-full h-16 rounded-[1.5rem] font-black text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50" 
            disabled={rating === 0 || ratingMutation.isPending}
            onClick={() => ratingMutation.mutate()}
          >
            {ratingMutation.isPending ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
