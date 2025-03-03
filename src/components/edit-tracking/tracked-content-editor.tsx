"use client";

/**
 * Tracked Content Editor Component
 * 
 * A rich text editor that automatically tracks changes to content
 * and integrates with the edit tracking system.
 */

import React, { useState, useEffect } from 'react';
import { useEditTracking } from '../../contexts/edit-tracking/edit-tracking-context';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { EditHistoryPanel } from './edit-history-panel';

interface TrackedContentEditorProps {
  sectionId: string;
  initialContent: string;
  label?: string;
  placeholder?: string;
  minHeight?: string;
  onChange?: (content: string) => void;
}

/**
 * Editor component that tracks changes to content
 */
export const TrackedContentEditor: React.FC<TrackedContentEditorProps> = ({
  sectionId,
  initialContent,
  label,
  placeholder = 'Enter content here...',
  minHeight = '200px',
  onChange
}) => {
  const { 
    trackEdit, 
    getCurrentVersionContent,
    viewEditsForSection
  } = useEditTracking();
  
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Check if there are edits for this section
  const hasEdits = viewEditsForSection(sectionId).length > 0;
  
  // Update content if version changes
  useEffect(() => {
    const versionContent = getCurrentVersionContent(sectionId);
    if (versionContent) {
      setContent(versionContent);
    }
  }, [getCurrentVersionContent, sectionId]);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (onChange) {
      onChange(newContent);
    }
  };

  // Start editing mode
  const handleStartEditing = () => {
    setIsEditing(true);
  };

  // Cancel editing and revert changes
  const handleCancelEditing = () => {
    // Revert to the original content
    const versionContent = getCurrentVersionContent(sectionId) || initialContent;
    setContent(versionContent);
    setEditComment('');
    setIsEditing(false);
  };

  // Save changes and track the edit
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      
      // Get the original content to compare changes
      const originalContent = getCurrentVersionContent(sectionId) || initialContent;
      
      // Only track if content has actually changed
      if (content !== originalContent) {
        await trackEdit(sectionId, originalContent, content, editComment);
      }
      
      setEditComment('');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save changes:', err);
      // In a full implementation, we would display an error toast here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {hasEdits && (
              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                Edited
              </Badge>
            )}
          </label>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>
        </div>
      )}
      
      {showHistory && (
        <EditHistoryPanel 
          sectionId={sectionId} 
          title={`Edit History: ${label || 'Content'}`}
        />
      )}
      
      <div className="relative border rounded-md">
        {isEditing ? (
          <div className="space-y-4 p-4">
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder={placeholder}
              className="w-full"
              style={{ minHeight }}
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Edit Comment (Optional)
              </label>
              <Input
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder="Describe your changes..."
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCancelEditing}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving || content === (getCurrentVersionContent(sectionId) || initialContent)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <div 
              className="p-4 rounded-md min-h-[100px] whitespace-pre-wrap"
              style={{ minHeight }}
            >
              {content || <span className="text-gray-400">{placeholder}</span>}
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartEditing}
                className="bg-white"
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
