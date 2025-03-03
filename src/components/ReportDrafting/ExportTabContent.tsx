import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";  // Added this import
import { AdvancedExportOptions } from "@/services/export";
import { ExportFormat } from "@/lib/report-drafting/types";
import { FileDown } from "lucide-react";
import { GeneratedReport } from "@/lib/report-drafting/types";

interface ExportTabContentProps {
  generatedReport: GeneratedReport;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  filename: string;
  setFilename: (filename: string) => void;
  advancedOptions: AdvancedExportOptions;
  handleAdvancedOptionChange: (key: keyof AdvancedExportOptions, value: any) => void;
  handleExport: () => void;
  isExporting: boolean;
  goToPreviousStep: () => void;
  getFormatIcon: (format: ExportFormat) => JSX.Element;
}

export default function ExportTabContent({
  generatedReport,
  exportFormat,
  setExportFormat,
  filename,
  setFilename,
  advancedOptions,
  handleAdvancedOptionChange,
  handleExport,
  isExporting,
  goToPreviousStep,
  getFormatIcon
}: ExportTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Label htmlFor="filename" className="text-base font-medium block mb-2">Report Filename</Label>
        <Input 
          id="filename" 
          value={filename} 
          onChange={(e) => setFilename(e.target.value)} 
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          className={`cursor-pointer transition-all ${exportFormat === "pdf" ? "border-2 border-blue-600" : ""}`}
          onClick={() => setExportFormat("pdf")}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              {getFormatIcon("pdf")}
            </div>
            <CardTitle className="text-center">PDF Document</CardTitle>
            <CardDescription className="text-center">Standard format for sharing and printing</CardDescription>
          </CardHeader>
          <CardContent className="text-sm pt-0">
            <div className="flex justify-center">
              <RadioGroupItem value="pdf" checked={exportFormat === "pdf"} />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all ${exportFormat === "docx" ? "border-2 border-blue-600" : ""}`}
          onClick={() => setExportFormat("docx")}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              {getFormatIcon("docx")}
            </div>
            <CardTitle className="text-center">Word Document</CardTitle>
            <CardDescription className="text-center">Editable format for further modifications</CardDescription>
          </CardHeader>
          <CardContent className="text-sm pt-0">
            <div className="flex justify-center">
              <RadioGroupItem value="docx" checked={exportFormat === "docx"} />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all ${exportFormat === "clientRecord" ? "border-2 border-blue-600" : ""}`}
          onClick={() => setExportFormat("clientRecord")}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-center mb-2">
              {getFormatIcon("clientRecord")}
            </div>
            <CardTitle className="text-center">Client Record</CardTitle>
            <CardDescription className="text-center">Save directly to the client's electronic record</CardDescription>
          </CardHeader>
          <CardContent className="text-sm pt-0">
            <div className="flex justify-center">
              <RadioGroupItem value="clientRecord" checked={exportFormat === "clientRecord"} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="advanced-options">
          <AccordionTrigger className="text-sm font-medium">
            Advanced Options
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Document Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeCoverPage" 
                      checked={advancedOptions.includeCoverPage} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeCoverPage', Boolean(checked))
                      }
                    />
                    <Label htmlFor="includeCoverPage">Include Cover Page</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeTableOfContents" 
                      checked={advancedOptions.includeTableOfContents} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeTableOfContents', Boolean(checked))
                      }
                    />
                    <Label htmlFor="includeTableOfContents">Include Table of Contents</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeSignatureLine" 
                      checked={advancedOptions.includeSignatureLine} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeSignatureLine', Boolean(checked))
                      }
                    />
                    <Label htmlFor="includeSignatureLine">Include Signature Line</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeMetadata" 
                      checked={advancedOptions.includeMetadata} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeMetadata', Boolean(checked))
                      }
                    />
                    <Label htmlFor="includeMetadata">Include Metadata</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeHeaders" 
                      checked={advancedOptions.includeHeaders} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeHeaders', Boolean(checked))
                      }
                    />
                    <Label htmlFor="includeHeaders">Include Headers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeFooters" 
                      checked={advancedOptions.includeFooters} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('includeFooters', Boolean(checked))
                      }
                    />
                    <Label htmlFor="includeFooters">Include Footers</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Page Setup</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pageSize" className="block mb-1">Page Size</Label>
                    <Select 
                      value={advancedOptions.pageSize} 
                      onValueChange={(value) => handleAdvancedOptionChange('pageSize', value)}
                    >
                      <SelectTrigger id="pageSize" className="w-full">
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
                    <Label htmlFor="orientation" className="block mb-1">Orientation</Label>
                    <Select 
                      value={advancedOptions.orientation} 
                      onValueChange={(value) => handleAdvancedOptionChange('orientation', value)}
                    >
                      <SelectTrigger id="orientation" className="w-full">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="useBranding" 
                      checked={advancedOptions.useBranding} 
                      onCheckedChange={(checked) => 
                        handleAdvancedOptionChange('useBranding', Boolean(checked))
                      }
                    />
                    <Label htmlFor="useBranding">Use Organization Branding</Label>
                  </div>
                  
                  {advancedOptions.useBranding && (
                    <div>
                      <Label htmlFor="organizationName" className="block mb-1">Organization Name</Label>
                      <Input 
                        id="organizationName" 
                        value={advancedOptions.organizationName || ''} 
                        onChange={(e) => handleAdvancedOptionChange('organizationName', e.target.value)} 
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="border rounded-md p-6 mb-6">
        <h4 className="text-base font-medium mb-3">Report Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-32 font-medium">Title:</span>
            <span>{generatedReport.title}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Sections:</span>
            <span>{generatedReport.sections.length}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Created Date:</span>
            <span>{new Date(generatedReport.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Format:</span>
            <span>
              {exportFormat === "pdf" ? "PDF Document" : 
               exportFormat === "docx" ? "Word Document" : 
               "Client Record Entry"}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">File Name:</span>
            <span>
              {filename || `${generatedReport.title.replace(/\s+/g, '_')}`}
              {exportFormat === "pdf" ? ".pdf" : 
               exportFormat === "docx" ? ".docx" : ""}
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
          onClick={handleExport} 
          disabled={isExporting}
          className="flex items-center"
        >
          {isExporting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Export Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
