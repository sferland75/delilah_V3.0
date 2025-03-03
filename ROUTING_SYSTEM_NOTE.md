# Routing System Note

## Current Status

This project currently uses Next.js **Pages Router** as its primary routing system. 

## Routing Conflict Resolution

On March 1, 2025, there were conflicting route definitions between the Pages Router (`/src/pages`) and the App Router (`/src/app`), which caused the application to fail to start. The following actions were taken:

### 1. Removed Conflicting Route Files
The following routes were in conflict and the App Router versions were removed:
- `/import/assessment`
- `/testing/pdf-basic-test`
- `/testing/pdf-debug`
- `/import-pdf`

### 2. Removed App Router Root Files
The following root App Router files were also removed:
- `/src/app/layout.tsx`
- `/src/app/globals.css`
- `/src/app/page.tsx`

### 3. Fixed Component Case Sensitivity
A lowercase version of the Navbar component was created to match the import in _app.js:
- Created `/src/components/navbar.js` as a JS version of `/src/components/Navbar.tsx`

### 4. Updated Link Component Syntax
Next.js has changed its Link component API. We updated both Navbar components to use the new syntax:
- Changed from `<Link href="/path"><a className="...">Text</a></Link>`
- To `<Link href="/path" className="...">Text</Link>`

All removed files were backed up to `/src/app_backup/`. The directory structure in the App Router was preserved with `.gitkeep` files to facilitate a future migration.

## If You Encounter Routing Errors

### Conflicting Routes Error
If you see errors like:
```
Conflicting app and page files were found, please remove the conflicting files to continue:
  "src\pages\import\assessment.tsx" - "src\app\import\assessment\page.tsx"
  ...
```
This means that files with the same route exist in both `/src/pages/` and `/src/app/` directories. You must choose one routing system and remove the conflicting files from the other.

### Server Components Error
If you see errors like:
```
ReactServerComponentsError:
You have a Server Component that imports next/router. Use next/navigation instead.
```
This indicates that you're mixing Pages Router and App Router components. The solution depends on which routing system you're using:
- For Pages Router: Use components that import from `next/router`
- For App Router: Use components that import from `next/navigation`

### Link Component Error
If you see errors like:
```
Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.
```
This indicates that you're using the old Link component syntax. In Next.js 13+, you should:
- Either add the `legacyBehavior` prop to Link: `<Link href="..." legacyBehavior><a>...</a></Link>`
- Or use the new syntax without an `<a>` tag child: `<Link href="..." className="...">...</Link>`

## Future Migration to App Router

Next.js recommends the App Router for new projects. If you want to migrate this project to the App Router in the future:

1. Restore the backed-up files from `/src/app_backup/` to their original locations in `/src/app/`
2. Update components to use `next/navigation` instead of `next/router`
3. Test the App Router implementation thoroughly
4. Once verified, remove the corresponding files from the `/src/pages/` directory
5. Update any imports or navigation logic that may depend on the Pages Router

See `/src/app_backup/README.md` for more detailed restoration instructions.

## Reference Documentation

- [Next.js Pages Router](https://nextjs.org/docs/pages/building-your-application/routing)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [Migrating from Pages to App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Link Component Docs](https://nextjs.org/docs/pages/api-reference/components/link)
