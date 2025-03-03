/**
 * Create Version Dialog Component
 * 
 * Dialog for creating a new version with an optional comment.
 * Also allows publishing the version.
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';

interface CreateVersionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateVersion: (comment: string, publish: boolean) => void;
}

/**
 * Dialog for creating a new version
 */
export const CreateVersionDialog: React.FC<CreateVersionDialogProps> = ({
  isOpen,
  onClose,
  onCreateVersion
}) => {
  const [comment, setComment] = useState('');
  const [publish, setPublish] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await onCreateVersion(comment, publish);
      // Reset form after successful submission
      setComment('');
      setPublish(false);
    } catch (err) {
      console.error('Failed to create version:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">Create New Version</DialogTitle>
            <DialogDescription>
              Create a new version of this report. This will save the current state as a snapshot
              that you can revert to later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Version Comment (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe what changes you made in this version..."
                className="w-full min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publish"
                checked={publish}
                onCheckedChange={(checked) => setPublish(checked === true)}
              />
              <Label
                htmlFor="publish"
                className="text-sm font-normal cursor-pointer"
              >
                Publish this version (makes it available for distribution)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Version'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
