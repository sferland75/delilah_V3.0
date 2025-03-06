"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAssessmentContext } from "@/contexts/AssessmentContext";
import { FileUp, FileDown, Plus, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSavedAssessments } from "@/services/assessment-storage-service";

interface SavedAssessment {
  id: string;
  name: string;
  date: string;
}

export default function LoadAssessment() {
  const { loadAssessmentById, createAssessment, hasUnsavedChanges, saveCurrentAssessment } = useAssessmentContext();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([]);

  // Load the list of saved assessments
  useEffect(() => {
    const fetchSavedAssessments = async () => {
      try {
        const assessments = getSavedAssessments();
        setSavedAssessments(assessments);
      } catch (error) {
        console.error("Error loading saved assessments:", error);
        toast({
          title: "Error Loading Saved Assessments",
          description: "Could not retrieve your saved assessments. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchSavedAssessments();
  }, [toast]);

  const handleLoadAssessment = async () => {
    if (!selectedAssessment) return;

    // Check for unsaved changes
    if (hasUnsavedChanges) {
      const confirmSave = window.confirm("You have unsaved changes. Would you like to save before loading a different assessment?");
      
      if (confirmSave) {
        saveCurrentAssessment();
      }
    }

    setIsLoading(true);
    try {
      const success = loadAssessmentById(selectedAssessment);
      
      if (!success) {
        throw new Error("Failed to load selected assessment");
      }
      
      toast({
        title: "Assessment Loaded",
        description: "Successfully loaded the selected assessment.",
        variant: "success"
      });
      
      // Redirect to the full assessment page
      router.push('/full-assessment');
    } catch (error) {
      console.error("Error loading assessment:", error);
      toast({
        title: "Error Loading Assessment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = async () => {
    // Check for unsaved changes
    if (hasUnsavedChanges) {
      const confirmSave = window.confirm("You have unsaved changes. Would you like to save before creating a new assessment?");
      
      if (confirmSave) {
        saveCurrentAssessment();
      }
    }

    setIsLoading(true);
    try {
      const newAssessmentId = createAssessment();
      
      toast({
        title: "New Assessment Created",
        description: "You can now start a fresh assessment.",
        variant: "success"
      });
      
      // Redirect to the full assessment page
      router.push('/full-assessment');
    } catch (error) {
      console.error("Error creating new assessment:", error);
      toast({
        title: "Error Creating Assessment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToPdfImport = () => {
    router.push('/import-pdf');
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Assessment Management</CardTitle>
        <CardDescription>
          Load a saved assessment or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Saved Assessment</label>
            <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a saved assessment" />
              </SelectTrigger>
              <SelectContent>
                {savedAssessments.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No saved assessments found
                  </SelectItem>
                ) : (
                  savedAssessments.map(assessment => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      <div className="flex flex-col">
                        <span>{assessment.name || "Unnamed Assessment"}</span>
                        <span className="text-xs text-slate-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(assessment.date)}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            onClick={handleNavigateToPdfImport}
            className="w-[48%]"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Import PDF
          </Button>
          <Button 
            onClick={handleLoadAssessment} 
            disabled={!selectedAssessment || isLoading}
            className="w-[48%]"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Load
              </>
            )}
          </Button>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleCreateNew}
          className="w-full"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Assessment
        </Button>
      </CardFooter>
    </Card>
  );
}
