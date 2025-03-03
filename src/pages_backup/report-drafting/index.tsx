import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter,
  Button,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui";
import { 
  FileText, 
  FileOutput, 
  Settings, 
  Download, 
  FileUp, 
  Clipboard, 
  ClipboardCheck,
  LightbulbIcon,
  InfoIcon
} from 'lucide-react';

export default function ReportDrafting() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('new');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportType, setReportType] = useState('');
  
  // Sample assessments that could be used for reports
  const assessments = [
    { id: '1', patientName: 'John Doe', date: '2025-02-15', type: 'In-Home Assessment' },
    { id: '2', patientName: 'Jane Smith', date: '2025-02-10', type: 'Follow-up Assessment' },
    { id: '3', patientName: 'Robert Johnson', date: '2025-02-05', type: 'Initial Assessment' }
  ];
  
  // Sample templates
  const templates = [
    { id: 'standard', name: 'Standard Clinical', description: 'Comprehensive clinical report format' },
    { id: 'insurance', name: 'Insurance Assessment', description: 'Format tailored for insurance companies' },
    { id: 'medicolegal', name: 'Medicolegal', description: 'Format for legal contexts and proceedings' },
    { id: 'executive', name: 'Executive Summary', description: 'Condensed overview of findings' }
  ];
  
  // Sample recent reports
  const recentReports = [
    { 
      id: '1', 
      patientName: 'John Doe', 
      date: '2025-02-15', 
      type: 'Full Assessment',
      template: 'Standard Clinical' 
    },
    { 
      id: '2', 
      patientName: 'Jane Smith', 
      date: '2025-02-10', 
      type: 'Progress Report',
      template: 'Insurance Assessment' 
    }
  ];
  
  const handleGenerateReport = () => {
    if (!selectedAssessment || !selectedTemplate || !reportType) {
      alert('Please select all required fields');
      return;
    }
    
    // In a real implementation, this would navigate to the report generation page
    // with the selected parameters
    router.push({
      pathname: '/report-drafting/generate',
      query: { 
        assessment: selectedAssessment, 
        template: selectedTemplate,
        type: reportType 
      }
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Report Drafting</h1>
          <p className="text-muted-foreground">Generate and manage assessment reports</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => router.push('/assessment')}
            className="flex items-center"
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Assessments
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/templates')}
            className="flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Templates
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="new">New Report</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        {/* New Report Tab */}
        <TabsContent value="new" className="mt-6 space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertTitle>Create a New Report</AlertTitle>
            <AlertDescription>
              Generate a report based on completed assessment data. The system will use AI to create comprehensive content with intelligent suggestions.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>
                Select the assessment data and template for your report
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Assessment Source</label>
                <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessments.map(assessment => (
                      <SelectItem key={assessment.id} value={assessment.id}>
                        {assessment.patientName} - {assessment.type} ({assessment.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Assessment Report</SelectItem>
                    <SelectItem value="progress">Progress Report</SelectItem>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                    <SelectItem value="referral">Referral Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedTemplate && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/assessment')}>
                Back to Assessments
              </Button>
              <Button onClick={handleGenerateReport}>
                Generate Report
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <LightbulbIcon className="h-5 w-5 text-amber-500" />
                  <span>Intelligent Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Smart content generation based on assessment data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Automatic identification of key patterns across assessment sections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Context-aware recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Professional formatting and structure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <FileOutput className="h-5 w-5 text-blue-500" />
                  <span>Export Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>PDF export with professional formatting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Microsoft Word (DOCX) for easy editing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>HTML format for digital sharing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Customizable templates and branding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Drafts Tab */}
        <TabsContent value="drafts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Draft Reports</CardTitle>
              <CardDescription>
                Continue working on previously started reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No draft reports available</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('new')}>
                  Create New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Tab */}
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Reports generated in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Patient Name</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Report Type</th>
                      <th className="text-left py-3 px-4">Template</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id} className="border-b">
                        <td className="py-3 px-4">{report.patientName}</td>
                        <td className="py-3 px-4">{report.date}</td>
                        <td className="py-3 px-4">{report.type}</td>
                        <td className="py-3 px-4">{report.template}</td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/report-drafting/view/${report.id}`)}
                            className="mr-2"
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                View and manage report templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map(template => (
                  <Card key={template.id} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/templates/edit/${template.id}`)}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setActiveTab('new');
                        }}
                      >
                        Use
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => router.push('/templates/new')}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
