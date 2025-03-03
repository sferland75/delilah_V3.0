# App Router Directory

## Note on Empty Directories

Some directories in this folder structure may be empty or contain only `.gitkeep` files. This is intentional to maintain the directory structure while resolving conflicts between the Pages Router and App Router.

The following files were removed to resolve conflicts with the Pages Router:

- `/src/app/import/assessment/page.tsx`
- `/src/app/testing/pdf-basic-test/page.tsx`
- `/src/app/testing/pdf-debug/page.tsx`

The files have been backed up to `/src/app_backup/` directory with `.bak` extensions. See `/src/app_backup/README.md` for more details.

## Future Development

When fully migrating to the App Router, you can restore these files from the backup directory and remove the corresponding Pages Router files. The directory structure has been preserved with `.gitkeep` files to make this future migration easier.

## Important Notes

- The project currently uses the Pages Router (`/src/pages`) as the primary routing system
- This App Router implementation was in progress but was causing conflicts
- Always restart the Next.js server after restoring any files to ensure changes take effect
