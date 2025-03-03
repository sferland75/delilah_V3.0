"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ReportTemplate,
  ReportConfiguration,
  GeneratedReport,
  ExportOptions,
  ExportResult,
  ReportSection,
  SectionConfiguration,
  DataCompleteness,
  SavedTemplate,
  TemplateLibrary,
  TemplateVersion
} from '@/lib/report-drafting/types';
import {
  getAvailableTemplates,
  getTemplate,
  getDataAvailabilityStatus,
  createReportConfiguration,
  generateReport,
  updateReportSection,
  exportReport
} from '@/lib/report-drafting/api-service';
import {
  saveTemplate,
  updateTemplate,
  deleteTemplate,
  getUserTemplateLibrary,
  getTemplateVersions,
  exportTemplate,
  importTemplate,
  addTemplateToFavorites,
  removeTemplateFromFavorites,
  shareTemplate,
  trackTemplateUsage,
  createTemplateFromBase
} from '@/lib/report-drafting/template-service';

interface ReportDraftingContextType {
  // State
  isLoading: boolean;
  error: string | null;
  templates: ReportTemplate[];
  selectedTemplate: ReportTemplate | null;
  reportConfig: ReportConfiguration | null;
  generatedReport: GeneratedReport | null;
  dataAvailability: Record<string, DataCompleteness>;
  activeStep: 'template-selection' | 'configure' | 'preview' | 'export';
  
  // Template Management State
  templateLibrary: TemplateLibrary | null;
  templateVersions: TemplateVersion[];
  
  // Report Drafting Methods
  loadTemplates: () => Promise<ReportTemplate[]>;
  selectTemplate: (templateId: string) => Promise<ReportTemplate | null>;
  createReportConfig: (
    templateId: string,
    sections: SectionConfiguration[],
    style: 'clinical' | 'conversational' | 'simplified',
    reportTitle: string
  ) => Promise<ReportConfiguration | null>;
  generateReportFromConfig: () => Promise<GeneratedReport | null>;
  updateReportSection: (reportId: string, sectionId: string, content: string) => Promise<boolean>;
  exportReport: (reportId: string, options: ExportOptions) => Promise<ExportResult | null>;
  
  // Template Management Methods
  loadTemplateLibrary: () => Promise<TemplateLibrary | null>;
  saveCurrentTemplate: (name: string, description: string, category: string, tags: string[]) => Promise<SavedTemplate | null>;
  updateTemplateDetails: (templateId: string, updates: Partial<SavedTemplate>) => Promise<SavedTemplate | null>;
  deleteTemplateById: (templateId: string) => Promise<boolean>;
  getTemplateVersionHistory: (templateId: string) => Promise<TemplateVersion[]>;
  exportTemplateToFile: (templateId: string) => Promise<Blob | null>;
  importTemplateFromFile: (file: File) => Promise<SavedTemplate | null>;
  toggleFavoriteTemplate: (templateId: string, isFavorite: boolean) => Promise<boolean>;
  toggleTemplateSharing: (templateId: string, isShared: boolean) => Promise<SavedTemplate | null>;
  createNewTemplateFromBase: (baseTemplateId: string, newName: string) => Promise<SavedTemplate | null>;
  
  // Navigation
  setActiveStep: (step: 'template-selection' | 'configure' | 'preview' | 'export') => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  
  // Reset methods
  resetError: () => void;
  resetState: () => void;
}

const ReportDraftingContext = createContext<ReportDraftingContextType | undefined>(undefined);

export function ReportDraftingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Report Drafting State
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportConfig, setReportConfig] = useState<ReportConfiguration | null>(null);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [dataAvailability, setDataAvailability] = useState<Record<string, DataCompleteness>>({});
  const [activeStep, setActiveStep] = useState<
    'template-selection' | 'configure' | 'preview' | 'export'
  >('template-selection');
  
  // Template Management State
  const [templateLibrary, setTemplateLibrary] = useState<TemplateLibrary | null>(null);
  const [templateVersions, setTemplateVersions] = useState<TemplateVersion[]>([]);

  // Load data availability on mount
  useEffect(() => {
    loadDataAvailability();
  }, []);

  // Report Drafting Methods
  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const templateData = await getAvailableTemplates();
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

  const selectTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const template = await getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      setSelectedTemplate(template);
      
      // Track template usage
      await trackTemplateUsage(templateId);
      
      return template;
    } catch (err) {
      setError('Failed to select template. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadDataAvailability = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const availability = await getDataAvailabilityStatus();
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

  const createReportConfig = async (
    templateId: string,
    sections: SectionConfiguration[],
    style: 'clinical' | 'conversational' | 'simplified',
    reportTitle: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const config = await createReportConfiguration({
        templateId,
        sections,
        style,
        reportTitle
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

  const generateReportFromConfig = async () => {
    if (!reportConfig) {
      setError('No report configuration available. Please configure a report first.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const report = await generateReport(reportConfig);
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

  const updateReportSectionContent = async (reportId: string, sectionId: string, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await updateReportSection(reportId, sectionId, content);
      
      if (success && generatedReport && generatedReport.id === reportId) {
        // Update the local state
        const updatedReport = {
          ...generatedReport,
          sections: generatedReport.sections.map(section => 
            section.id === sectionId ? { ...section, content } : section
          ),
          lastModified: new Date()
        };
        
        setGeneratedReport(updatedReport);
      }
      
      return success;
    } catch (err) {
      setError('Failed to update report section. Please try again.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportReportFile = async (reportId: string, options: ExportOptions) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await exportReport(reportId, options);
      return result;
    } catch (err) {
      setError('Failed to export report. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Template Management Methods
  const loadTemplateLibrary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const library = await getUserTemplateLibrary();
      setTemplateLibrary(library);
      return library;
    } catch (err) {
      setError('Failed to load template library. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentTemplate = async (
    name: string, 
    description: string, 
    category: string, 
    tags: string[]
  ) => {
    if (!selectedTemplate) {
      setError('No template selected to save.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const templateToSave: SavedTemplate = {
        ...selectedTemplate,
        id: `template-${Date.now()}`,
        name,
        description,
        isBuiltIn: false,
        version: 1,
        isShared: false,
        parentTemplateId: selectedTemplate.id,
        tags,
        category,
        createdBy: 'current-user',
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      const savedTemplate = await saveTemplate(templateToSave);
      
      // Refresh template library
      await loadTemplateLibrary();
      
      return savedTemplate;
    } catch (err) {
      setError('Failed to save template. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplateDetails = async (
    templateId: string, 
    updates: Partial<SavedTemplate>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTemplate = await updateTemplate(templateId, updates);
      
      // Refresh template library
      await loadTemplateLibrary();
      
      // If the current selected template is updated, update it
      if (selectedTemplate && selectedTemplate.id === templateId) {
        setSelectedTemplate({
          ...selectedTemplate,
          ...updates
        });
      }
      
      return updatedTemplate;
    } catch (err) {
      setError('Failed to update template. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplateById = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await deleteTemplate(templateId);
      
      if (success) {
        // Refresh template library
        await loadTemplateLibrary();
        
        // If the deleted template is selected, clear selection
        if (selectedTemplate && selectedTemplate.id === templateId) {
          setSelectedTemplate(null);
        }
      }
      
      return success;
    } catch (err) {
      setError('Failed to delete template. Please try again.');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplateVersionHistory = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const versions = await getTemplateVersions(templateId);
      setTemplateVersions(versions);
      return versions;
    } catch (err) {
      setError('Failed to load template version history. Please try again.');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const exportTemplateToFile = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await exportTemplate(templateId);
      return blob;
    } catch (err) {
      setError('Failed to export template. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const importTemplateFromFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const importedTemplate = await importTemplate(file);
      
      // Refresh template library
      await loadTemplateLibrary();
      
      return importedTemplate;
    } catch (err) {
      setError('Failed to import template. Please ensure the file is in the correct format.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavoriteTemplate = async (templateId: string, isFavorite: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      let success: boolean;
      
      if (isFavorite) {
        success = await addTemplateToFavorites(templateId);
      } else {
        success = await removeTemplateFromFavorites(templateId);
      }
      
      if (success) {
        // Refresh template library
        await loadTemplateLibrary();
      }
      
      return success;
    } catch (err) {
      setError(`Failed to ${isFavorite ? 'add to' : 'remove from'} favorites. Please try again.`);
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTemplateSharing = async (templateId: string, isShared: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTemplate = await shareTemplate(templateId, isShared);
      
      // Refresh template library
      await loadTemplateLibrary();
      
      return updatedTemplate;
    } catch (err) {
      setError('Failed to update template sharing settings. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTemplateFromBase = async (baseTemplateId: string, newName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTemplate = await createTemplateFromBase(baseTemplateId, newName);
      
      // Refresh template library
      await loadTemplateLibrary();
      
      return newTemplate;
    } catch (err) {
      setError('Failed to create new template. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    setActiveStep(current => {
      switch (current) {
        case 'template-selection':
          return 'configure';
        case 'configure':
          return 'preview';
        case 'preview':
          return 'export';
        default:
          return current;
      }
    });
  };

  const goToPreviousStep = () => {
    setActiveStep(current => {
      switch (current) {
        case 'configure':
          return 'template-selection';
        case 'preview':
          return 'configure';
        case 'export':
          return 'preview';
        default:
          return current;
      }
    });
  };

  const resetState = () => {
    setActiveStep('template-selection');
    setSelectedTemplate(null);
    setReportConfig(null);
    setGeneratedReport(null);
    setError(null);
  };

  const resetError = () => {
    setError(null);
  };

  const value: ReportDraftingContextType = {
    isLoading,
    error,
    templates,
    selectedTemplate,
    reportConfig,
    generatedReport,
    dataAvailability,
    activeStep,
    
    templateLibrary,
    templateVersions,
    
    loadTemplates,
    selectTemplate,
    createReportConfig,
    generateReportFromConfig,
    updateReportSection: updateReportSectionContent,
    exportReport: exportReportFile,
    
    loadTemplateLibrary,
    saveCurrentTemplate,
    updateTemplateDetails,
    deleteTemplateById,
    getTemplateVersionHistory,
    exportTemplateToFile,
    importTemplateFromFile,
    toggleFavoriteTemplate,
    toggleTemplateSharing,
    createNewTemplateFromBase,
    
    setActiveStep,
    goToNextStep,
    goToPreviousStep,
    
    resetError,
    resetState
  };

  return (
    <ReportDraftingContext.Provider value={value}>
      {children}
    </ReportDraftingContext.Provider>
  );
}

export function useReportDraftingContext() {
  const context = useContext(ReportDraftingContext);
  if (context === undefined) {
    throw new Error('useReportDraftingContext must be used within a ReportDraftingProvider');
  }
  return context;
}
