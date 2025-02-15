# Medical History Section Prompt Guide

## Overview
The Medical History section uses Claude AI to generate professional medical-legal narratives from structured form data. This guide outlines the prompt structure, guidelines, and best practices.

## Prompt Types

### Brief Prompt
- Purpose: Quick medical summary and context
- Length: 1-2 sentences
- Focus: Key conditions and current status
- Use Case: Executive summaries, quick references

```
Pre-existing: [Key conditions]
Injury: [Brief description]
Current: [Treatment status]
```

### Standard Prompt
- Purpose: Complete medical information
- Length: 2-3 paragraphs
- Focus: Medical history and treatment
- Use Case: Standard reports and assessments

```
Pre-existing Conditions
Injury Details
Current Treatment Status
```

### Detailed Prompt
- Purpose: Comprehensive medical context
- Length: Multiple paragraphs
- Focus: Complete health information
- Use Case: Detailed assessments, legal reports

```
Complete Medical History
Injury Analysis
Treatment Progression
Current Status & Prognosis
```

## Data Formatting

### Standard Format Structure
```
[Medical History]
Conditions: {conditions}
Status: {status}
Details: {details}
...

[Injury Information]
Date: {date}
Details: {details}
Response: {response}
...

[Treatment Details]
Provider: {provider}
Status: {status}
Progress: {notes}
...
```

### Guidelines for Data Formatting
1. Consistent date formats
2. Clear section headers
3. Logical grouping
4. Handle missing data gracefully
5. Maintain professional terminology

## Prompt Guidelines

### Professional Tone
- Use medical-legal terminology
- Maintain formal language
- Avoid colloquialisms
- Be precise and clear

### Content Organization
1. Start with medical history
2. Follow chronological flow
3. Group related information
4. End with current status

### Writing Style
- Use active voice
- Be concise but thorough
- Maintain professional distance
- Avoid interpretations/diagnoses

## Implementation Details

### Prompt Template Structure
```typescript
export const defaultPrompts = {
  brief: `
    [Template for brief narrative]
  `,
  standard: `
    [Template for standard narrative]
  `,
  detailed: `
    [Template for detailed narrative]
  `
};
```

### Data Processing
```typescript
export function formatMedicalHistoryData(data: MedicalHistory): string {
  // Convert structured data to prompt format
}

export function preparePrompt(data: MedicalHistory, type: PromptType): string {
  // Combine template with formatted data
}
```

## Quality Assurance

### Testing Prompts
1. Verify data formatting
2. Check prompt generation
3. Validate Claude outputs
4. Test edge cases
5. Verify consistency

### Common Issues
- Missing optional data
- Inconsistent formatting
- Unclear instructions
- Ambiguous context

### Best Practices
1. Always include guidelines
2. Use clear section markers
3. Provide context for data
4. Include specific instructions
5. Test with varied data

## Integration Example

```typescript
const data = getMedicalHistoryData();
const formattedData = formatMedicalHistoryData(data);
const prompt = preparePrompt(data, 'standard');
const narrative = await generateWithClaude(prompt);
```