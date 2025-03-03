/**
 * Edit Tracking Tests
 * 
 * Test suite for the edit tracking system.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditTrackingProvider, useEditTracking } from './edit-tracking-context';
import { editTrackingService } from './edit-tracking-service';

// Mock the auth context
jest.mock('../auth/auth-context', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', name: 'Test User' }
  })
}));

// Mock the edit tracking service
jest.mock('./edit-tracking-service', () => {
  const mockEditHistory = {
    reportId: 'test-report',
    currentVersion: 1,
    versions: [
      {
        id: 'version-1',
        reportId: 'test-report',
        versionNumber: 1,
        createdAt: '2025-02-26T12:00:00Z',
        createdBy: 'system',
        createdByName: 'System',
        comment: 'Initial version',
        isPublished: false
      }
    ],
    edits: []
  };
  
  return {
    editTrackingService: {
      getEditHistory: jest.fn().mockResolvedValue(mockEditHistory),
      saveEdit: jest.fn().mockImplementation((edit) => Promise.resolve({
        ...edit,
        id: 'test-edit-id',
        timestamp: '2025-02-26T13:00:00Z'
      })),
      createVersion: jest.fn().mockImplementation((version) => Promise.resolve({
        ...version,
        id: 'test-version-id',
        createdAt: '2025-02-26T14:00:00Z'
      }))
    }
  };
});

// Test component that uses the edit tracking context
const TestComponent = () => {
  const { 
    history, 
    isLoading, 
    error, 
    currentVersion,
    trackEdit,
    createVersion,
    viewVersions 
  } = useEditTracking();

  const handleTrackEdit = async () => {
    await trackEdit(
      'test-section',
      'Previous content',
      'New content',
      'Test edit'
    );
  };

  const handleCreateVersion = async () => {
    await createVersion('Test version', false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!history) return <div>No history</div>;

  return (
    <div>
      <div data-testid="current-version">Version: {currentVersion}</div>
      <div data-testid="versions-count">Versions: {viewVersions().length}</div>
      <button onClick={handleTrackEdit} data-testid="track-edit-btn">
        Track Edit
      </button>
      <button onClick={handleCreateVersion} data-testid="create-version-btn">
        Create Version
      </button>
    </div>
  );
};

describe('Edit Tracking Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads edit history on mount', async () => {
    render(
      <EditTrackingProvider reportId="test-report">
        <TestComponent />
      </EditTrackingProvider>
    );

    // Initially should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // After loading, should show version info
    await waitFor(() => {
      expect(screen.getByTestId('current-version')).toHaveTextContent('Version: 1');
    });

    // Should have called getEditHistory
    expect(editTrackingService.getEditHistory).toHaveBeenCalledWith('test-report');
  });

  test('tracks an edit', async () => {
    render(
      <EditTrackingProvider reportId="test-report">
        <TestComponent />
      </EditTrackingProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('current-version')).toBeInTheDocument();
    });

    // Click the track edit button
    fireEvent.click(screen.getByTestId('track-edit-btn'));

    // Should have called saveEdit
    await waitFor(() => {
      expect(editTrackingService.saveEdit).toHaveBeenCalledWith({
        reportId: 'test-report',
        sectionId: 'test-section',
        userId: 'test-user-id',
        userName: 'Test User',
        previousContent: 'Previous content',
        newContent: 'New content',
        comment: 'Test edit'
      });
    });
  });

  test('creates a new version', async () => {
    render(
      <EditTrackingProvider reportId="test-report">
        <TestComponent />
      </EditTrackingProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('current-version')).toBeInTheDocument();
    });

    // Click the create version button
    fireEvent.click(screen.getByTestId('create-version-btn'));

    // Should have called createVersion
    await waitFor(() => {
      expect(editTrackingService.createVersion).toHaveBeenCalledWith({
        reportId: 'test-report',
        versionNumber: 2,
        createdBy: 'test-user-id',
        createdByName: 'Test User',
        comment: 'Test version',
        isPublished: false
      });
    });
  });
});

describe('Edit Tracking Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        clear: jest.fn(() => {
          store = {};
        })
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
  });

  // Add more tests for the service if needed
});
