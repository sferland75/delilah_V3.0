import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getLastSessionState, clearLastSessionState } from '@/services/enhanced-storage-service';

// Avoid direct context usage to prevent circular dependencies
export function SessionRecoveryDialog() {
  const [open, setOpen] = useState(false);
  const [recoveryInfo, setRecoveryInfo] = useState<{
    assessmentId: string | null;
    route: string | null;
  } | null>(null);
  const router = useRouter();

  // Check for recovery when component mounts
  useEffect(() => {
    // Only show if not on dashboard/home
    if (
      router.pathname === '/' || 
      router.pathname === '/dashboard' || 
      router.pathname === '/login'
    ) {
      return;
    }
    
    // Wait a moment after page load to avoid interrupting initial render
    const timer = setTimeout(() => {
      const recovery = getLastSessionState();
      
      if (recovery.success && recovery.data) {
        setRecoveryInfo({
          assessmentId: recovery.data.assessmentId,
          route: recovery.data.route
        });
        setOpen(true);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router.pathname]);

  const handleRecover = () => {
    if (!recoveryInfo?.assessmentId) return;
    
    // Navigate to the previous route with the assessment ID
    if (recoveryInfo.route) {
      router.push(`${recoveryInfo.route}?assessment=${recoveryInfo.assessmentId}`);
    } else {
      router.push(`/full-assessment?assessment=${recoveryInfo.assessmentId}`);
    }
    
    setOpen(false);
  };

  const handleDismiss = () => {
    clearLastSessionState();
    setOpen(false);
  };

  if (!recoveryInfo?.assessmentId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recover Previous Session</DialogTitle>
          <DialogDescription>
            We detected that your previous session was interrupted. Would you like to recover your unsaved work?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-500">
            Your assessment was in progress when the browser closed unexpectedly. Continuing will restore your most recent work.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleDismiss}>
            Start New
          </Button>
          <Button onClick={handleRecover}>
            Recover Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
