import React, { createContext, useContext, useState } from 'react';

interface AssessmentContextType {
  mode: 'edit' | 'view';
  setMode: (mode: 'edit' | 'view') => void;
  promptLabOpen: boolean;
  openPromptLab: (sectionId: string) => void;
  closePromptLab: () => void;
  currentSection: string | null;
  setCurrentSection: (sectionId: string | null) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [promptLabOpen, setPromptLabOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  const openPromptLab = (sectionId: string) => {
    setCurrentSection(sectionId);
    setPromptLabOpen(true);
  };

  const closePromptLab = () => {
    setPromptLabOpen(false);
    setCurrentSection(null);
  };

  return (
    <AssessmentContext.Provider
      value={{
        mode,
        setMode,
        promptLabOpen,
        openPromptLab,
        closePromptLab,
        currentSection,
        setCurrentSection,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessmentContext must be used within an AssessmentProvider');
  }
  return context;
}