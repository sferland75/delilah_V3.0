# Field Testing Implementation for Pages Router

This document describes how the field testing functionality has been implemented in Delilah V3.0, which uses the Next.js Pages Router architecture.

## Overview

The field testing feature provides:
- Data persistence through local storage
- Autosave functionality
- Offline operation capabilities
- Backup and restore functionality
- Synchronization of offline changes

## Implementation Components

### 1. Root-Level `_app.js`

The field testing functionality is initialized in the application's main entry point (`/pages/_app.js`). This approach ensures that field testing capabilities are available throughout the application, even if individual page components fail to load.

Key features:
- Field testing mode detection
- Dynamic panel component loading
- Global field testing API for browser console access
- Visual indicators for field testing mode

### 2. Field Testing Service

Located at `/src/services/field-test-service.ts`, this service provides the core functionality:

- Configuration management
- Autosave timers
- Backup creation and restoration
- Offline change tracking
- Synchronization logic

### 3. Field Testing Panel

The `/src/components/FieldTestPanel.tsx` component provides a user interface for:

- Configuring autosave and backup settings
- Creating manual backups
- Restoring from previous backups
- Checking connection status
- Initiating manual synchronization

### 4. Admin Page

A dedicated admin page at `/pages/admin/field-testing.tsx` provides a full-page interface for field testing administration.

## Usage

### Enabling Field Testing Mode

Field testing mode can be enabled in several ways:
1. Set the environment variable `NEXT_PUBLIC_FIELD_TRIAL=true`
2. Set the local storage item `field_test_mode=true`
3. Visit the admin page at `/admin/field-testing` and enable it there

### Global API

When field testing is enabled, the following methods are available in the browser console:

```javascript
// Toggle the field testing panel
window.fieldTesting.togglePanel()

// Get all backups for the current assessment
window.fieldTesting.getBackups()

// Create a manual backup
window.fieldTesting.createBackup()

// Restore from a specific backup
window.fieldTesting.restoreBackup('backup_key')

// Synchronize offline changes
window.fieldTesting.syncOfflineChanges()
```

### User Interface Elements

Field testing adds the following UI elements:
- A floating "FIELD TESTING MODE ACTIVE" indicator in the top-right corner
- A floating panel when the indicator is clicked
- A manual backup button in the bottom-right corner

## Adapting Components for Pages Router

When working with components for field testing, ensure they:
1. Do NOT use the `'use client'` directive (this is for App Router only)
2. Use relative imports for UI components (e.g., `'../components/ui/button'` not `'@/components/ui/button'`)
3. Handle server-side rendering issues with `typeof window !== 'undefined'` checks
4. Use `dynamic` imports with `{ ssr: false }` for components that rely on browser APIs

## Troubleshooting

If field testing functionality isn't working:

1. Check if field testing mode is enabled in local storage
2. Verify in the browser console that `window.fieldTesting` is defined
3. Check for JavaScript errors in the console
4. Ensure the application is using the Pages Router, not the App Router

## Development Guidelines

When adding new features to field testing:

1. Add functionality to the field-test-service.ts file first
2. Expose functionality through the window.fieldTesting API
3. Update the UI components to use the new functionality
4. Test in both online and offline scenarios

## Testing Field Testing Mode

To properly test field testing functionality:

1. Enable field testing mode
2. Toggle network connectivity in browser DevTools
3. Create assessments and verify backups are created
4. Test restoration from backups
5. Verify synchronization when coming back online