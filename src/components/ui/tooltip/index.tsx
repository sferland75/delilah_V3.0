"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// A simple tooltip implementation that doesn't rely on Radix UI
// This is a temporary solution until the @radix-ui/react-tooltip package is installed

interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return <>{children}</>;
};

const Tooltip: React.FC<TooltipProps> = ({ 
  children 
}) => {
  return <>{children}</>;
};

interface TooltipTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ className, asChild = false, ...props }, ref) => {
    if (asChild) {
      return <div className={className} {...props} />;
    }
    return (
      <button
        ref={ref}
        className={cn("rounded text-sm font-medium", className)}
        {...props}
      />
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, side = "top", ...props }, ref) => {
    // This simplified version doesn't actually show tooltips
    // It's just a placeholder until the Radix package is installed
    return (
      <div
        ref={ref}
        style={{ display: "none" }}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
          className
        )}
        {...props}
      />
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
