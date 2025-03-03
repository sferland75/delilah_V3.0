# App Router Backup Directory

## What is this?

This directory contains backups of files that were removed from the `/src/app` directory to resolve conflicts between the Pages Router and App Router in Next.js.

## Background

The project encountered errors due to having the same routes defined in both the `pages` directory (Pages Router) and the `app` directory (App Router). Next.js doesn't allow the same routes to be defined in both routing systems simultaneously.

## Files Backed Up

The following files were completely removed from the `/src/app` directory and backed up here:

1. Route Conflict Files:
   - `/src/app/import/assessment/page.tsx` → `/src/app_backup/import/assessment/page.tsx` and `/src/app_backup/import/assessment/page.tsx.bak`
   - `/src/app/testing/pdf-basic-test/page.tsx` → `/src/app_backup/testing/pdf-basic-test/page.tsx` and `/src/app_backup/testing/pdf-basic-test/page.tsx.bak`
   - `/src/app/testing/pdf-debug/page.tsx` → `/src/app_backup/testing/pdf-debug/page.tsx` and `/src/app_backup/testing/pdf-debug/page.tsx.bak`
   - `/src/app/import-pdf/page.tsx` → `/src/app_backup/import-pdf/page.tsx` and `/src/app_backup/import-pdf/page.tsx.bak`
   - `/src/app/import-pdf/test.html` → `/src/app_backup/import-pdf/test.html` and `/src/app_backup/import-pdf/test.html.bak`

2. App Root Files:
   - `/src/app/layout.tsx` → `/src/app_backup/app_root/layout.tsx` and `/src/app_backup/app_root/layout.tsx.bak`
   - `/src/app/globals.css` → `/src/app_backup/app_root/globals.css` and `/src/app_backup/app_root/globals.css.bak`
   - `/src/app/page.tsx` → `/src/app_backup/app_root/page.tsx` and `/src/app_backup/app_root/page.tsx.bak`

Each file exists in two versions:
- The original file with the original extension
- A second backup with the `.bak` extension (added after our first fix attempt)

## Restoration Instructions

To restore these files in the future:

1. Copy the files from this backup directory to their original locations in `/src/app/`
2. Remove the corresponding files from the `/src/pages/` directory
3. Update any imports that use `next/router` to use `next/navigation` instead
4. Restart the Next.js development server

## Important Notes

- The project currently uses the Pages Router (`/src/pages`) as the primary routing system
- The App Router files were either incomplete or experimental
- Backups were created on March 1, 2025
- The directory structure in `/src/app/` is maintained with `.gitkeep` files
