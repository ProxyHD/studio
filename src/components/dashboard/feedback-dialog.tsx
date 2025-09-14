'use client';

import { useState, useContext } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import type { Feedback } from '@/lib/types';

interface FeedbackDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: Omit<Feedback, 'submittedAt'>) => void;
}

export function FeedbackDialog({ isOpen, onOpenChange, onSubmit }: FeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const { locale } = useContext(AppContext);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: t('Error', locale),
        description: t('Please select a rating before submitting.', locale),
        variant: 'destructive',
      });
      return;
    }
    onSubmit({ rating, comment });
    toast({
      title: t('Thank you!', locale),
      description: t('Your feedback has been submitted successfully.', locale),
    });
    // Reset state for next time (though it won't be shown again for this user)
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Share Your Feedback', locale)}</DialogTitle>
          <DialogDescription>
            {t('We would love to hear what you think about LifeHub. How is your experience so far?', locale)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-center" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-8 w-8 cursor-pointer transition-colors',
                  (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                )}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            placeholder={t('Tell us more about your experience... (optional)', locale)}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {t('Maybe Later', locale)}
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {t('Submit Feedback', locale)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
