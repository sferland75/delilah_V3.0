'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeToast } from '@/store/slices/uiSlice';
import { useToast } from './use-toast';

/**
 * Component to display toast notifications from Redux
 * Must be placed within a ToastProvider
 */
export function ReduxToastProvider() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(state => state.ui.toasts || []);
  const { toast } = useToast();
  
  useEffect(() => {
    // Display new toasts and remove them from Redux after showing
    if (toasts && toasts.length > 0) {
      toasts.forEach(toastData => {
        // Use the shadcn/ui toast component
        toast({
          title: toastData.title,
          description: toastData.description,
          variant: toastData.type === 'error' ? 'destructive' : 
                  toastData.type === 'success' ? 'success' : 'default'
        });
        
        // Remove from Redux store after displaying
        dispatch(removeToast(toastData.id));
      });
    }
  }, [toasts, toast, dispatch]);

  return null; // This is a logic-only component
}
