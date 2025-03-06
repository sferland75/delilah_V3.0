"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAssessmentContext } from "@/contexts/AssessmentContext";
import { Save, Check, Clock, AlertTriangle } from "lucide-react";

export default function SaveAssessment() {
  const { data, currentAssessmentId, hasUnsavedChanges, saveCurrentAssessment } = useAssessmentContext();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Update last saved time when metadata changes
  useEffect(() => {
    if (data.metadata?.lastSaved) {
      setLastSaved(formatLastSaved(data.metadata.lastSaved));
    }
  }, [data.metadata?.lastSaved]);

  const handleSaveAssessment = async () => {
    if (!currentAssessmentId) {
      toast({
        title: "Cannot Save",
        description: "No assessment is currently active.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log("Attempting to save assessment");
      const success = saveCurrentAssessment();
      
      if (success) {
        console.log("Save successful");
        setLastSaved(formatLastSaved(new Date().toISOString()));
        toast({
          title: "Assessment Saved",
          description: "Your assessment has been saved successfully.",
          variant: "success"
        });
      } else {
        console.error("Save unsuccessful");
        throw new Error("Failed to save assessment");
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Error Saving Assessment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format the last saved timestamp for display
  const formatLastSaved = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
             ' on ' + 
             date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return "Unknown";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Save Assessment</CardTitle>
        <CardDescription>
          Save your assessment progress to continue later
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center">
          {hasUnsavedChanges ? (
            <div className="flex items-center text-amber-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          ) : (
            <div className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-2" />
              <span className="text-sm">All changes saved</span>
            </div>
          )}
        </div>
        {lastSaved && (
          <div className="mt-2 flex items-center text-slate-500 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last saved: {lastSaved}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveAssessment} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Assessment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
