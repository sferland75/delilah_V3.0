import * as React from "react"
import { cn } from "@/lib/utils"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', {
    className: 'fixed top-0 right-0 z-50 p-4',
    role: 'alert',
    'aria-live': 'polite'
  }, children);
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastActionElement = React.ReactElement;

const Toast = ({
  className,
  variant = 'default',
  children,
  ...props
}: ToastProps) => {
  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
        {
          'bg-white text-slate-950 border-slate-200': variant === 'default',
          'bg-red-50 border-red-200 text-red-900': variant === 'destructive',
          'bg-green-50 border-green-200 text-green-900': variant === 'success',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const ToastTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <div
    className={cn("text-sm font-medium", className)}
    {...props}
  />
);

const ToastDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
);

export { ToastProvider, Toast, ToastTitle, ToastDescription };