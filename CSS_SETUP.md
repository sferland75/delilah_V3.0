# CSS Setup for Delilah V3.0

## Overview

This document explains the CSS setup for Delilah V3.0 after the migration from App Router to Pages Router.

## Current Setup

The project uses Tailwind CSS for styling with the following configuration:

1. **Global CSS**
   - Located at: `/src/styles/globals.css`
   - Imported in: `/src/pages/_app.js`
   - Contains Tailwind directives and CSS variables

2. **Tailwind Config**
   - Located at: `/tailwind.config.js`
   - Scans JS and TS files in multiple directories
   - Includes custom theme settings

3. **UI Components**
   - Located at: `/src/components/ui/`
   - Use Tailwind utility classes and the `cn()` utility for class merging
   - Based on shadcn/ui components

## Migration Notes

During the migration from App Router to Pages Router, we:

1. Moved the original `globals.css` from `/src/app/globals.css` to `/src/styles/globals.css`
2. Updated the import in `_app.js` to include the global styles
3. Expanded the Tailwind configuration to include all relevant source directories
4. Updated the Navbar component for compatibility with the Pages Router

## If Styles Are Not Working

If you're experiencing styling issues:

1. **Verify Global CSS Import**
   - Make sure `/src/pages/_app.js` imports the global styles: `import '../styles/globals.css'`

2. **Check Tailwind Configuration**
   - Ensure all directories with components are included in the `content` array in `tailwind.config.js`

3. **Rebuild Tailwind**
   - Run `npm run dev` to restart the application with fresh CSS

4. **Check Component Imports**
   - Make sure UI components are properly imported and used

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js CSS Support](https://nextjs.org/docs/pages/building-your-application/styling)
