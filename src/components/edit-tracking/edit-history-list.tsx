/**
 * Edit History List Component
 * 
 * Displays a list of edits for a section with before/after content comparison.
 */

import React, { useState } from 'react';
import { EditRecord } from '../../contexts/edit-tracking/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { diffWords } from 'diff';

interface EditHistoryListProps {
  edits: EditRecord[];
}

// Component to display differences between two texts
const DiffView: React.FC<{ oldText: string; newText: string }> = ({ oldText, newText }) => {
  const differences = diffWords(oldText, newText);
  
  return (
    <div>
      {differences.map((part, index) => (
        <span
          key={index}
          className={
            part.added 
              ? 'bg-green-100 text-green-800' 
              : part.removed 
                ? 'bg-red-100 text-red-800 line-through' 
                : ''
          }
        >
          {part.value}
        </span>
      ))}
    </div>
  );
};

/**
 * Component for displaying a list of edits
 */
export const EditHistoryList: React.FC<EditHistoryListProps> = ({ edits }) => {
  const [expandedEditId, setExpandedEditId] = useState<string | null>(null);

  const toggleExpand = (editId: string) => {
    setExpandedEditId(expandedEditId === editId ? null : editId);
  };

  if (edits.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No edits available.
      </div>
    );
  }

  // Sort edits by timestamp (newest first)
  const sortedEdits = [...edits].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedEdits.map((edit) => (
        <div key={edit.id} className="border rounded-md overflow-hidden">
          <div className="p-4 bg-gray-50 flex justify-between items-center">
            <div>
              <div className="font-medium">{edit.userName}</div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(edit.timestamp))} ago
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(edit.id)}
            >
              {expandedEditId === edit.id ? 'Hide Changes' : 'View Changes'}
            </Button>
          </div>
          
          {expandedEditId === edit.id && (
            <div className="p-4 border-t">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="diff" className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="text-sm font-medium">Changes</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 bg-gray-50 rounded text-sm font-mono whitespace-pre-wrap">
                      <DiffView
                        oldText={edit.previousContent}
                        newText={edit.newContent}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="before" className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="text-sm font-medium">Before</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                      {edit.previousContent}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="after" className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="text-sm font-medium">After</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-2 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                      {edit.newContent}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {edit.comment && (
                <div className="mt-4 text-sm">
                  <div className="font-medium mb-1">Comment:</div>
                  <div className="p-2 bg-gray-50 rounded">{edit.comment}</div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
