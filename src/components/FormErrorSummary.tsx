import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlattenedError {
  path: string;
  message: string;
}

interface FormErrorSummaryProps {
  className?: string;
  maxErrors?: number;
}

export function FormErrorSummary({ 
  className, 
  maxErrors = 5 
}: FormErrorSummaryProps) {
  const { formState: { errors } } = useFormContext();
  
  // Function to flatten nested errors for display
  const flattenErrors = (obj: Record<string, any>, prefix = ''): FlattenedError[] => {
    return Object.entries(obj).reduce<FlattenedError[]>((acc, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      
      // Format the path for display (convert camelCase to Title Case with spaces)
      const formatPath = (path: string): string => {
        const parts = path.split('.');
        const lastPart = parts[parts.length - 1];
        
        // Convert camelCase to Title Case with spaces
        const formatted = lastPart
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        return formatted;
      };
      
      if (value && typeof value === 'object' && !value.message) {
        return [...acc, ...flattenErrors(value, path)];
      }
      
      if (value && value.message) {
        return [...acc, { 
          path: formatPath(path), 
          message: value.message 
        }];
      }
      
      return acc;
    }, []);
  };
  
  const flatErrors = flattenErrors(errors);
  
  if (flatErrors.length === 0) return null;
  
  // Limit the number of errors displayed
  const displayErrors = flatErrors.slice(0, maxErrors);
  const hasMoreErrors = flatErrors.length > maxErrors;
  
  return (
    <Alert variant="destructive" className={cn("mb-6", className)}>
      <XCircle className="h-4 w-4" />
      <AlertTitle>Please correct the following issues:</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
          {displayErrors.map((error, index) => (
            <li key={index}>
              <span className="font-medium">{error.path}:</span> {error.message}
            </li>
          ))}
          {hasMoreErrors && (
            <li className="italic">
              ...and {flatErrors.length - maxErrors} more {flatErrors.length - maxErrors === 1 ? 'issue' : 'issues'}
            </li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
