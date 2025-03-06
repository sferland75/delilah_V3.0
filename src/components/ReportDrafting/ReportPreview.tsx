import React, { useState, useEffect, useRef } from 'react';
import { useReportDraftingContext } from '@/contexts/ReportDrafting/ReportDraftingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader, Wand2, Check, X, Edit3, Save, ArrowLeft, ArrowRight, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ReportPreview = () => {
  const { 
    generatedReport, 
    isLoading, 
    error, 
    updateReportSection,
    goToNextStep,
    goToPreviousStep
  } = useReportDraftingContext();

  const [activeTab, setActiveTab] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  
  // AI assistance state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [highlightedText, setHighlightedText] = useState('');
  const [showAiDialog, setShowAiDialog] = useState(false);
  const editorRef = useRef(null);

  // Set the first section as active when report is loaded
  useEffect(() => {
    if (generatedReport && generatedReport.sections.length > 0 && !activeTab) {
      setActiveTab(generatedReport.sections[0].id);
    }
  }, [generatedReport, activeTab]);

  // Handle text selection for AI assistance
  useEffect(() => {
    const handleSelection = () => {
      if (editingSectionId && window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
          setHighlightedText(selection.toString());
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [editingSectionId]);

  // Function to get smart suggestions for the current section
  useEffect(() => {
    if (editingSectionId && editingContent) {
      // Simulated AI suggestions - in a real implementation, this would call an API
      const generateSuggestions = () => {
        // Example suggestions based on content length
        const suggestions = [];
        
        if (editingContent.length < 200) {
          suggestions.push({
            type: 'content',
            message: 'This section is quite short. Consider adding more details about client-specific observations.',
          });
        }
        
        if (!editingContent.includes('recommendation')) {
          suggestions.push({
            type: 'structure',
            message: 'Consider adding recommendations to this section based on your observations.',
          });
        }
        
        setAiSuggestions(suggestions);
      };
      
      // Generate suggestions with a delay to avoid constant re-calculation
      const timer = setTimeout(generateSuggestions, 1000);
      return () => clearTimeout(timer);
    }
  }, [editingSectionId, editingContent]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader className="h-6 w-6 animate-spin mr-2" />
        <span>Loading report preview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error Loading Report</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!generatedReport) {
    return (
      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <AlertTitle className="text-amber-800">No Report Generated</AlertTitle>
        <AlertDescription className="text-amber-700">
          Please go back to configure and generate a report.
        </AlertDescription>
      </Alert>
    );
  }

  const handleEditSection = (sectionId) => {
    const section = generatedReport.sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSectionId(sectionId);
      setEditingContent(section.content);
    }
  };

  const handleSaveSection = async () => {
    if (!editingSectionId || !generatedReport) return;
    
    setIsSavingSection(true);
    setSaveSuccess(null);
    
    try {
      const success = await updateReportSection(
        generatedReport.id, 
        editingSectionId, 
        editingContent
      );
      
      if (success) {
        setSaveSuccess(true);
        setEditingSectionId(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        setSaveSuccess(false);
      }
    } catch (error) {
      console.error("Error saving section:", error);
      setSaveSuccess(false);
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditingContent('');
  };

  // AI assistance functions
  const handleAiAssist = () => {
    setAiPrompt(highlightedText ? 
      `Improve this text: ${highlightedText}` : 
      'Please suggest improvements for this section:'
    );
    setShowAiDialog(true);
  };

  const generateAiResponse = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiIsGenerating(true);
    setAiResponse('');
    
    try {
      // Simulated AI response - in a real implementation, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example of AI-generated content
      let response;
      
      if (aiPrompt.includes('Improve this text')) {
        // Improve selected text
        response = `Here's an improved version of your text:\n\n"${highlightedText.replace(/\./g, '')}. This demonstrates a significant impact on the client's ability to participate in their usual daily activities, with implications for both their vocational and personal life."`;
      } else {
        // General improvement suggestions
        response = "Based on my analysis, this section could be improved by:\n\n1. Adding more specific client observations to support your conclusions\n2. Including at least one functional example to illustrate each limitation\n3. Connecting the symptoms more explicitly to the functional impacts\n4. Adding a brief summary paragraph at the end of the section";
      }
      
      setAiResponse(response);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAiResponse("Sorry, there was an error generating suggestions. Please try again.");
    } finally {
      setAiIsGenerating(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (!aiResponse) return;
    
    // If this was an improvement to highlighted text, replace that text
    if (highlightedText && aiPrompt.includes('Improve this text')) {
      const improvedText = aiResponse.match(/"([^"]*)"/)?.[1] || '';
      if (improvedText) {
        const newContent = editingContent.replace(highlightedText, improvedText);
        setEditingContent(newContent);
      }
    } else {
      // Otherwise append the suggestions to notes or implementation is up to the user
      setEditingContent(prev => `${prev}\n\n--- AI Suggestions ---\n${aiResponse}`);
    }
    
    setShowAiDialog(false);
    setAiResponse('');
    setAiPrompt('');
  };

  return (
    <div>
      {saveSuccess === true && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Saved Successfully</AlertTitle>
          <AlertDescription className="text-green-700">
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      
      {saveSuccess === false && (
        <Alert className="mb-4 bg-red-50 border-red-200" variant="destructive">
          <AlertTitle>Save Failed</AlertTitle>
          <AlertDescription>
            There was an error saving your changes. Please try again.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex mb-6">
        <div className="w-64 border rounded-md overflow-hidden bg-white mr-6">
          <div className="p-3 bg-gray-50 border-b font-medium">
            Sections
          </div>
          <ScrollArea className="h-[600px]">
            <div className="p-2">
              {generatedReport.sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeTab === section.id ? "default" : "ghost"}
                  className="w-full justify-start mb-1 text-left"
                  onClick={() => setActiveTab(section.id)}
                >
                  {section.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex-1">
          <Card className="mb-3">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {generatedReport.title || 'Assessment Report'}
                </h2>
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-500">
                    {new Date(generatedReport.createdAt).toLocaleDateString()}
                  </div>
                  
                  {activeTab && editingSectionId !== activeTab && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => handleEditSection(activeTab)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit Section
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value={activeTab} className="p-6 min-h-[500px]">
                  {activeTab && generatedReport.sections.map(section => {
                    if (section.id !== activeTab) return null;
                    
                    if (editingSectionId === section.id) {
                      return (
                        <div key={section.id} className="space-y-4">
                          <div className="relative">
                            {aiSuggestions.length > 0 && (
                              <div className="mb-4 bg-blue-50 p-4 rounded-md border border-blue-200">
                                <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                                  <Wand2 className="h-4 w-4 mr-1" />
                                  AI Suggestions
                                </h3>
                                <ul className="space-y-2">
                                  {aiSuggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start">
                                      <div className={
                                        suggestion.type === 'content' 
                                          ? 'bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium mr-2' 
                                          : 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium mr-2'
                                      }>
                                        {suggestion.type === 'content' ? 'Content' : 'Structure'}
                                      </div>
                                      <span className="text-sm text-gray-700">{suggestion.message}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div 
                              ref={editorRef} 
                              className="relative border rounded-md"
                            >
                              <Textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="min-h-[400px] p-4 font-serif text-base"
                              />
                              
                              <div className="absolute bottom-4 right-4 flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-white flex items-center gap-1"
                                  onClick={handleAiAssist}
                                  disabled={aiIsGenerating}
                                >
                                  <Wand2 className="h-3.5 w-3.5" />
                                  AI Assist
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={handleCancelEdit}
                              disabled={isSavingSection}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSaveSection}
                              disabled={isSavingSection}
                              className="flex items-center gap-2"
                            >
                              {isSavingSection ? (
                                <>
                                  <Loader className="h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    }
                    
                    // Display mode
                    return (
                      <div key={section.id} className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                        <div className="font-serif text-base whitespace-pre-wrap">
                          {section.content}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Configuration
        </Button>
        
        <Button
          onClick={goToNextStep}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Continue to Export
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* AI Assistant Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-500" />
              AI Writing Assistant
            </DialogTitle>
            <DialogDescription>
              Get AI help with improving your report content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <Label htmlFor="ai-prompt">What would you like help with?</Label>
              <Textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., 'Improve the clarity of this section' or 'Make this more professional'"
                className="mt-1"
              />
            </div>
            
            {!aiResponse && (
              <Button 
                onClick={generateAiResponse}
                disabled={aiIsGenerating || !aiPrompt.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                {aiIsGenerating ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            )}
            
            {aiResponse && (
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">AI Suggestions:</h3>
                  <div className="whitespace-pre-wrap text-gray-800">
                    {aiResponse}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Helpful
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <ThumbsDown className="h-3.5 w-3.5" />
                      Not Helpful
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setAiResponse('');
                      setAiIsGenerating(false);
                    }}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAiDialog(false)}>
              Cancel
            </Button>
            
            {aiResponse && (
              <Button onClick={handleApplyAiSuggestion}>
                Apply Suggestions
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportPreview;
