import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAssessmentContext } from '@/contexts/AssessmentContext';
import { cn } from '@/lib/utils';

interface SaveStatusIndicatorProps {
  className?: string;
  showTimestamp?: boolean;
}

export function SaveStatusIndicator({ className, showTimestamp = true }: SaveStatusIndicatorProps) {
  // Use the standard context - we'll just show a simpler version with standard context
  const { hasUnsavedChanges } = useAssessmentContext();
  
  // In the standard context, we don't have detailed save status, so we'll show a simpler version
  const saveStatus = hasUnsavedChanges ? 'pending' : 'saved';
  const lastSaved = new Date(); // We don't have this in standard context, so we'll just use current time
  
  const formatTimeAgo = (date: Date): string => {
    return 'Just now'; // Simplified for standard context
  };
  
  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getStatusText = () => {
    switch (saveStatus) {
      case 'pending':
        return 'Unsaved changes';
      case 'saved':
        return 'All changes saved';
      default:
        return '';
    }
  };
  
  const getStatusTimestamp = () => {
    if (!showTimestamp) return null;
    
    return (
      <span className="text-xs text-gray-500 ml-1">
        {formatTimeAgo(lastSaved)}
      </span>
    );
  };
  
  return (
    <div className={cn("flex items-center text-sm", className)}>
      <span className="mr-1.5">{getStatusIcon()}</span>
      <span className={cn(
        "font-medium",
        saveStatus === 'pending' && "text-yellow-600",
        saveStatus === 'saved' && "text-green-600"
      )}>
        {getStatusText()}
      </span>
      {saveStatus === 'saved' && getStatusTimestamp()}
    </div>
  );
}
