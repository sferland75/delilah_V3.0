/**
 * Edit History Panel Component
 * 
 * Displays the edit history for a section or the entire report.
 * Allows users to view changes, revert to previous versions, and
 * create new versions.
 */

import React, { useState } from 'react';
import { useEditTracking } from '../../contexts/edit-tracking/edit-tracking-context';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { VersionHistoryList } from './version-history-list';
import { EditHistoryList } from './edit-history-list';
import { CreateVersionDialog } from './create-version-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface EditHistoryPanelProps {
  sectionId?: string; // If provided, shows edits only for this section
  title?: string;     // Optional custom title
}

/**
 * Panel for displaying edit history and versions
 */
export const EditHistoryPanel: React.FC<EditHistoryPanelProps> = ({
  sectionId,
  title = 'Edit History'
}) => {
  const { 
    isLoading, 
    error,
    currentVersion,
    createVersion,
    viewEditsForSection,
    viewVersions
  } = useEditTracking();
  
  const [isCreateVersionDialogOpen, setIsCreateVersionDialogOpen] = useState(false);
  const versions = viewVersions();
  const edits = sectionId ? viewEditsForSection(sectionId) : [];

  if (isLoading) {
    return <div className="py-4">Loading edit history...</div>;
  }

  if (error) {
    return (
      <div className="py-4 text-red-600">
        Error loading edit history: {error}
      </div>
    );
  }

  const handleCreateVersion = async (comment: string, publish: boolean) => {
    try {
      await createVersion(comment, publish);
      setIsCreateVersionDialogOpen(false);
    } catch (err) {
      console.error('Failed to create version:', err);
      // In a full implementation, we would display an error toast here
    }
  };

  return (
    <Card className="w-full border rounded-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-slate-800">{title}</CardTitle>
        <CardDescription>
          Current Version: {currentVersion}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setIsCreateVersionDialogOpen(true)}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Create New Version
          </Button>
        </div>

        <Tabs defaultValue="versions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-0 h-auto border-b">
            <TabsTrigger 
              value="versions" 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
            >
              Versions ({versions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="edits" 
              className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=inactive]:border-b data-[state=inactive]:border-gray-200 data-[state=inactive]:text-gray-600"
            >
              {sectionId ? `Section Edits (${edits.length})` : 'All Edits'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="versions" className="p-2 space-y-4">
            <VersionHistoryList versions={versions} />
          </TabsContent>
          <TabsContent value="edits" className="p-2 space-y-4">
            {sectionId ? (
              edits.length > 0 ? (
                <EditHistoryList edits={edits} />
              ) : (
                <div className="py-4 text-center text-gray-500">
                  No edits have been made to this section yet.
                </div>
              )
            ) : (
              <div className="py-4 text-center text-gray-500">
                Select a section to view its edit history.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CreateVersionDialog
        isOpen={isCreateVersionDialogOpen}
        onClose={() => setIsCreateVersionDialogOpen(false)}
        onCreateVersion={handleCreateVersion}
      />
    </Card>
  );
};
