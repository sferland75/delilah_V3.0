import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, FileText, Edit, Trash, PenTool, AlertTriangle } from 'lucide-react';
import MainNavigation from '@/components/navigation/main';
import { useAssessment } from '@/contexts/AssessmentContext';
import { getAllAssessments, deleteAssessment } from '@/services/assessment-storage-service';

export default function AssessmentListPage() {
  const router = useRouter();
  const { createAssessment, loadAssessmentById } = useAssessment();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  
  // Load all assessments on mount
  useEffect(() => {
    loadAssessments();
  }, []);
  
  const loadAssessments = () => {
    setIsLoading(true);
    try {
      // Force a fresh read from localStorage
      localStorage.getItem('delilah_assessments'); // This forces a browser sync
      
      const allAssessments = getAllAssessments();
      console.log("Loaded assessments:", allAssessments);
      
      setAssessments(allAssessments.sort((a, b) => 
        new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
      ));
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    try {
      const newId = createAssessment();
      router.push(`/full-assessment?id=${newId}`);
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert("Could not create a new assessment. Please try again.");
    }
  };
  
  const handleEdit = (id) => {
    loadAssessmentById(id);
    router.push(`/full-assessment?id=${id}`);
  };
  
  const handleDeleteClick = (id) => {
    setSelectedAssessmentId(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedAssessmentId) {
      deleteAssessment(selectedAssessmentId);
      setDeleteConfirmOpen(false);
      setSelectedAssessmentId(null);
      loadAssessments();
    }
  };
  
  const handleGenerateReport = (id) => {
    loadAssessmentById(id);
    router.push(`/report-drafting?id=${id}`);
  };
  
  // Helper function to get client name
  const getClientName = (assessment) => {
    // Use the clientName field if available
    if (assessment.clientName && assessment.clientName !== 'Untitled') {
      return assessment.clientName;
    }
    
    // Fallback to getting name from demographics if needed
    const demographics = assessment.data?.demographics;
    if (demographics?.personalInfo?.firstName || demographics?.personalInfo?.lastName) {
      const firstName = demographics?.personalInfo?.firstName || '';
      const lastName = demographics?.personalInfo?.lastName || '';
      return `${lastName}, ${firstName}`.trim();
    }
    
    return 'Untitled';
  };
  
  // Helper function to get assessment date
  const getAssessmentDate = (assessment) => {
    // Use the assessmentDate field if available
    if (assessment.assessmentDate) {
      return new Date(assessment.assessmentDate).toLocaleDateString();
    }
    
    // Fallback to created date
    return new Date(assessment.created).toLocaleDateString();
  };
  
  // Helper function to calculate completion status
  const getCompletionStatus = (data) => {
    // Key sections to check for a basic completion status
    const keySections = ['demographics', 'medicalHistory', 'symptomsAssessment', 'typicalDay'];
    let completeSections = 0;
    
    for (const section of keySections) {
      if (data[section] && Object.keys(data[section]).length > 0) {
        completeSections++;
      }
    }
    
    const percentage = Math.round((completeSections / keySections.length) * 100);
    
    return percentage >= 90 ? 'Complete' : `${percentage}% Complete`;
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 p-4 bg-white border-r">
        <MainNavigation />
      </div>
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Assessments</h1>
            <p className="text-gray-600">Manage all client assessments</p>
          </div>
          
          <Button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment List</CardTitle>
            <CardDescription>
              View and manage all client assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center p-8">
                <div className="h-8 w-8 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading assessments...</p>
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center p-12 bg-gray-50 rounded-md">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No assessments found</p>
                <Button 
                  onClick={handleCreateNew}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create your first assessment
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Assessment Date</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">
                          {getClientName(assessment)}
                        </TableCell>
                        <TableCell>
                          {getAssessmentDate(assessment)}
                        </TableCell>
                        <TableCell>
                          {new Date(assessment.lastSaved).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getCompletionStatus(assessment.data)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1"
                              onClick={() => handleEdit(assessment.id)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="sr-only md:not-sr-only md:inline-block">Edit</span>
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                              onClick={() => handleGenerateReport(assessment.id)}
                            >
                              <PenTool className="h-3.5 w-3.5" />
                              <span className="sr-only md:not-sr-only md:inline-block">Report</span>
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleDeleteClick(assessment.id)}
                            >
                              <Trash className="h-3.5 w-3.5" />
                              <span className="sr-only md:not-sr-only md:inline-block">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this assessment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}