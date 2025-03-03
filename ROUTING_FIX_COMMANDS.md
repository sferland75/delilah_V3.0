# Delilah V3.0 Routing Fix Commands

This document contains all commands and fixes we've applied to solve the routing issues in Delilah V3.0. Use this as a reference for future development sessions.

## Syntax Error Fixes

### Fix for setup-dev-bundler.js

Create a file `fix-by-lines.js` with this content:

```javascript
const fs = require('fs');
const path = require('path');

// File path
const fileToFix = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'dist',
  'server',
  'lib',
  'router-utils',
  'setup-dev-bundler.js'
);

console.log(`Reading file: ${fileToFix}`);
let content = fs.readFileSync(fileToFix, 'utf8');

// Create backup (if not already created)
const backupPath = `${fileToFix}.bak2`;
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log(`Backup created at: ${backupPath}`);
}

// Split the content into lines
const lines = content.split('\n');

// Search for the problematic lines by looking for specific patterns
let appPathLineIndex = -1;
let pagesPathLineIndex = -1;

// Find the lines by searching for partial patterns
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const appPath = _path.default.relative') && line.includes('appPageFilePaths.get(p')) {
    appPathLineIndex = i;
    console.log(`Found appPath at line ${i+1}: ${line}`);
  }
  if (line.includes('const pagesPath = _path.default.relative') && line.includes('pagesPageFilePaths.get(p')) {
    pagesPathLineIndex = i;
    console.log(`Found pagesPath at line ${i+1}: ${line}`);
  }
}

// Fix the lines if found
if (appPathLineIndex !== -1) {
  const oldAppLine = lines[appPathLineIndex];
  lines[appPathLineIndex] = 'const appPath = _path.default.relative(dir, typeof appPageFilePaths.get(p) === "string" ? appPageFilePaths.get(p) : "");';
  console.log(`Fixed appPath line ${appPathLineIndex+1}`);
  console.log(`Old: ${oldAppLine}`);
  console.log(`New: ${lines[appPathLineIndex]}`);
} else {
  console.log('WARNING: Could not find appPath line to fix');
}

if (pagesPathLineIndex !== -1) {
  const oldPagesLine = lines[pagesPathLineIndex];
  lines[pagesPathLineIndex] = 'const pagesPath = _path.default.relative(dir, typeof pagesPageFilePaths.get(p) === "string" ? pagesPageFilePaths.get(p) : "");';
  console.log(`Fixed pagesPath line ${pagesPathLineIndex+1}`);
  console.log(`Old: ${oldPagesLine}`);
  console.log(`New: ${lines[pagesPathLineIndex]}`);
} else {
  console.log('WARNING: Could not find pagesPath line to fix');
}

// Write the fixed content back to the file
fs.writeFileSync(fileToFix, lines.join('\n'), 'utf8');
console.log('File has been fixed successfully.');
```

Run with:
```
node fix-by-lines.js
```

## Routing Conflict Fixes

### Disable Catch-all Routes

Check for catch-all routes in these directories:
- `src/app/assessment/[[...path]]`
- `src/app/import/[[...path]]`
- `src/app/report-drafting/[[...path]]`
- `src/app/assessment-sections/[[...path]]`

For each directory, rename the page.tsx file:
```
ren "src\app\assessment\[[...path]]\page.tsx" "page.tsx.bak"
ren "src\app\import\[[...path]]\page.tsx" "page.tsx.bak"
ren "src\app\report-drafting\[[...path]]\page.tsx" "page.tsx.bak"
ren "src\app\assessment-sections\[[...path]]\page.tsx" "page.tsx.bak"
```

### Create Proper Redirects

Create these files:

1. `src/app/assessment/page.tsx`:
```tsx
import { redirect } from 'next/navigation';

/**
 * Prevent redirect loop by adding a query parameter
 * This will ensure the browser doesn't get stuck in a loop
 */
export default function RedirectToPages() {
  redirect('/assessment?source=app');
}
```

2. `src/app/import/page.tsx`:
```tsx
import { redirect } from 'next/navigation';

/**
 * Redirect to the correct Pages Router path
 */
export default function RedirectToPages() {
  redirect('/import-pdf');
}
```

3. `src/app/report-drafting/page.tsx`:
```tsx
import { redirect } from 'next/navigation';

/**
 * Redirect to the Pages Router path
 */
export default function RedirectToPages() {
  redirect('/report-drafting');
}
```

4. `src/app/assessment-sections/page.tsx`:
```tsx
import { redirect } from 'next/navigation';

/**
 * Redirect to the Pages Router path
 */
export default function RedirectToPages() {
  redirect('/assessment-sections');
}
```

### Fix Not Found Handler

Modify `src/app/not-found.tsx`:
```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// This provides a friendly error page for App Router routes that don't exist
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Instead of automatic redirect, we'll just load once and stay on this page
    console.log('Not found page loaded');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <div className="space-y-4">
          <Link href="/" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Create App Router Root Page

Modify `src/app/page.tsx`:
```tsx
'use client';

import Link from 'next/link';

// Instead of redirecting and causing a loop, let's render a simple page
// that lets users manually go to the Pages Router version
export default function AppRouterRoot() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Delilah V3.0</h1>
        <p className="mb-6 text-gray-600">
          You're currently viewing the App Router version of this application. 
          The main application uses the Pages Router.
        </p>
        <div className="space-y-4">
          <Link 
            href="/pages" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
          >
            Go to Main Application
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Modify Next.js Config

Update `next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configure webpack for PDF.js
  webpack: (config) => {
    // This addresses the "Can't resolve 'canvas'" error when using pdf.js in Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      path: false,
    };
    return config;
  },

  // Disable the experimental App Router
  experimental: {
    appDir: false
  },
  
  // Add explicit redirects to handle any potential loops
  async redirects() {
    return [
      // Redirect app router paths to their pages router equivalents
      {
        source: '/app/assessment',
        destination: '/assessment',
        permanent: false,
      },
      {
        source: '/app/import',
        destination: '/import-pdf',
        permanent: false,
      },
      {
        source: '/app/report-drafting',
        destination: '/report-drafting',
        permanent: false,
      },
      {
        source: '/app/assessment-sections',
        destination: '/assessment-sections',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
```

## Cache Clearing Commands

```bat
rd /s /q .next
```

## Using the Standalone PDF Import App

Create `run-standalone-pdf-import.bat`:
```bat
@echo off
echo Starting standalone PDF import application...
echo.
echo This application runs on port 3002 and provides the core PDF import functionality
echo without the routing conflicts present in the main application.
echo.

cd D:\delilah-pdf-import
npm run dev
```

Run with:
```
D:\delilah_V3.0\run-standalone-pdf-import.bat
```

## Complete App Router Disabling

For a complete fix in the next session, you will need administrative privileges to:

1. Move the App Router directory:
```
mv D:\delilah_V3.0\src\app D:\delilah_V3.0\src\app_disabled_temp
```

2. Clear the Next.js cache:
```
rd /s /q D:\delilah_V3.0\.next
```

3. Run the application:
```
cd D:\delilah_V3.0
npm run dev
```
