"use client";

import LoadAssessment from "@/components/LoadAssessment";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import Link from "next/link";

export default function LoadAssessmentPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Load Assessment Data</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Load assessment data from samples or import from external sources
          </p>
        </div>
        <Link href="/import-pdf" className="mt-4 md:mt-0">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileUp className="h-4 w-4 mr-2" />
            Import from PDF
          </Button>
        </Link>
      </div>
      
      <div className="mb-8 p-4 border rounded-md bg-amber-50 border-amber-200">
        <h3 className="text-lg font-medium text-amber-800 mb-2">Import Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-amber-700 mb-1">Pre-built Sample Cases</h4>
            <p className="text-sm text-amber-700">
              Use the form below to load pre-built sample cases with complete assessment data.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-amber-700 mb-1">PDF Import</h4>
            <p className="text-sm text-amber-700">
              <Link href="/import-pdf" className="underline">Import from PDF</Link> to extract assessment data from external reports and medical records.
            </p>
          </div>
        </div>
      </div>
      
      <LoadAssessment />
      
      <div className="mt-6 p-4 border rounded-md bg-blue-50 text-blue-800">
        <h3 className="text-lg font-medium mb-2">How to use this feature</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Select a sample case from the dropdown menu</li>
          <li>Click "Load Case" to populate the assessment with data</li>
          <li>Navigate to the Report Drafting page to generate a report</li>
          <li>All sections will be pre-populated with the sample data</li>
        </ol>
      </div>
    </div>
  );
}
