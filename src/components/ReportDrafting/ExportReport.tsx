"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useReportDraftingContext } from "@/contexts/ReportDrafting/ReportDraftingContext";
import { ExportFormat } from "@/lib/report-drafting/types";
import { 
  AlertCircle, 
  AlertTriangle, 
  Check, 
  FileText, 
  Save, 
  Home
} from "lucide-react";
import { useRouter } from "next/navigation";
import { exportService, printService } from "@/services/export";
import { AdvancedExportOptions } from "@/services/export";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import tab content components
import ExportTabContent from "./ExportTabContent";
import EmailTabContent from "./EmailTabContent";
import PrintTabContent from "./PrintTabContent";

export default function ExportReport() {
  const { 
    generatedReport, 
    isLoading, 
    error, 
    exportReport,
    goToPreviousStep
  } = useReportDraftingContext();

  const router = useRouter();
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [filename, setFilename] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string>("");
  const [exportTab, setExportTab] = useState<string>("export");
  const [emailRecipients, setEmailRecipients] = useState<string>("");
  
  // Advanced export options
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedExportOptions>({
    format: "pdf",
    includeMetadata: true,
    includeHeaders: true,
    includeFooters: true,
    pageSize: "letter",
    orientation: "portrait",
    margins: { top: 25, right: 25, bottom: 25, left: 25 },
    includeAppendices: true,
    includeSummaryPage: true,
    includeSignatureLine: true,
    includeCoverPage: true,
    includeTableOfContents: true,
    useBranding: true,
    organizationName: "Delilah Assessment System",
    emailAttachFormat: "pdf",
  });

  // Set default filename when report changes
  useEffect(() => {
    if (generatedReport) {
      setFilename(`${generatedReport.title.replace(/\s+/g, '_')}_${new Date(generatedReport.createdAt).toISOString().split('T')[0]}`);
    }
  }, [generatedReport]);

  // Handle export with our enhanced export service
  const handleExport = async () => {
    if (!generatedReport) return;
    
    setIsExporting(true);
    try {
      // Use our new export service
      const options: AdvancedExportOptions = {
        ...advancedOptions,
        format: exportFormat,
        filename: filename || `${generatedReport.title.replace(/\s+/g, '_')}.${exportFormat === 'pdf' ? 'pdf' : 'docx'}`
      };
      
      const result = await exportService.exportReport(generatedReport, exportFormat, options);
      
      // Also call the API to log the export
      await exportReport(generatedReport.id, {
        format: exportFormat,
        filename: filename,
        includeMetadata: advancedOptions.includeMetadata,
        includeHeaders: advancedOptions.includeHeaders,
        includeFooters: advancedOptions.includeFooters
      });
      
      setExportComplete(true);
      setExportSuccess(result.success);
      setExportMessage(result.message || "Export completed successfully.");
    } catch (error) {
      console.error("Error exporting report:", error);
      setExportComplete(true);
      setExportSuccess(false);
      setExportMessage("An error occurred while exporting the report.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle email sharing
  const handleEmailShare = async () => {
    if (!generatedReport) return;
    
    setIsExporting(true);
    try {
      // Split and clean email recipients
      const recipients = emailRecipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
      
      if (recipients.length === 0) {
        throw new Error("No valid email recipients specified");
      }
      
      // Prepare email options
      const emailOptions: AdvancedExportOptions = {
        ...advancedOptions,
        format: advancedOptions.emailAttachFormat as ExportFormat || 'pdf',
        emailRecipients: recipients,
        emailSubject: `Assessment Report: ${generatedReport.title}`,
        emailBody: `Please find attached the assessment report for ${generatedReport.metadata.clientName}.`
      };
      
      const result = await exportService.shareViaEmail(generatedReport, emailOptions);
      
      setExportComplete(true);
      setExportSuccess(result.success);
      setExportMessage(result.message || "Report successfully shared via email.");
    } catch (error) {
      console.error("Error sharing report via email:", error);
      setExportComplete(true);
      setExportSuccess(false);
      setExportMessage(`Failed to share report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle printing
  const handlePrint = async () => {
    if (!generatedReport) return;
    
    try {
      // Use our print service to handle printing
      await printService.printReport(generatedReport, {
        paperSize: advancedOptions.pageSize || 'letter',
        orientation: advancedOptions.orientation || 'portrait',
        margins: advancedOptions.margins || { top: 25, right: 25, bottom: 25, left: 25 },
        includeHeaderFooter: advancedOptions.includeHeaders || advancedOptions.includeFooters || false,
        useColor: true,
        printBackground: true,
        scale: 1.0,
        preferCssPageSize: true,
        printMetadata: advancedOptions.includeMetadata || true
      });
    } catch (error) {
      console.error("Error printing report:", error);
      setExportComplete(true);
      setExportSuccess(false);
      setExportMessage(`Failed to print report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleComplete = () => {
    router.push("/assessment/initial");
  };

  const handleAdvancedOptionChange = (key: keyof AdvancedExportOptions, value: any) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-600" />;
      case "docx":
        return <FileText className="h-8 w-8 text-blue-600" />;
      case "clientRecord":
        return <Save className="h-8 w-8 text-green-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600 mr-2"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium">Error</h3>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={goToPreviousStep}
          >
            Back to Preview
          </Button>
        </div>
      </div>
    );
  }

  if (!generatedReport) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
        <h3 className="font-medium">No report to export</h3>
        <p className="text-sm mt-1">Please generate a report first.</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={goToPreviousStep}
        >
          Back to Preview
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Finalize & Export Report</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Your report is ready to be finalized and exported. Choose your preferred format and options.
      </p>
      
      {!exportComplete ? (
        <>
          <Tabs value={exportTab} onValueChange={setExportTab} className="w-full border rounded-md">
            <TabsList className="grid w-full grid-cols-3 p-0 h-auto border-b">
              <TabsTrigger 
                value="export" 
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Export File
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Share via Email
              </TabsTrigger>
              <TabsTrigger 
                value="print" 
                className="py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
              >
                Print Report
              </TabsTrigger>
            </TabsList>
            
            {/* Export Tab Content */}
            <ExportTabContent
              generatedReport={generatedReport}
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              filename={filename}
              setFilename={setFilename}
              advancedOptions={advancedOptions}
              handleAdvancedOptionChange={handleAdvancedOptionChange}
              handleExport={handleExport}
              isExporting={isExporting}
              goToPreviousStep={goToPreviousStep}
              getFormatIcon={getFormatIcon}
            />
            
            {/* Email Tab Content */}
            <EmailTabContent
              generatedReport={generatedReport}
              emailRecipients={emailRecipients}
              setEmailRecipients={setEmailRecipients}
              advancedOptions={advancedOptions}
              handleAdvancedOptionChange={handleAdvancedOptionChange}
              handleEmailShare={handleEmailShare}
              isExporting={isExporting}
              goToPreviousStep={goToPreviousStep}
            />
            
            {/* Print Tab Content */}
            <PrintTabContent
              generatedReport={generatedReport}
              advancedOptions={advancedOptions}
              handleAdvancedOptionChange={handleAdvancedOptionChange}
              handlePrint={handlePrint}
              isExporting={isExporting}
              goToPreviousStep={goToPreviousStep}
            />
          </Tabs>
        </>
      ) : (
        <div className="border rounded-md p-8 mb-6 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            exportSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}>
            {exportSuccess ? (
              <Check className="h-8 w-8" />
            ) : (
              <AlertTriangle className="h-8 w-8" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">{exportSuccess ? "Export Complete" : "Export Failed"}</h3>
          <p className="text-muted-foreground mb-6">{exportMessage}</p>
          {exportSuccess && (
            <div className="flex justify-center space-x-4">
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setExportComplete(false)}
              >
                Export Another Format
              </Button>
            </div>
          )}
          {!exportSuccess && (
            <Button 
              variant="outline" 
              onClick={() => setExportComplete(false)}
            >
              Try Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}