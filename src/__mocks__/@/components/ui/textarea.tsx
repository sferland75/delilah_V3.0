import React from 'react';

export const Textarea = React.forwardRef<HTMLTextAreaElement, any>(({ className, ...props }, ref) => (
  <textarea
    className={className}
    ref={ref}
    data-testid="textarea"
    {...props}
  />
));