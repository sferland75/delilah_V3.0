import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedExportOptions } from "@/services/export";
import { GeneratedReport } from "@/lib/report-drafting/types";
import { TabsContent } from "@/components/ui/tabs";
import { Mail } from "lucide-react";

interface EmailTabContentProps {
  generatedReport: GeneratedReport;
  emailRecipients: string;
  setEmailRecipients: (recipients: string) => void;
  advancedOptions: AdvancedExportOptions;
  handleAdvancedOptionChange: (key: keyof AdvancedExportOptions, value: any) => void;
  handleEmailShare: () => void;
  isExporting: boolean;
  goToPreviousStep: () => void;
}

export default function EmailTabContent({
  generatedReport,
  emailRecipients,
  setEmailRecipients,
  advancedOptions,
  handleAdvancedOptionChange,
  handleEmailShare,
  isExporting,
  goToPreviousStep
}: EmailTabContentProps) {
  return (
    <TabsContent value="email" className="p-6">
      <div className="mb-6">
        <Label htmlFor="emailRecipients" className="text-base font-medium block mb-2">
          Email Recipients
        </Label>
        <Input
          id="emailRecipients" 
          value={emailRecipients} 
          onChange={(e) => setEmailRecipients(e.target.value)} 
          className="max-w-md"
          placeholder="Enter email addresses separated by commas"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Add multiple recipients by separating email addresses with commas.
        </p>
      </div>
      
      <div className="mb-6">
        <Label className="text-base font-medium block mb-2">
          Attachment Format
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroup 
              value={advancedOptions.emailAttachFormat} 
              onValueChange={(value) => handleAdvancedOptionChange('emailAttachFormat', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="attach-pdf" />
                <Label htmlFor="attach-pdf">PDF Document</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="docx" id="attach-docx" />
                <Label htmlFor="attach-docx">Word Document</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="both" id="attach-both" />
                <Label htmlFor="attach-both">Both Formats</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="email-advanced-options">
          <AccordionTrigger className="text-sm font-medium">
            Document Options
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Document Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-includeCoverPage" 
                      checked={advancedOptions.includeCoverPage} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeCoverPage', Boolean(checked))
                      }
                    />
                    <Label htmlFor="email-includeCoverPage">Include Cover Page</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-includeTableOfContents" 
                      checked={advancedOptions.includeTableOfContents} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeTableOfContents', Boolean(checked))
                      }
                    />
                    <Label htmlFor="email-includeTableOfContents">Include Table of Contents</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-includeSignatureLine" 
                      checked={advancedOptions.includeSignatureLine} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeSignatureLine', Boolean(checked))
                      }
                    />
                    <Label htmlFor="email-includeSignatureLine">Include Signature Line</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Page Setup</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email-pageSize" className="block mb-1">Page Size</Label>
                    <Select 
                      value={advancedOptions.pageSize} 
                      onValueChange={(value) => handleAdvancedOptionChange('pageSize', value)}
                    >
                      <SelectTrigger id="email-pageSize" className="w-full">
                        <SelectValue placeholder="Select page size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="email-orientation" className="block mb-1">Orientation</Label>
                    <Select 
                      value={advancedOptions.orientation} 
                      onValueChange={(value) => handleAdvancedOptionChange('orientation', value)}
                    >
                      <SelectTrigger id="email-orientation" className="w-full">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="border rounded-md p-6 mb-6">
        <h4 className="text-base font-medium mb-3">Email Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-32 font-medium">Report Title:</span>
            <span>{generatedReport.title}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Recipients:</span>
            <span>
              {emailRecipients ? 
                emailRecipients.split(',').map(email => email.trim()).join(', ') : 
                'No recipients specified'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Format:</span>
            <span>
              {advancedOptions.emailAttachFormat === "pdf" ? "PDF Document" : 
               advancedOptions.emailAttachFormat === "docx" ? "Word Document" : 
               "Both PDF and Word Document"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          variant="outline"
          onClick={goToPreviousStep} 
          disabled={isExporting}
        >
          Back
        </Button>
        
        <Button 
          onClick={handleEmailShare} 
          disabled={isExporting || !emailRecipients}
          className="flex items-center"
        >
          {isExporting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Share via Email
            </>
          )}
        </Button>
      </div>
    </TabsContent>
  );
}
