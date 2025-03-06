import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  Progress,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui";
import { 
  FileText, 
  Save, 
  Download, 
  Edit,
  Check,
  X,
  AlignLeft,
  LightbulbIcon,
  LayoutList,
  PenTool,
  Settings,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useAssessmentContext } from '@/contexts/AssessmentContext';
import { mapAssessmentToReportData, createReportConfigFromAssessment } from '@/services/report-assessment-integration';
import { getAvailableTemplates, generateReport } from '@/lib/report-drafting/api-service';
import { ReportTemplate } from '@/lib/report-drafting/types';

export default function GenerateReport() {
  const router = useRouter();
  const { data, currentAssessmentId } = useAssessmentContext();
  
  const [activeTab, setActiveTab] = useState('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // Configuration options
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportStyle, setReportStyle] = useState('clinical');
  
  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const availableTemplates = await getAvailableTemplates();
        setTemplates(availableTemplates);
        
        // Set default template if available
        if (availableTemplates.length > 0) {
          setSelectedTemplate(availableTemplates[0].id);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };
    
    loadTemplates();
  }, []);
  
  // Set report title from assessment data
  useEffect(() => {
    if (data?.demographics?.personalInfo) {
      const { firstName, lastName } = data.demographics.personalInfo;
      if (firstName && lastName) {
        setReportTitle(`Assessment Report: ${firstName} ${lastName}`);
      }
    }
  }, [data]);
  
  // Function to generate report
  const handleGenerateReport = async () => {
    if (!selectedTemplate || !currentAssessmentId) {
      return;
    }
    
    setIsGenerating(true);
    let progressInterval;
    
    try {
      // Start progress simulation
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            return 95; // Cap at 95% until actual completion
          }
          return prev + 5;
        });
      }, 500);
      
      // Create report configuration
      const config = await createReportConfigFromAssessment(
        currentAssessmentId,
        selectedTemplate
      );
      
      // Override with user-selected options
      config.reportTitle = reportTitle;
      config.style = reportStyle;
      
      // Generate the report
      const generatedReport = await generateReport(config);
      
      if (!generatedReport) {
        throw new Error('Failed to generate report');
      }
      
      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);
      
      // Format report data for display
      setReportData({
        title: generatedReport.title,
        patient: generatedReport.clientName,
        date: new Date().toISOString().split('T')[0],
        template: selectedTemplate,
        sections: generatedReport.sections.map(section => ({
          id: section.id,
          title: section.title,
          content: section.content
        }))
      });
      
      // Set intelligent suggestions (using mock data for now)
      setSuggestions([
        {
          id: 1,
          type: 'content',
          section: 'symptoms-assessment',
          content: 'Consider adding details about sleep disturbances, as this was mentioned in the assessment notes.',
          confidence: 0.85
        },
        {
          id: 2,
          type: 'content',
          section: 'attendant-care',
          content: 'The assessment data indicates possible need for medication management assistance, which is not currently mentioned in this section.',
          confidence: 0.72
        },
        {
          id: 3,
          type: 'revision',
          section: 'recommendations',
          oldContent: 'Continued physical therapy focusing on neck, back, and right wrist rehabilitation (2-3 sessions per week for 8 weeks)',
          newContent: 'Continued physical therapy focusing on neck, back, and right wrist rehabilitation (2-3 sessions per week for 8-12 weeks, with reassessment at 8 weeks)',
          confidence: 0.68
        },
        {
          id: 4,
          type: 'structure',
          content: 'Consider adding a section on psychosocial factors that may influence recovery.',
          confidence: 0.78
        }
      ]);
      
      // Switch to report view
      setIsConfiguring(false);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating report:', error);
      clearInterval(progressInterval);
      setIsGenerating(false);
      
      // Show error alert
      alert('Error generating report: ' + error.message);
    }
  };
  
  // Function to handle template change
  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);
    
    // Update report style from template
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setReportStyle(template.defaultStyle);
    }
  };
  
  if (!router.isReady) {
    return <div>Loading...</div>;
  }
  
  // Show configuration screen
  if (isConfiguring && !isGenerating) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Generate Report</h1>
          <p className="text-muted-foreground mt-2">
            Configure your report options and generate a professional assessment report.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Select a template and configure your report settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Template</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && templates.find(t => t.id === selectedTemplate) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {templates.find(t => t.id === selectedTemplate).description}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter report title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Style</label>
              <Select value={reportStyle} onValueChange={setReportStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="simplified">Simplified</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {reportStyle === 'clinical' && 'Formal language suitable for professional documentation'}
                {reportStyle === 'conversational' && 'Natural, approachable language suitable for client communication'}
                {reportStyle === 'simplified' && 'Clear, concise language with minimal technical terminology'}
              </p>
            </div>
            
            {!currentAssessmentId && (
              <Alert variant="destructive">
                <AlertTitle>No Assessment Selected</AlertTitle>
                <AlertDescription>
                  You need to select or create an assessment before generating a report.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/report-drafting')}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleGenerateReport}
              disabled={!selectedTemplate || !currentAssessmentId}
            >
              Generate Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Show generation screen
  if (isGenerating) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Generating Report</h1>
          <p className="text-muted-foreground">
            Our AI system is analyzing assessment data and generating a comprehensive report...
          </p>
          
          <div className="w-full max-w-md mx-auto mt-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Analyzing data</span>
              <span>{progress}%</span>
            </div>
          </div>
          
          <div className="space-y-8 mt-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse">
                <LayoutList className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Structuring content...</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse">
                <PenTool className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-sm font-medium">Drafting narratives...</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse">
                <LightbulbIcon className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-sm font-medium">Generating insights...</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setIsGenerating(false);
              setIsConfiguring(true);
            }}
            className="mt-8"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
  
  if (!reportData) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Error Generating Report</AlertTitle>
          <AlertDescription>
            There was a problem generating the report. Please try again or contact support.
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/report-drafting')}
              >
                Back to Reports
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{reportData.title}</h1>
          <p className="text-muted-foreground">
            Patient: {reportData.patient} | Date: {reportData.date}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/report-drafting')}
          >
            Back
          </Button>
          
          <Button 
            variant={editMode ? "default" : "outline"} 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Save Edits' : 'Edit Report'}
          </Button>
          
          <Button 
            onClick={() => alert('Report would be downloaded as PDF')}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Report Preview</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">
                    <AlignLeft className="h-4 w-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="structure">
                    <LayoutList className="h-4 w-4 mr-2" />
                    Structure
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="content" className="p-0">
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {reportData.sections.map((section) => (
                      <div key={section.id} className="space-y-3" id={section.id}>
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                        <div className="prose max-w-none">
                          {editMode ? (
                            <textarea
                              className="w-full min-h-[200px] p-3 border rounded-md"
                              defaultValue={section.content}
                            />
                          ) : (
                            <div className="whitespace-pre-line">{section.content}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="structure" className="p-0">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Drag and drop sections to reorder or click to edit section titles.
                    </p>
                    
                    <div className="space-y-2">
                      {reportData.sections.map((section, index) => (
                        <div 
                          key={section.id} 
                          className="flex items-center p-3 bg-slate-50 border rounded-md cursor-move"
                        >
                          <span className="mr-2 text-slate-400">{index + 1}.</span>
                          <div className="flex-1">
                            {editMode ? (
                              <input
                                type="text"
                                className="w-full p-1 border rounded"
                                defaultValue={section.title}
                              />
                            ) : (
                              <span>{section.title}</span>
                            )}
                          </div>
                          {editMode && (
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {editMode && (
                      <Button variant="outline" size="sm" className="mt-2">
                        + Add Section
                      </Button>
                    )}
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="settings" className="p-0">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        defaultValue={reportData.title}
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Output Format</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="pdf">PDF</option>
                        <option value="docx">Microsoft Word (DOCX)</option>
                        <option value="html">HTML</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Formatting</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs">Font Size</label>
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="10">10 pt</option>
                            <option value="11">11 pt</option>
                            <option value="12">12 pt</option>
                            <option value="14">14 pt</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs">Font</label>
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="arial">Arial</option>
                            <option value="times">Times New Roman</option>
                            <option value="calibri">Calibri</option>
                            <option value="georgia">Georgia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="include-appendix"
                        className="mr-2"
                        defaultChecked
                      />
                      <label htmlFor="include-appendix" className="text-sm">
                        Include appendices with assessment data
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="include-cover"
                        className="mr-2"
                        defaultChecked
                      />
                      <label htmlFor="include-cover" className="text-sm">
                        Include professional cover page
                      </label>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="bg-slate-50 p-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Generated with Template: 
                <span className="font-medium">
                  {templates.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Preview</Button>
                <Button size="sm">Finalize Report</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LightbulbIcon className="h-5 w-5 text-amber-500 mr-2" />
                <span>Intelligent Suggestions</span>
              </CardTitle>
              <CardDescription>
                AI-generated suggestions to enhance your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id} 
                    className={`p-3 border rounded-md ${
                      suggestion.type === 'content' 
                        ? 'bg-blue-50 border-blue-200' 
                        : suggestion.type === 'revision'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-medium text-gray-500">
                        {suggestion.type === 'content' 
                          ? `Content Suggestion (${suggestion.section})` 
                          : suggestion.type === 'revision'
                          ? `Revision Suggestion (${suggestion.section})`
                          : 'Structure Suggestion'}
                      </div>
                      <div className="text-xs">
                        Confidence: {Math.round(suggestion.confidence * 100)}%
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      {suggestion.type === 'revision' ? (
                        <>
                          <div className="mb-2 line-through text-gray-500">
                            {suggestion.oldContent}
                          </div>
                          <div className="font-medium">
                            {suggestion.newContent}
                          </div>
                        </>
                      ) : (
                        <div>{suggestion.content}</div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-3 justify-end">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                        <X className="h-3 w-3 mr-1" />
                        Ignore
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 px-2 text-xs bg-white"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-slate-50 p-4">
              <Button variant="ghost" size="sm" className="text-xs flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                Add Comment
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => alert('Refreshing suggestions')}
              >
                Refresh Suggestions
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {reportData.sections.map((section) => (
                  <div key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block p-2 hover:bg-slate-50 rounded text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        setActiveTab('content');
                      }}
                    >
                      {section.title}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
