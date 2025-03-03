"use client";

/**
 * Example Usage of Edit Tracking System
 * 
 * This file demonstrates how to integrate the edit tracking system
 * into the report drafting module.
 */

import React from 'react';
import { EditTrackingProvider } from '../../contexts/edit-tracking';
import { TrackedContentEditor } from './tracked-content-editor';
import { EditHistoryPanel } from './edit-history-panel';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

/**
 * Example component for using edit tracking in the Report Drafting module
 */
export const ReportEditingExample: React.FC<{ reportId: string }> = ({ reportId }) => {
  return (
    <EditTrackingProvider reportId={reportId}>
      <div className="space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-800">Report Editor</CardTitle>
            <CardDescription>
              Edit the report content with version tracking and edit history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Executive Summary Section */}
            <TrackedContentEditor
              sectionId="executive-summary"
              initialContent="This is the executive summary of the assessment report."
              label="Executive Summary"
              placeholder="Enter the executive summary here..."
              minHeight="150px"
            />
            
            {/* Recommendations Section */}
            <TrackedContentEditor
              sectionId="recommendations"
              initialContent="Based on the assessment, the following recommendations are provided."
              label="Recommendations"
              placeholder="Enter the recommendations here..."
              minHeight="200px"
            />
            
            {/* Analysis Section */}
            <TrackedContentEditor
              sectionId="analysis"
              initialContent="The analysis of the assessment data indicates..."
              label="Analysis"
              placeholder="Enter the analysis here..."
              minHeight="300px"
            />
            
            {/* Version History */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Version Management</h3>
              <EditHistoryPanel title="Report Version History" />
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline">
                Preview Report
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </EditTrackingProvider>
  );
};

/**
 * Usage in the report drafting module:
 * 
 * import { ReportEditingExample } from '../components/edit-tracking/example-usage';
 * 
 * const ReportDraftingPage = () => {
 *   const { reportId } = useParams();
 *   
 *   if (!reportId) {
 *     return <div>Report ID is required</div>;
 *   }
 *   
 *   return (
 *     <div className="container mx-auto py-8">
 *       <ReportEditingExample reportId={reportId} />
 *     </div>
 *   );
 * };
 */
