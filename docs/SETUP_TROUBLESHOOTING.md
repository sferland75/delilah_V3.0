# Setup Troubleshooting Guide - Delilah V3.0

## Initial Setup Verification

1. First, verify all required files exist:
```
delilah_V3.0/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       └── ui/
```

2. Verify dependencies in package.json:
```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.3",
    "@radix-ui/react-accordion": "^1.1.2",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4"
  }
}
```

## Common Errors and Solutions

### Module Not Found Errors

1. **@/components paths not resolving**
   - Verify tsconfig.json paths configuration:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```
   - Solution: Check path aliases in tsconfig.json

2. **Missing UI Components**
   - Error: "Cannot find module '@/components/ui/card'"
   - Solution: Verify ui components exist in src/components/ui/

3. **Tailwind Classes Not Working**
   - Verify tailwind.config.js includes all paths:
   ```js
   module.exports = {
     content: [
       './src/pages/**/*.{ts,tsx}',
       './src/components/**/*.{ts,tsx}',
       './src/app/**/*.{ts,tsx}',
     ],
   }
   ```
   - Check globals.css includes base Tailwind imports

### TypeScript Errors

1. **Type Errors in Components**
   - Error: "Property 'x' does not exist on type 'y'"
   - Solution: Check type definitions and imports

2. **Missing Type Definitions**
   - Error: "Could not find a declaration file for module 'x'"
   - Solution: Install missing @types packages

### Build Errors

1. **Failed to Compile**
   - Delete .next folder
   - Run npm install again
   - Clear npm cache: npm cache clean --force

2. **Missing Dependencies**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

### Runtime Errors

1. **White Screen / No Content**
   - Check browser console for errors
   - Verify root layout.tsx has proper structure
   - Check AssessmentProvider is properly wrapped

2. **Form Components Not Rendering**
   - Verify FormProvider is present
   - Check context providers are properly nested
   - Verify hook dependencies

## Setup Steps

1. Clean Install:
```bash
# Clean previous installation
rm -rf node_modules
rm package-lock.json

# Fresh install
npm install

# Verify installation
npm ls
```

2. Development Server:
```bash
# Start dev server
npm run dev

# If errors occur, try:
npm run dev -- --debug
```

3. Build Verification:
```bash
# Test production build
npm run build

# If successful, start production server
npm start
```

## File Verification Checklist

- [ ] package.json - All dependencies present
- [ ] tsconfig.json - Path aliases configured
- [ ] next.config.js - Basic configuration present
- [ ] tailwind.config.js - All paths included
- [ ] postcss.config.js - Tailwind plugin included
- [ ] src/app/layout.tsx - Providers properly nested
- [ ] src/app/globals.css - Tailwind imports present
- [ ] src/components/ui/ - All base components present

## Getting Help

If problems persist:
1. Check browser console for specific errors
2. Verify all path aliases in tsconfig.json
3. Confirm all required UI components exist
4. Check form configuration in each section

## Next Steps

After resolving setup issues:
1. Test each assessment section individually
2. Verify form validation works
3. Check state persistence between sections
4. Validate error boundaries are working