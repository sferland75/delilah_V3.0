# Field Testing Implementation Guide

## Important Project Structure Notes

When implementing field testing features in Delilah V3.0, be aware of the following critical project structure details:

1. **Root Pages Directory**: The Next.js application uses a root-level `/pages` directory (not `/src/pages`) for page components
2. **Entry Point**: The main application entry point is `/pages/_app.js` (not `/src/pages/_app.tsx`)
3. **Utils Location**: Utility functions should be placed in `/src/utils/` and imported in the root-level components

## Effective Implementation Approaches

### Direct DOM Manipulation

For field testing functionality that must work regardless of application state:

```javascript
// In pages/_app.js
useEffect(() => {
  if (typeof window !== 'undefined') {
    // Create UI elements directly
    const element = document.createElement('div');
    element.id = "field-testing-ui";
    element.style.cssText = "position: fixed; top: 10px; right: 10px; z-index: 9999;";
    document.body.appendChild(element);
    
    // Add direct JavaScript functionality
    window.fieldTesting = {
      createBackup: function() {
        // Implementation that works independent of React state
      }
    };
  }
}, []);
```

Benefits:
- Works even when React rendering fails
- Bypasses component hierarchy issues
- Ensures testing tools are available in error states

### Local Storage for Data Persistence

```javascript
// Simple backup creation
function createBackup(id, data) {
  const timestamp = new Date().toISOString();
  const key = `delilah_backup_${id}_${timestamp}`;
  localStorage.setItem(key, JSON.stringify({
    id: key,
    assessmentId: id,
    timestamp,
    data
  }));
  return key;
}
```

## Testing Your Implementation

To verify your field testing features:

1. Inject visible UI elements (banners, buttons) that can be easily identified
2. Add console.log statements to confirm code execution
3. Create global window methods that can be called from browser console:
   ```javascript
   // In browser console
   window.fieldTesting.createBackup()
   window.fieldTesting.getBackups()
   ```

## Troubleshooting

If field testing features aren't appearing:

1. Verify you're modifying the correct files in `/pages` directory (not `/src/pages`)
2. Use direct DOM manipulation instead of React components when possible
3. Add visual indicators independent of the application's rendering system
4. Check browser console for any JavaScript errors that might prevent execution
