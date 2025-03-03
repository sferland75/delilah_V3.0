/**
 * Hook for accessing the Report Drafting functionality
 */

import { useState } from 'react';
import { reportDraftingService } from '@/lib/report-drafting/mock-service';
import {
  ReportTemplate,
  ReportConfiguration,
  GeneratedReport,
  ExportOptions,
  ExportResult,
  SectionConfiguration
} from '@/lib/report-drafting/types';

export function useReportDrafting() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportConfig, setReportConfig] = useState<ReportConfiguration | null>(null);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [dataAvailability, setDataAvailability] = useState<Record<string, { complete: boolean; percentage: number; }>>({});

  /**
   * Load available templates
   */
  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const templateData = await reportDraftingService.getTemplates();
      setTemplates(templateData);
      return templateData;
    } catch (err) {
      setError('Failed to load report templates. Please try again.');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Select a template by ID
   */
  const selectTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const template = await reportDraftingService.getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      setSelectedTemplate(template);
      
      // Also load data availability
      await loadDataAvailability();
      
      return template;
    } catch (err) {
      setError('Failed to select template. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load data availability for sections
   */
  const loadDataAvailability = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const availability = await reportDraftingService.getDataAvailability();
      setDataAvailability(availability);
      return availability;
    } catch (err) {
      setError('Failed to load data availability. Please try again.');
      console.error(err);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a report configuration
   */
  const createReportConfig = async (
    templateId: string, 
    sections: SectionConfiguration[], 
    style: 'clinical' | 'conversational' | 'simplified',
    name: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const config = await reportDraftingService.createReportConfiguration({
        templateId,
        sections,
        style,
        name,
        createdBy: 'current-user', // This would come from auth context in real implementation
        status: 'draft'
      });
      setReportConfig(config);
      return config;
    } catch (err) {
      setError('Failed to create report configuration. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a report based on configuration
   */
  const generateReport = async (configId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const report = await reportDraftingService.generateReport(configId);
      setGeneratedReport(report);
      return report;
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update a section of the report
   */
  const updateReportSection = async (reportId: string, sectionId: string, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await reportDraftingService.updateReportSection(reportId, sectionId, content);
      
      // Update the local state
      if (generatedReport && generatedReport.id === reportId) {
        const updatedReport = {
          ...generatedReport,
          sections: generatedReport.sections.map(section => 
            section.id === sectionId ? { ...section, content } : section
          ),
          lastModified: new Date()
        };
        setGeneratedReport(updatedReport);
        return updatedReport;
      }
      return null;
    } catch (err) {
      setError('Failed to update report section. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Export a report
   */
  const exportReport = async (reportId: string, options: ExportOptions): Promise<ExportResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await reportDraftingService.exportReport(reportId, options);
      return result;
    } catch (err) {
      setError('Failed to export report. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isLoading,
    error,
    templates,
    selectedTemplate,
    reportConfig,
    generatedReport,
    dataAvailability,
    
    // Methods
    loadTemplates,
    selectTemplate,
    loadDataAvailability,
    createReportConfig,
    generateReport,
    updateReportSection,
    exportReport,
    
    // Reset methods
    resetError: () => setError(null)
  };
}
