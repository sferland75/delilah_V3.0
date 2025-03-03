import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedExportOptions } from "@/services/export";
import { GeneratedReport } from "@/lib/report-drafting/types";
import { TabsContent } from "@/components/ui/tabs";
import { Printer } from "lucide-react";

interface PrintTabContentProps {
  generatedReport: GeneratedReport;
  advancedOptions: AdvancedExportOptions;
  handleAdvancedOptionChange: (key: keyof AdvancedExportOptions, value: any) => void;
  handlePrint: () => void;
  isExporting: boolean;
  goToPreviousStep: () => void;
}

export default function PrintTabContent({
  generatedReport,
  advancedOptions,
  handleAdvancedOptionChange,
  handlePrint,
  isExporting,
  goToPreviousStep
}: PrintTabContentProps) {
  return (
    <TabsContent value="print" className="p-6">
      <div className="mb-6">
        <h4 className="text-base font-medium mb-2">Print Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="print-pageSize" className="block mb-1">Page Size</Label>
            <Select 
              value={advancedOptions.pageSize} 
              onValueChange={(value) => handleAdvancedOptionChange('pageSize', value)}
            >
              <SelectTrigger id="print-pageSize" className="w-full">
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
            <Label htmlFor="print-orientation" className="block mb-1">Orientation</Label>
            <Select 
              value={advancedOptions.orientation} 
              onValueChange={(value) => handleAdvancedOptionChange('orientation', value)}
            >
              <SelectTrigger id="print-orientation" className="w-full">
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
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="print-includeHeaders" 
            checked={advancedOptions.includeHeaders} 
            onCheckedChange={(checked) => 
              handleAdvancedOptionChange('includeHeaders', Boolean(checked))
            }
          />
          <Label htmlFor="print-includeHeaders">Include Headers</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="print-includeFooters" 
            checked={advancedOptions.includeFooters} 
            onCheckedChange={(checked) => 
              handleAdvancedOptionChange('includeFooters', Boolean(checked))
            }
          />
          <Label htmlFor="print-includeFooters">Include Footers</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="print-includeCoverPage" 
            checked={advancedOptions.includeCoverPage} 
            onCheckedChange={(checked) => 
              handleAdvancedOptionChange('includeCoverPage', Boolean(checked))
            }
          />
          <Label htmlFor="print-includeCoverPage">Include Cover Page</Label>
        </div>
      </div>
      
      <div className="border rounded-md p-6 mb-6">
        <h4 className="text-base font-medium mb-3">Print Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-32 font-medium">Report Title:</span>
            <span>{generatedReport.title}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Page Size:</span>
            <span>{advancedOptions.pageSize?.toUpperCase()}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Orientation:</span>
            <span>{advancedOptions.orientation}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Headers:</span>
            <span>{advancedOptions.includeHeaders ? 'Included' : 'Not included'}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Footers:</span>
            <span>{advancedOptions.includeFooters ? 'Included' : 'Not included'}</span>
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
          onClick={handlePrint} 
          disabled={isExporting}
          className="flex items-center"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </div>
    </TabsContent>
  );
}
