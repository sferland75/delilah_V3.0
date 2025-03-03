# Symptoms Assessment Prompts and API Integration

## Section Overview
The Symptoms Assessment section uses Claude to analyze and enhance symptom documentation across physical, cognitive, and emotional domains.

## API Integration Points

### 1. Symptom Analysis
```typescript
interface SymptomAnalysisRequest {
  general: {
    notes: string;
  };
  physical: {
    locations: Array<{
      location: string;
      painType: string;
      intensity: string;
      description: string;
    }>;
  };
  cognitive: {
    symptoms: Array<{
      type: string;
      description: string;
      impact: string;
    }>;
  };
  emotional: {
    symptoms: Array<{
      type: string;
      description: string;
      severity: string;
      triggers: string[];
    }>;
  };
}
```

### 2. AI Enhancement Points
1. General Notes Analysis:
```javascript
const prompt = `Review and enhance the following general symptom notes for medical documentation.
Consider patterns, interactions, and potential clinical significance.

Notes:
${generalNotes}

Please:
1. Identify key symptom patterns
2. Note potential interactions between symptoms
3. Suggest additional assessment areas if needed
4. Maintain professional medical terminology`;
```

2. Physical Symptoms Enhancement:
```javascript
const prompt = `Analyze the following physical symptoms and their characteristics.
Focus on clinical precision and completeness.

Symptoms:
${JSON.stringify(physicalSymptoms, null, 2)}

Please:
1. Verify anatomical accuracy of locations
2. Enhance descriptions using standard medical terminology
3. Note any patterns or relationships between symptoms
4. Suggest any missing key data points`;
```

3. Cognitive Symptoms Analysis:
```javascript
const prompt = `Review the following cognitive symptoms for completeness and clinical relevance.

Symptoms:
${JSON.stringify(cognitiveSymptoms, null, 2)}

Please:
1. Ensure descriptions use standardized neurological terminology
2. Identify potential cognitive domains affected
3. Note any temporal patterns or triggers
4. Suggest additional cognitive assessments if indicated`;
```

4. Emotional Symptoms Enhancement:
```javascript
const prompt = `Analyze the following emotional symptoms for clinical documentation.

Symptoms:
${JSON.stringify(emotionalSymptoms, null, 2)}

Please:
1. Standardize terminology to clinical psychiatric terms
2. Identify patterns in triggers and responses
3. Note severity progression or patterns
4. Suggest additional psychological assessment areas`;
```

## Integration Functions

### 1. Symptom Pattern Analysis
```typescript
const analyzeSymptomPatterns = async (symptoms: SymptomAnalysisRequest) => {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Analyze these symptoms for patterns and relationships:
${JSON.stringify(symptoms, null, 2)}

Focus on:
1. Temporal relationships
2. Symptom clusters
3. Potential causal relationships
4. Clinical significance
      `
    }]
  });
  return response.content;
};
```

### 2. Documentation Enhancement
```typescript
const enhanceDocumentation = async (section: keyof SymptomAnalysisRequest, content: any) => {
  const promptMap = {
    general: generalNotesPrompt,
    physical: physicalSymptomsPrompt,
    cognitive: cognitiveSymptomsPrompt,
    emotional: emotionalSymptomsPrompt
  };

  const response = await anthropic.messages.create({
    model: "claude-3-sonnet",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: promptMap[section](content)
    }]
  });
  return response.content;
};
```

### 3. Clinical Summary Generation
```typescript
const generateClinicalSummary = async (symptoms: SymptomAnalysisRequest) => {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet",
    max_tokens: 1500,
    messages: [{
      role: "user",
      content: `Generate a clinical summary of these symptoms:
${JSON.stringify(symptoms, null, 2)}

Include:
1. Primary symptom clusters
2. Severity patterns
3. Impact on function
4. Suggested follow-up assessments
      `
    }]
  });
  return response.content;
};
```

## Usage Guidelines

### 1. When to Use AI Enhancement
- After initial symptom entry
- Before section completion
- When patterns need analysis
- For terminology standardization

### 2. Review Process
1. Submit symptoms for analysis
2. Review AI suggestions
3. Accept/modify enhancements
4. Validate clinical accuracy
5. Update documentation

### 3. Error Handling
```typescript
const handleAPIError = async (error: Error, section: string) => {
  console.error(`API Error in ${section}:`, error);
  // Log error details
  // Handle retry logic
  // Provide user feedback
};
```

## Testing API Integration

### 1. Mock API Responses
```typescript
export const mockSymptomAnalysis = {
  general: {
    patterns: [...],
    suggestions: [...],
    terminology: [...]
  },
  // Other sections...
};
```

### 2. Test Cases
```typescript
describe('API Integration', () => {
  it('enhances symptom documentation', async () => {
    const symptoms = {...};  // Test data
    const enhanced = await enhanceDocumentation('physical', symptoms);
    expect(enhanced).toMatchSnapshot();
  });
});
```

## Best Practices

1. API Calls
- Use consistent error handling
- Implement retry logic
- Monitor response times
- Cache where appropriate

2. Prompt Engineering
- Be specific about requirements
- Include context
- Request structured responses
- Validate terminology

3. Data Handling
- Validate before sending
- Sanitize responses
- Maintain data types
- Handle nulls/undefined

4. Testing
- Mock API responses
- Test error cases
- Verify data transformations
- Check response handling