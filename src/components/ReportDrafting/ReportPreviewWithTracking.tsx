"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReportDraftingContext } from "@/contexts/ReportDrafting/ReportDraftingContext";
import { Card } from "@/components/ui/card";
import { AlertCircle, Check, XCircle, History } from "lucide-react";
import { EditTrackingProvider } from "@/contexts/edit-tracking";
import { TrackedContentEditor } from "@/components/edit-tracking";
import { EditHistoryPanel } from "@/components/edit-tracking";

export default function ReportPreviewWithTracking() {
  const { 
    reportConfig, 
    generatedReport, 
    isLoading, 
    error, 
    updateReportSection,
    goToNextStep,
    goToPreviousStep
  } = useReportDraftingContext();

  const [activeView, setActiveView] = useState<"preview" | "edit" | "data-mapping" | "history">("preview");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setActiveView("preview");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600 mr-2"></div>
        <span>Generating report...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium">Error generating report</h3>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={goToPreviousStep}
          >
            Back to Configuration
          </Button>
        </div>
      </div>
    );
  }

  if (!generatedReport || !reportConfig) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
        <h3 className="font-medium">No report generated</h3>
        <p className="text-sm mt-1">Please configure and generate a report first.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={goToPreviousStep}
        >
          Back to Configuration
        </Button>
      </div>
    );
  }

  const reportId = generatedReport.id;

  return (
    <EditTrackingProvider reportId={reportId}>
      <div>
        <h3 className="text-lg font-medium mb-4">Preview & Edit Report</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Review your generated report and make any necessary edits. All changes are tracked.
        </p>
        
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit" disabled={editingSectionId === null && activeView !== "edit"}>
              Editor
            </TabsTrigger>
            <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="history">Edit History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="border rounded-md p-6 bg-white min-h-[600px]">
            <div className="prose max-w-none">
              <h1>{generatedReport.title}</h1>
              <p className="text-gray-500">Generated on {new Date(generatedReport.createdAt).toLocaleDateString()}</p>
              
              {generatedReport.sections.map((section) => (
                <div key={section.id} className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="border-b pb-1">{section.title}</h2>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingSectionId(section.id);
                          setActiveView("edit");
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSectionId(section.id);
                          setActiveView("history");
                        }}
                      >
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                    </div>
                  </div>
                  <div className="whitespace-pre-line">{section.content}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="edit" className="border rounded-md p-6 bg-white min-h-[600px]">
            {editingSectionId && (
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Editing: {generatedReport.sections.find(s => s.id === editingSectionId)?.title}
                </h3>
                <TrackedContentEditor
                  sectionId={editingSectionId}
                  initialContent={generatedReport.sections.find(s => s.id === editingSectionId)?.content || ""}
                  label={generatedReport.sections.find(s => s.id === editingSectionId)?.title || ""}
                  placeholder="Enter content here..."
                  minHeight="400px"
                  onChange={(content) => {
                    // This would be called when content changes
                    // You can use this to update the local state if needed
                  }}
                />
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
                  >
                    Back to Preview
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="data-mapping" className="border rounded-md p-6 bg-white min-h-[600px]">
            <h3 className="text-lg font-medium mb-4">Data Source Mapping</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This view shows which assessment data is being used to generate each section of the report.
            </p>
            
            <div className="space-y-4">
              {generatedReport.sections.map((section) => (
                <Card key={section.id} className="p-4">
                  <h4 className="font-medium">{section.title}</h4>
                  <div className="mt-2 text-sm">
                    <div className="flex items-start mb-2">
                      <div className="w-1/3 font-medium">Data Sources:</div>
                      <div className="w-2/3">
                        {section.dataSources.map((source, idx) => (
                          <div key={idx} className="mb-1">{source}</div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-1/3 font-medium">Completion Status:</div>
                      <div className="w-2/3">
                        <span className={section.dataCompleteness.status === "complete" 
                          ? "text-green-600 flex items-center" 
                          : section.dataCompleteness.status === "partial" 
                            ? "text-amber-600 flex items-center" 
                            : "text-red-600 flex items-center"
                        }>
                          {section.dataCompleteness.status === "complete" ? 
                            <><Check className="h-4 w-4 mr-1" /> Complete ({section.dataCompleteness.percentage}%)</> : 
                            section.dataCompleteness.status === "partial" ? 
                            <><AlertCircle className="h-4 w-4 mr-1" /> Partial ({section.dataCompleteness.percentage}%)</> : 
                            <><XCircle className="h-4 w-4 mr-1" /> Incomplete ({section.dataCompleteness.percentage}%)</>
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="border rounded-md p-6 bg-white min-h-[600px]">
            <h3 className="text-lg font-medium mb-4">Edit History</h3>
            <p className="text-sm text-muted-foreground mb-6">
              View the version history and edit history for your report sections.
            </p>
            
            {editingSectionId ? (
              <div>
                <h4 className="font-medium mb-2">
                  {generatedReport.sections.find(s => s.id === editingSectionId)?.title} History
                </h4>
                <EditHistoryPanel 
                  sectionId={editingSectionId} 
                  title={`Edit History: ${generatedReport.sections.find(s => s.id === editingSectionId)?.title}`}
                />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setEditingSectionId(null)}>
                    View All Sections
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <EditHistoryPanel title="Report Version History" />
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Select a section to view its edit history:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedReport.sections.map((section) => (
                      <Button 
                        key={section.id} 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => setEditingSectionId(section.id)}
                      >
                        <History className="h-4 w-4 mr-2" />
                        {section.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={goToPreviousStep} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={goToNextStep} disabled={isLoading}>
            Next: Finalize Report
          </Button>
        </div>
      </div>
    </EditTrackingProvider>
  );
}
