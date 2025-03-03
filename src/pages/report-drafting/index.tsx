import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Clipboard, ArrowRight } from 'lucide-react';

export default function ReportDraftingIndex() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Report Drafting</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create professional assessment reports with intelligent content suggestions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              New Report
            </CardTitle>
            <CardDescription>
              Create a new report from existing assessment data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Generate a comprehensive report using data from completed assessments
              with intelligent content suggestions.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/report-drafting/generate" className="w-full">
              <Button className="w-full">Create New Report</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Templates
            </CardTitle>
            <CardDescription>
              Manage and use report templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Create, modify, and use report templates to ensure consistency
              across different types of assessments.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-purple-600" />
              Recent Reports
            </CardTitle>
            <CardDescription>
              View and edit recently created reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Access your recently created reports for review, editing,
              or use as a basis for new assessments.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="font-medium text-blue-800">Tips for effective reports:</h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc pl-5">
          <li>Complete all assessment sections for the most comprehensive report</li>
          <li>Review AI-suggested content carefully before finalizing</li>
          <li>Use templates for consistent formatting across reports</li>
          <li>Save drafts frequently during the report creation process</li>
        </ul>
      </div>
    </div>
  );
}
