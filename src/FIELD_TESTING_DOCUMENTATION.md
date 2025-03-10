# Field Testing Documentation - Delilah v3.0

## Overview

This document outlines the field testing capabilities of Delilah v3.0, including data persistence mechanisms, offline functionality, and autosave features designed to ensure reliable data collection in field settings.

## Key Features

### 1. Data Persistence

Delilah v3.0 implements a robust data persistence strategy to prevent data loss:

- **Local Storage**: All assessment data is automatically stored in the browser's local storage
- **Redux-Persist**: Application state is persisted between sessions using redux-persist
- **Multiple Backup Points**: Data is saved at multiple points to provide redundancy

### 2. Autosave Functionality

Automatic saving of assessment data occurs at configurable intervals:

- **Configurable Intervals**: Default is 30 seconds, adjustable from 30 seconds to 10 minutes
- **Change Detection**: Autosave activates only when changes are detected
- **Background Saving**: Saves occur in the background without interrupting user workflow
- **Save Indicators**: Visual indicators show when data is being saved and saved successfully

### 3. Offline Mode

Delilah v3.0 is designed for field use where internet connectivity may be limited:

- **Full Offline Functionality**: All features work without internet connection
- **Automatic Detection**: System detects network status changes automatically
- **Offline Indicator**: Clear visual indication when working offline
- **Change Logging**: All changes made offline are logged for later synchronization

### 4. Backup System

Regular backups protect against data corruption or accidental changes:

- **Automatic Backups**: Configurable backup frequency (5 minutes to 1 hour)
- **Multiple Restore Points**: System maintains multiple backups per assessment
- **Point-in-Time Recovery**: Ability to restore from any backup point
- **Storage Management**: Automatic cleanup of old backups to manage storage usage

### 5. Synchronization

When internet connection is available:

- **Automatic Sync**: Option to automatically sync when connection is restored
- **Manual Sync**: Manual synchronization option
- **Conflict Resolution**: Smart conflict resolution for changes made offline
- **Background Processing**: Sync occurs in the background without blocking user interaction

## Field Testing Mode

The Field Testing Mode provides a specialized interface for field data collection:

1. **Access**: Navigate to "Field Test Settings" from the main dashboard
2. **Configuration**: Set up autosave intervals, backup frequency, and sync options
3. **Monitoring**: View system status, connection state, and backup history
4. **Recovery**: Access and restore from backups if needed

## Best Practices for Field Use

1. **Before Field Deployment**:
   - Configure autosave to 30-second intervals
   - Enable automatic backups (recommended 15-minute intervals)
   - Test offline functionality in a controlled environment
   - Clear browser cache and ensure adequate storage space

2. **During Field Use**:
   - Save manually at critical points in addition to autosave
   - Check the connection indicator regularly
   - Create manual backup points at the completion of major sections

3. **After Field Session**:
   - Ensure data is synchronized when returning to network coverage
   - Verify all assessments appear in the dashboard
   - Review any sync conflict notifications

## Implementation Details

The field testing functionality is implemented through several key components:

1. **field-test-service.ts**: Core service managing persistence, autosave, and backups
2. **FieldTestPanel.tsx**: User interface for configuring field testing options
3. **assessment-storage-service.ts**: Handles local storage operations
4. **redux-persist configuration**: Manages state persistence between sessions

## Technical Specifications

- **Storage Limit**: Up to 5GB local storage (browser dependent)
- **Backup Retention**: Up to 5 most recent backups per assessment
- **Offline Duration**: Unlimited (constrained only by local storage)
- **Supported Browsers**: Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+
- **Device Requirements**: 50MB free storage minimum, 2GB RAM recommended

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| Data not saving | Check storage permissions, clear browser cache |
| Sync failures | Verify network connection, try manual sync |
| Missing backups | Check backup settings, verify storage permissions |
| Performance issues | Reduce backup frequency, clear old assessments |
| Storage warnings | Delete unnecessary backups, export and archive old assessments |

## Future Enhancements

Planned improvements for future releases:

1. **Cloud Backup**: Additional backup to cloud storage
2. **Multi-device Sync**: Synchronize assessments across multiple devices
3. **Encryption**: End-to-end encryption of sensitive assessment data
4. **Collaborative Editing**: Allow multiple users to work on assessments
5. **Audit Trail**: Enhanced tracking of all changes with user attribution
