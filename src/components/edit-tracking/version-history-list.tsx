/**
 * Version History List Component
 * 
 * Displays a list of versions with the ability to view details
 * and revert to previous versions.
 */

import React from 'react';
import { useEditTracking } from '../../contexts/edit-tracking/edit-tracking-context';
import { EditVersion } from '../../contexts/edit-tracking/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryListProps {
  versions: EditVersion[];
}

/**
 * Component for displaying a list of version history
 */
export const VersionHistoryList: React.FC<VersionHistoryListProps> = ({ versions }) => {
  const { currentVersion, revertToVersion } = useEditTracking();

  const handleRevert = async (versionNumber: number) => {
    if (versionNumber === currentVersion) return;
    
    if (window.confirm(`Are you sure you want to revert to version ${versionNumber}?`)) {
      try {
        await revertToVersion(versionNumber);
      } catch (err) {
        console.error('Failed to revert to version:', err);
        // In a full implementation, we would display an error toast here
      }
    }
  };

  if (versions.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No versions available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <div 
          key={version.id} 
          className={`p-4 border rounded-md ${version.versionNumber === currentVersion 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">
                Version {version.versionNumber}
              </h4>
              {version.isPublished && (
                <Badge className="bg-green-500">Published</Badge>
              )}
              {version.versionNumber === currentVersion && (
                <Badge className="bg-blue-500">Current</Badge>
              )}
            </div>
            <div>
              {version.versionNumber !== currentVersion && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRevert(version.versionNumber)}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Revert to this version
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-2">
            Created {formatDistanceToNow(new Date(version.createdAt))} ago by {version.createdByName}
          </div>
          
          {version.comment && (
            <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
              <span className="font-medium">Comment:</span> {version.comment}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
