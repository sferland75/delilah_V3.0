import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquareIcon } from 'lucide-react';
import { useEnhancedAssessment } from '@/contexts/EnhancedAssessmentContext';

interface FeedbackData {
  type: 'issue' | 'suggestion' | 'question';
  message: string;
  timestamp: string;
  url: string;
  userAgent: string;
  assessmentId?: string;
  section?: string;
  context?: any;
}

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'issue' | 'suggestion' | 'question'>('issue');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  
  const { currentAssessmentId, data } = useEnhancedAssessment();
  
  // Get current section from URL if possible
  const getCurrentSection = (): string => {
    // For simplicity, just extract from pathname
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/');
    const sectionPath = pathParts[pathParts.length - 1];
    
    // Map path to section name if needed
    const sectionMapping: Record<string, string> = {
      'demographics': 'Demographics',
      'medical-history': 'Medical History',
      'symptoms': 'Symptoms Assessment',
      'functional-status': 'Functional Status',
      'typical-day': 'Typical Day',
      'environmental': 'Environmental Assessment',
      'adl': 'Activities of Daily Living',
      'attendant-care': 'Attendant Care',
    };
    
    return sectionMapping[sectionPath] || sectionPath || 'Unknown';
  };
  
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitSuccess(null);
    
    try {
      // In a production environment, this would send to a server API endpoint
      // For field trials, we'll simulate by logging to console and storing locally
      
      const feedbackData: FeedbackData = {
        type: feedbackType,
        message,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        assessmentId: currentAssessmentId || undefined,
        section: getCurrentSection(),
        // Add context relevant to the feedback (just metadata here for safety/privacy)
        context: currentAssessmentId && data?.metadata ? {
          metadata: data.metadata
        } : undefined
      };
      
      console.log('Submitting feedback:', feedbackData);
      
      // Simulate API request
      // In production, replace with fetch to your API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store locally for field trials
      try {
        const existingFeedback = localStorage.getItem('delilah_feedback') || '[]';
        const feedbackArray = JSON.parse(existingFeedback);
        feedbackArray.push(feedbackData);
        localStorage.setItem('delilah_feedback', JSON.stringify(feedbackArray));
      } catch (storageError) {
        console.error('Error storing feedback:', storageError);
      }
      
      setSubmitSuccess(true);
      // Reset and close after brief delay to show success
      setTimeout(() => {
        setMessage('');
        setFeedbackType('issue');
        setOpen(false);
        setSubmitSuccess(null);
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 flex items-center space-x-1 z-50 shadow-md"
        onClick={() => setOpen(true)}
      >
        <MessageSquareIcon className="h-4 w-4 mr-1" />
        Feedback
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve the application. Let us know about any issues, suggestions, or questions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <RadioGroup 
              value={feedbackType} 
              onValueChange={(v) => setFeedbackType(v as 'issue' | 'suggestion' | 'question')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="issue" id="issue" />
                <Label htmlFor="issue">Report an Issue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggest an Improvement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="question" id="question" />
                <Label htmlFor="question">Ask a Question</Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!message || submitting}
              className={submitSuccess === true ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {submitting ? 'Sending...' : 
               submitSuccess === true ? 'Sent!' : 
               submitSuccess === false ? 'Try Again' : 
               'Send Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
