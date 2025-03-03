import { useState, useEffect } from 'react';
import { useAssessment } from '../contexts/AssessmentContext';
import { intelligenceService } from '../services/intelligence/intelligenceService';
import { Suggestion } from '../services/intelligence/contextualSuggestionService';
import { ValidationWarning } from '../services/intelligence/dataValidationService';
import { ImprovementRecommendation } from '../services/intelligence/contentImprovementService';
import { CompletenessIndicator } from '../services/intelligence/completenessService';
import { ConsistencyCheck } from '../services/intelligence/terminologyConsistencyService';

interface IntelligenceData {
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
}

interface IntelligenceOptions {
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  sections?: string[];
}

/**
 * Hook to access intelligence features for assessment data
 */
export function useIntelligence(options: IntelligenceOptions = {}): IntelligenceData {
  const { data } = useAssessment();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationWarning[]>([]);
  const [improvementRecommendations, setImprovementRecommendations] = useState<ImprovementRecommendation[]>([]);
  const [completenessIndicators, setCompletenessIndicators] = useState<Record<string, CompletenessIndicator>>({});
  const [consistencyChecks, setConsistencyChecks] = useState<ConsistencyCheck[]>([]);
  
  const [sectionSuggestions, setSectionSuggestions] = useState<Record<string, Suggestion[]>>({});
  const [sectionWarnings, setSectionWarnings] = useState<Record<string, ValidationWarning[]>>({});
  const [sectionImprovements, setSectionImprovements] = useState<Record<string, ImprovementRecommendation[]>>({});
  
  const { 
    enableAutoRefresh = false, 
    refreshInterval = 60000, // 1 minute default
    sections = []
  } = options;
  
  // Load intelligence data
  const loadIntelligenceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Process the full assessment to get insights
      const results = await intelligenceService.processAssessment(data);
      
      // Flatten section-specific data into arrays
      const allSuggestions = Object.values(results.suggestions).flat();
      const allWarnings = Object.values(results.validationWarnings).flat();
      const allImprovements = Object.values(results.improvementRecommendations).flat();
      
      // Update state
      setSuggestions(allSuggestions);
      setValidationWarnings(allWarnings);
      setImprovementRecommendations(allImprovements);
      setCompletenessIndicators(results.completenessIndicators);
      setConsistencyChecks(results.consistencyChecks);
      
      // Update section-specific data
      setSectionSuggestions(results.suggestions);
      setSectionWarnings(results.validationWarnings);
      setSectionImprovements(results.improvementRecommendations);
    } catch (err) {
      console.error('Error loading intelligence data:', err);
      setError('Failed to analyze assessment data.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load and refresh on data changes
  useEffect(() => {
    loadIntelligenceData();
    
    // Set up auto-refresh if enabled
    let refreshTimer: NodeJS.Timeout | null = null;
    
    if (enableAutoRefresh) {
      refreshTimer = setInterval(() => {
        loadIntelligenceData();
      }, refreshInterval);
    }
    
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [data, enableAutoRefresh, refreshInterval]);
  
  return {
    suggestions,
    validationWarnings,
    improvementRecommendations,
    completenessIndicators,
    consistencyChecks,
    isLoading,
    error,
    sectionSuggestions,
    sectionWarnings,
    sectionImprovements
  };
}
