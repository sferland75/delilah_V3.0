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
} from "../../components/ui";
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

export default function GenerateReport() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // Simulate report generation
  useEffect(() => {
    if (!router.isReady) return;
    
    const { assessment, template, type } = router.query;
    
    // Start progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
    
    // Simulate completion after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsGenerating(false);
      
      // Set sample report data
      setReportData({
        title: 'Comprehensive In-Home Assessment Report',
        patient: 'John Doe',
        date: new Date().toISOString().split('T')[0],
        type: type,
        template: template,
        sections: [
          {
            id: 'executive_summary',
            title: 'Executive Summary',
            content: 'Mr. John Doe was assessed on February 15, 2025 to evaluate his current functional status and care needs following a motor vehicle accident on January 5, 2025. The assessment reveals moderate to severe limitations in mobility, self-care, and household activities. The client demonstrates significant physical symptoms including chronic pain, reduced range of motion, and difficulty with balance. Cognitive symptoms include memory difficulties and reduced concentration. Based on the assessment findings, recommendations include continued physical therapy, home modifications, and attendant care services totaling 16 hours per week.'
          },
          {
            id: 'background',
            title: 'Assessment Background',
            content: 'This assessment was conducted at the request of ABC Insurance Company to evaluate the client\'s functional status and care needs following a motor vehicle accident on January 5, 2025. The assessment was conducted at the client\'s home. Information was gathered through client interview, observation of functional activities, review of medical records, and standardized assessment tools.'
          },
          {
            id: 'medical_history',
            title: 'Medical History',
            content: 'Mr. Doe sustained multiple injuries in a motor vehicle accident on January 5, 2025, including a concussion, whiplash, and fractured right radius. Prior to the accident, the client reports being in good health with no significant medical conditions. Current medications include Acetaminophen 500mg PRN for pain, Cyclobenzaprine 10mg at bedtime for muscle spasms, and Sertraline 50mg daily.'
          },
          {
            id: 'symptoms',
            title: 'Current Symptoms',
            content: 'The client reports ongoing physical symptoms including neck and back pain rated 6/10, headaches, dizziness with position changes, reduced range of motion in the neck and right wrist, and fatigue. Cognitive symptoms include difficulty with short-term memory, reduced concentration, and word-finding difficulties. Emotional symptoms include irritability, anxiety regarding recovery, and mild depression.'
          },
          {
            id: 'functional',
            title: 'Functional Status',
            content: 'Mr. Doe demonstrates moderate limitations in mobility, requiring a cane for ambulation outside the home. He is able to ambulate independently within the home with occasional steadying on furniture. He can ascend/descend stairs with a handrail and rest breaks. He requires minimal assistance with bathing below the waist and moderate assistance with lower body dressing. He is independent with feeding, grooming, and upper body dressing. He requires moderate assistance with meal preparation, housekeeping, and laundry due to pain, fatigue, and limited use of his right arm.'
          },
          {
            id: 'daily_living',
            title: 'Daily Living Impact',
            content: 'Prior to the accident, Mr. Doe was fully independent in all activities of daily living and instrumental activities of daily living. He was employed full-time as an accountant and participated in recreational activities including golf and hiking. Currently, he is unable to work and requires assistance with household tasks. His typical day involves periods of rest between activities due to fatigue and pain. Environmental factors impacting function include stairs to access the home (5 steps with railing) and a second-floor bedroom with bathroom. The client has implemented several adaptive strategies but continues to have significant functional limitations.'
          },
          {
            id: 'care_needs',
            title: 'Care Needs Assessment',
            content: 'Based on the assessment findings, Mr. Doe requires attendant care services to assist with bathing, dressing, meal preparation, housekeeping, laundry, and community mobility. The recommended level of support is 16 hours per week, distributed as follows: personal care (7 hours/week), homemaking (6 hours/week), and community access (3 hours/week). The client currently receives informal support from his spouse, who works full-time and is experiencing caregiver strain.'
          },
          {
            id: 'recommendations',
            title: 'Recommendations',
            content: 'The following recommendations are made to address Mr. Doe\'s functional limitations and care needs:\n\n1. Continued physical therapy focusing on neck, back, and right wrist rehabilitation (2-3 sessions per week for 8 weeks)\n\n2. Occupational therapy for activities of daily living adaptations and energy conservation strategies (1-2 sessions per week for 6 weeks)\n\n3. Home modifications including installation of grab bars in the bathroom, a handheld shower, and a shower chair\n\n4. Attendant care services as outlined above (16 hours/week)\n\n5. Psychological support to address adjustment difficulties and mood symptoms\n\n6. Gradual return to work plan once physical status improves, with accommodations including reduced hours and ergonomic workstation setup\n\n7. Follow-up reassessment in 3 months to evaluate progress and adjust recommendations as needed'
          }
        ]
      });
      
      // Set sample suggestions
      setSuggestions([
        {
          id: 1,
          type: 'content',
          section: 'symptoms',
          content: 'Consider adding details about sleep disturbances, as this was mentioned in the assessment notes.',
          confidence: 0.85
        },
        {
          id: 2,
          type: 'content',
          section: 'care_needs',
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
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [router.isReady, router.query]);
  
  if (!router.isReady) {
    return <div>Loading...</div>;
  }
  
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
            onClick={() => router.push('/report-drafting')}
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
                            <option value="12" selected>12 pt</option>
                            <option value="14">14 pt</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs">Font</label>
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="arial">Arial</option>
                            <option value="times">Times New Roman</option>
                            <option value="calibri" selected>Calibri</option>
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
                Generated with Template: <span className="font-medium">{router.query.template}</span>
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
