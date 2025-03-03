# Edit Tracking System

The Edit Tracking System provides functionality for tracking changes to report content, managing versions, and viewing edit history. This system is designed to integrate with the Report Drafting module of Delilah V3.0.

## Features

- **Edit Tracking**: Track changes to report content with metadata (user, timestamp, comments)
- **Version Management**: Create and manage versions of reports
- **Change Visualization**: See differences between edits with inline highlighting
- **Persistence**: Store edit history both in API and local storage (with fallback)
- **UI Components**: Ready-to-use components for displaying and managing edits and versions

## Architecture

### Data Structure

The Edit Tracking System uses the following data structure:

- **EditRecord**: Represents a single edit to a section of a report
- **EditVersion**: Represents a version of a report
- **EditHistory**: Contains the complete edit history for a report

### Components

- **EditTrackingProvider**: Context provider for edit tracking functionality
- **TrackedContentEditor**: Editor component that automatically tracks changes
- **EditHistoryPanel**: Panel for displaying edit history and versions
- **VersionHistoryList**: Component for displaying version history
- **EditHistoryList**: Component for displaying edit history with diff visualization
- **CreateVersionDialog**: Dialog for creating new versions

## Integration

### Setup

1. Wrap your report editing component with the `EditTrackingProvider`:

```tsx
import { EditTrackingProvider } from '../contexts/edit-tracking';

const ReportDraftingPage = ({ reportId }) => {
  return (
    <EditTrackingProvider reportId={reportId}>
      {/* Your report editing components */}
    </EditTrackingProvider>
  );
};
```

2. Use the `TrackedContentEditor` for editable sections:

```tsx
import { TrackedContentEditor } from '../components/edit-tracking';

const ReportSection = () => {
  return (
    <TrackedContentEditor
      sectionId="executive-summary"
      initialContent="Initial content"
      label="Executive Summary"
      placeholder="Enter content here..."
    />
  );
};
```

3. Add version history display:

```tsx
import { EditHistoryPanel } from '../components/edit-tracking';

const VersionHistorySection = () => {
  return (
    <EditHistoryPanel title="Report Version History" />
  );
};
```

### Usage

#### Tracking Edits

Edits are automatically tracked when using the `TrackedContentEditor` component. You can also track edits manually using the `trackEdit` function from the context:

```tsx
import { useEditTracking } from '../contexts/edit-tracking';

const MyComponent = () => {
  const { trackEdit } = useEditTracking();

  const handleSave = async () => {
    await trackEdit(
      'section-id',
      'Previous content',
      'New content',
      'Optional comment'
    );
  };

  return (
    // ...
  );
};
```

#### Managing Versions

Create new versions using the `createVersion` function:

```tsx
import { useEditTracking } from '../contexts/edit-tracking';

const MyComponent = () => {
  const { createVersion } = useEditTracking();

  const handleCreateVersion = async () => {
    await createVersion('Version comment', true); // Second param is isPublished
  };

  return (
    // ...
  );
};
```

Revert to a previous version:

```tsx
import { useEditTracking } from '../contexts/edit-tracking';

const MyComponent = () => {
  const { revertToVersion } = useEditTracking();

  const handleRevert = async (versionNumber) => {
    await revertToVersion(versionNumber);
  };

  return (
    // ...
  );
};
```

#### View Edit History

Get edits for a specific section:

```tsx
import { useEditTracking } from '../contexts/edit-tracking';

const MyComponent = () => {
  const { viewEditsForSection } = useEditTracking();
  
  const sectionEdits = viewEditsForSection('section-id');
  
  return (
    <div>
      {sectionEdits.map(edit => (
        <div key={edit.id}>
          {/* Display edit information */}
        </div>
      ))}
    </div>
  );
};
```

## Persistence

The Edit Tracking System uses both API calls and local storage for persistence:

1. **API**: The system attempts to save edits and versions to the API first
2. **Local Storage**: If the API call fails, data is saved to local storage as a fallback
3. **Recovery**: When the app loads, it tries to get data from the API first, then falls back to local storage

## Error Handling

The system includes comprehensive error handling:

- Failed API calls are gracefully handled with fallback to local storage
- UI components display error states when operations fail
- Error messages are passed through the context for UI display

## Testing

The Edit Tracking System includes comprehensive tests:

- Unit tests for the context and service
- Component tests for UI components
- Integration tests for the full system

To run the tests:

```bash
npm test -- --testPathPattern=edit-tracking
```

## Best Practices

When using the Edit Tracking System, follow these best practices:

1. **Section IDs**: Use consistent, meaningful section IDs across the application
2. **Version Comments**: Encourage users to add descriptive comments when creating versions
3. **Periodic Versioning**: Create versions at meaningful points (e.g., after completing a section)
4. **UI Integration**: Provide clear UI affordances for viewing edit history and creating versions

## Future Enhancements

Planned enhancements for the Edit Tracking System:

1. **Collaborative Editing**: Real-time collaborative editing with conflict resolution
2. **Approval Workflow**: Multi-step approval process for versions
3. **Enhanced Diff Visualization**: More sophisticated diff visualization for complex content
4. **Export Version History**: Allow exporting version history as part of report documentation
5. **Automatic Version Creation**: Create versions automatically based on significant changes

## Contributing

When contributing to the Edit Tracking System:

1. Follow the established coding patterns and styles
2. Update tests when making changes
3. Update documentation to reflect changes
4. Consider backward compatibility
5. Follow the git workflow defined in CONTRIBUTING.md
