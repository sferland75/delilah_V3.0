# Symptoms Assessment Implementation Guide

## Overview
The Symptoms Assessment section handles the documentation and analysis of symptoms across physical, cognitive, and emotional domains. It integrates with Claude for enhanced medical documentation and pattern analysis.

## Component Implementation

### 1. Main Section Component
```typescript
// Integration of all sub-components
React.createElement(SymptomsAssessment, {
  'data-testid': 'symptoms-assessment',
  onSave: handleSave,
  onAnalyze: handleAnalyze
});
```

### 2. Tab Structure
```typescript
React.createElement(Tabs, {
  defaultValue: 'general',
  'data-testid': 'symptoms-tabs'
},
  // Tabs list
  React.createElement(TabsList, null,
    ['general', 'physical', 'cognitive', 'emotional'].map(tab =>
      React.createElement(TabsTrigger, {
        key: tab,
        value: tab,
        'data-testid': `${tab}-tab`
      }, tab)
    )
  ),
  // Tab content
  React.createElement(TabsContent, {
    value: 'general',
    'data-testid': 'general-content'
  },
    React.createElement(GeneralNotes)
  )
  // Other tab content...
);
```

### 3. Form Integration
```typescript
// Form provider setup
React.createElement(FormProvider, {
  ...methods
},
  React.createElement('form', {
    onSubmit: handleSubmit(onSave),
    'data-testid': 'symptoms-form'
  },
    // Form content
  )
);
```

## State Management

### 1. Form State
```typescript
// Form context setup
const methods = useForm<SymptomsFormState>({
  defaultValues: {
    general: { notes: '' },
    physical: { locations: [] },
    cognitive: { symptoms: [] },
    emotional: { symptoms: [] }
  }
});

// State watchers
const watchSymptoms = methods.watch();
```

### 2. API Integration State
```typescript
// Analysis state
const [analyzing, setAnalyzing] = useState(false);
const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

// Error state
const [error, setError] = useState<Error | null>(null);
```

## Event Handlers

### 1. Form Submission
```typescript
const onSubmit = async (data: SymptomsFormState) => {
  try {
    const enhanced = await enhanceDocumentation('all', data);
    methods.reset(enhanced);
  } catch (error) {
    handleAPIError(error, 'submission');
  }
};
```

### 2. Analysis Triggers
```typescript
const triggerAnalysis = async (section: string) => {
  setAnalyzing(true);
  try {
    const content = methods.getValues(section);
    const analysis = await analyzeSymptomPatterns(content);
    setAnalysisResults(analysis);
  } catch (error) {
    handleAPIError(error, 'analysis');
  } finally {
    setAnalyzing(false);
  }
};
```

### 3. Tab Navigation
```typescript
const handleTabChange = (tab: string) => {
  // Save current tab state
  const currentTab = methods.getValues();
  localStorage.setItem('lastTab', JSON.stringify({
    tab,
    state: currentTab
  }));
  
  // Trigger tab-specific analysis
  triggerAnalysis(tab);
};
```

## Error Handling

### 1. Form Validation
```typescript
const validateSection = (section: string, data: any) => {
  const validationRules = {
    physical: validatePhysicalSymptoms,
    cognitive: validateCognitiveSymptoms,
    emotional: validateEmotionalSymptoms
  };

  return validationRules[section]?.(data) ?? true;
};
```

### 2. API Error Recovery
```typescript
const handleAPIError = (error: Error, context: string) => {
  setError(error);
  
  // Save current state
  const currentState = methods.getValues();
  localStorage.setItem('recoveryState', JSON.stringify({
    context,
    state: currentState,
    timestamp: Date.now()
  }));

  // Show error UI
  React.createElement(ErrorAlert, {
    error,
    context,
    onRetry: () => retryOperation(context)
  });
};
```

## State Persistence

### 1. Local Storage
```typescript
const persistState = () => {
  const currentState = methods.getValues();
  localStorage.setItem('symptomsState', JSON.stringify({
    state: currentState,
    timestamp: Date.now()
  }));
};

// Auto-save on form changes
useEffect(() => {
  const subscription = methods.watch(() => persistState());
  return () => subscription.unsubscribe();
}, [methods]);
```

### 2. Recovery
```typescript
const recoverState = () => {
  const saved = localStorage.getItem('symptomsState');
  if (saved) {
    const { state, timestamp } = JSON.parse(saved);
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24 hours
      methods.reset(state);
    }
  }
};
```

## AI Integration

### 1. Enhancement Triggers
```typescript
const enhanceSection = async (section: string) => {
  const content = methods.getValues(section);
  const enhanced = await enhanceDocumentation(section, content);
  methods.setValue(section, enhanced);
};
```

### 2. Suggestions
```typescript
const applySuggestion = (suggestion: Suggestion) => {
  const { path, value } = suggestion;
  methods.setValue(path, value);
};

React.createElement('div', {
  className: 'suggestions',
  'data-testid': 'ai-suggestions'
},
  analysisResults?.suggestions.map(suggestion =>
    React.createElement(SuggestionCard, {
      key: suggestion.id,
      suggestion,
      onApply: () => applySuggestion(suggestion)
    })
  )
);
```

## Testing Implementation

### 1. Component Tests
```typescript
describe('SymptomsAssessment', () => {
  it('renders all sections', () => {
    render(React.createElement(SymptomsAssessment));
    
    expect(screen.getByTestId('general-tab')).toBeInTheDocument();
    expect(screen.getByTestId('physical-tab')).toBeInTheDocument();
    expect(screen.getByTestId('cognitive-tab')).toBeInTheDocument();
    expect(screen.getByTestId('emotional-tab')).toBeInTheDocument();
  });

  it('maintains state between tabs', async () => {
    render(React.createElement(SymptomsAssessment));
    
    // Fill form
    await user.type(
      screen.getByTestId('general-notes'),
      'Test notes'
    );
    
    // Switch tabs
    await user.click(screen.getByTestId('physical-tab'));
    await user.click(screen.getByTestId('general-tab'));
    
    // Verify state persistence
    expect(screen.getByTestId('general-notes')).toHaveValue('Test notes');
  });
});
```

### 2. Integration Tests
```typescript
describe('API Integration', () => {
  it('enhances documentation', async () => {
    const mockEnhance = jest.fn();
    render(
      React.createElement(SymptomsAssessment, {
        onEnhance: mockEnhance
      })
    );
    
    await user.click(screen.getByTestId('enhance-button'));
    
    expect(mockEnhance).toHaveBeenCalled();
  });
});
```

## Best Practices

1. State Management
- Use form context for form state
- Local storage for recovery
- Clear error states
- Handle loading states

2. API Integration
- Implement retry logic
- Cache responses
- Handle errors gracefully
- Show loading states

3. Testing
- Test all user flows
- Mock API responses
- Test error states
- Verify state persistence

4. Accessibility
- Proper ARIA labels
- Keyboard navigation
- Error announcements
- Loading indicators

5. Performance
- Debounce API calls
- Cache results
- Lazy load sections
- Optimize re-renders