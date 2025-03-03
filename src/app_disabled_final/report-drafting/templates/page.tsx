"use client";

import { ReportDraftingProvider } from "@/contexts/ReportDrafting/ReportDraftingContext";
import TemplateManagement from "@/components/ReportDrafting/TemplateManagement";

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-8">
      <ReportDraftingProvider>
        <TemplateManagement />
      </ReportDraftingProvider>
    </div>
  );
}
