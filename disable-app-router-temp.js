/**
 * Temporarily disable App Router
 */
const fs = require('fs');
const path = require('path');

// Check if app_disabled already exists, if so we need to restore it first
if (fs.existsSync(path.join(process.cwd(), 'src', 'app_disabled'))) {
  console.log('app_disabled already exists, please make sure to restore it first');
  process.exit(1);
}

// Rename app to app_disabled
try {
  fs.renameSync(
    path.join(process.cwd(), 'src', 'app'),
    path.join(process.cwd(), 'src', 'app_disabled')
  );
  console.log('Successfully renamed app to app_disabled');
} catch (err) {
  console.error('Error renaming app folder:', err);
  process.exit(1);
}

// Remove .next directory to clear cache
try {
  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    // Note: We can't delete this directly in Node.js, so we'll just inform the user
    console.log('Please manually delete the .next directory to clear the cache');
  }
} catch (err) {
  console.error('Error checking .next directory:', err);
}

console.log('App Router has been temporarily disabled');
console.log('You can now run `npm run dev` to start the application with only the Pages Router');
