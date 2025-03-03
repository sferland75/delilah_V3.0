import React, { createContext, useContext, ReactNode } from 'react';
import { useIntelligence } from '../hooks/useIntelligence';
import { Suggestion } from '../services/intelligence/contextualSuggestionService';
import { ValidationWarning } from '../services/intelligence/dataValidationService';
import { ImprovementRecommendation } from '../services/intelligence/contentImprovementService';
import { CompletenessIndicator } from '../services/intelligence/completenessService';
import { ConsistencyCheck } from '../services/intelligence/terminologyConsistencyService';

interface IntelligenceContextProps {
  suggestions: Suggestion[];
  validationWarnings: ValidationWarning[];
  improvementRecommendations: ImprovementRecommendation[];
  completenessIndicators: Record<string, CompletenessIndicator>;
  consistencyChecks: ConsistencyCheck[];
  isLoading: boolean;
  error: string | null;
  
  // Section-specific data
  sectionSuggestions: Record<string, Suggestion[]>;
  sectionWarnings: Record<string, ValidationWarning[]>;
  sectionImprovements: Record<string, ImprovementRecommendation[]>;
  
  // Helper methods
  getSectionsWithWarnings: () => string[];
  getSectionCompletenessScore: (section: string) => number;
  getTotalCompleteness: () => number;
  getCompletionStatus: () => 'incomplete' | 'partial' | 'complete';
  refreshIntelligence: () => Promise<void>;
}

const defaultContextValue: IntelligenceContextProps = {
  suggestions: [],
  validationWarnings: [],
  improvementRecommendations: [],
  completenessIndicators: {},
  consistencyChecks: [],
  isLoading: false,
  error: null,
  
  sectionSuggestions: {},
  sectionWarnings: {},
  sectionImprovements: {},
  
  getSectionsWithWarnings: () => [],
  getSectionCompletenessScore: () => 0,
  getTotalCompleteness: () => 0,
  getCompletionStatus: () => 'incomplete',
  refreshIntelligence: async () => {}
};

const IntelligenceContext = createContext<IntelligenceContextProps>(defaultContextValue);

interface IntelligenceProviderProps {
  children: ReactNode;
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
}

export const IntelligenceProvider: React.FC<IntelligenceProviderProps> = ({
  children,
  enableAutoRefresh = false,
  refreshInterval = 60000
}) => {
  // Check if intelligence features are enabled
  const isIntelligenceEnabled = process.env.NEXT_PUBLIC_ENABLE_INTELLIGENCE === 'true';
  
  // Only use the real intelligence hooks if enabled, otherwise use dummy data
  const intelligence = isIntelligenceEnabled 
    ? useIntelligence({
        enableAutoRefresh,
        refreshInterval
      })
    : defaultContextValue;
  
  // Helper methods
  const getSectionsWithWarnings = (): string[] => {
    if (!isIntelligenceEnabled) return [];
    
    return Object.keys(intelligence.sectionWarnings).filter(
      section => intelligence.sectionWarnings[section]?.length > 0
    );
  };
  
  const getSectionCompletenessScore = (section: string): number => {
    if (!isIntelligenceEnabled) return 0;
    
    return intelligence.completenessIndicators[section]?.completenessScore || 0;
  };
  
  const getTotalCompleteness = (): number => {
    if (!isIntelligenceEnabled) return 0;
    
    const indicators = intelligence.completenessIndicators;
    if (Object.keys(indicators).length === 0) return 0;
    
    const totalScore = Object.values(indicators).reduce(
      (sum, indicator) => sum + indicator.completenessScore, 
      0
    );
    
    return Math.round(totalScore / Object.keys(indicators).length);
  };
  
  const getCompletionStatus = (): 'incomplete' | 'partial' | 'complete' => {
    const totalScore = getTotalCompleteness();
    
    if (totalScore >= 90) return 'complete';
    if (totalScore >= 50) return 'partial';
    return 'incomplete';
  };
  
  const refreshIntelligence = async (): Promise<void> => {
    if (!isIntelligenceEnabled) return Promise.resolve();
    
    // The actual refresh logic is handled in the useIntelligence hook
    return Promise.resolve();
  };
  
  const value: IntelligenceContextProps = {
    ...intelligence,
    getSectionsWithWarnings,
    getSectionCompletenessScore,
    getTotalCompleteness,
    getCompletionStatus,
    refreshIntelligence
  };
  
  return (
    <IntelligenceContext.Provider value={value}>
      {children}
    </IntelligenceContext.Provider>
  );
};

export const useIntelligenceContext = (): IntelligenceContextProps => {
  const context = useContext(IntelligenceContext);
  return context;
};
