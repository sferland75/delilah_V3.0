# Next.js Troubleshooting Guide

This guide provides solutions for common Next.js issues encountered in the Delilah V3.0 project, particularly around client and server components.

## Client vs. Server Components in Next.js

Next.js 13+ introduces a clear distinction between Server Components (default) and Client Components.

### Server Components
- Cannot use React hooks (useState, useEffect, etc.)
- Cannot use browser-only APIs
- Cannot export metadata alongside "use client" directive
- Cannot access browser global objects like window or document

### Client Components
- Must include `"use client"` at the top of the file
- Can use all React hooks and browser APIs
- Cannot export metadata or layout-specific functions

## Common Errors and Solutions

### Error: useEffect only works in Client Components

**Error Message:**
```
Error: useEffect only works in Client Components. Add the "use client" directive at the top of the file to use it.
```

**Solution:**
1. Add `"use client"` at the very top of the file (before imports)
2. OR move the useEffect logic to a dedicated client component

**Example:**
```jsx
"use client";

import React, { useEffect } from 'react';

export default function MyComponent() {
  useEffect(() => {
    // Effect code
  }, []);
  
  return <div>My Component</div>;
}
```

### Error: You are attempting to export "metadata" from a component marked with "use client"

**Error Message:**
```
You are attempting to export "metadata" from a component marked with "use client", which is disallowed.
```

**Solution:**
1. Move metadata to a server component
2. Create a separate client component for client-only functionality

**Example Fix:**
```jsx
// layout.tsx (Server Component)
import { Metadata } from 'next';
import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: 'My App',
  description: 'App description'
};

export default function Layout({ children }) {
  return (
    <>
      <ClientComponent />
      {children}
    </>
  );
}

// ClientComponent.tsx (Client Component)
"use client";

import { useEffect } from 'react';

export default function ClientComponent() {
  useEffect(() => {
    // Effect code
  }, []);
  
  return null;
}
```

### Error: window is not defined

**Error Message:**
```
ReferenceError: window is not defined
```

**Solution:**
1. Use conditional logic to check if code is running in browser
2. Move browser-specific code to a useEffect hook
3. Ensure the component is a client component

**Example:**
```jsx
"use client";

import { useEffect } from 'react';

export default function Component() {
  useEffect(() => {
    // Now we're safely in the browser
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  
  return <div>My Component</div>;
}
```

### Error: document is not defined

**Solution:**
Similar to window, use the same approach with useEffect and conditional checks.

## Best Practices for Next.js Applications

1. **Default to Server Components**
   - Start with server components for better performance
   - Convert to client components only when needed

2. **Isolate Client Components**
   - Create small, focused client components
   - Keep parent components as server components when possible

3. **Clear Component Boundaries**
   - Clearly separate client and server logic
   - Use props to pass data from server to client components

4. **Handle Metadata Properly**
   - Keep metadata exports in server components
   - Use layout.js/page.js for metadata rather than client components

5. **Browser API Usage**
   - Always wrap browser APIs in useEffect
   - Add condition checks for SSR environments

## Helpful Patterns

### Client Component Wrapper
```jsx
// ClientWrapper.jsx
"use client";

import { useEffect } from 'react';

export default function ClientWrapper({ children, onMount }) {
  useEffect(() => {
    if (onMount) onMount();
  }, [onMount]);
  
  return <>{children}</>;
}
```

### Browser API Utility
```jsx
// useBrowser.js
"use client";

import { useState, useEffect } from 'react';

export function useBrowser(callback) {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    setIsReady(true);
    if (callback) callback();
  }, [callback]);
  
  return isReady;
}
```

## Quick Reference

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| React hooks | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Metadata export | ✅ | ❌ |
| Direct DB access | ✅ | ❌ |
| File marking | Default | `"use client"` |
| Rendered | Server-side | Client-side |
| Access to request | ✅ | ❌ |
| SEO optimization | ✅ | Limited |
