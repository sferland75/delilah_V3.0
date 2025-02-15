# Demographics Section Prompt Guide

## Overview
The Demographics section uses Claude AI to generate professional medical-legal narratives from structured form data. This guide outlines the prompt structure, guidelines, and best practices.

## Prompt Types

### Brief Prompt
- Purpose: Quick identification and context
- Length: 1-2 sentences
- Focus: Client identity and referral source
- Use Case: Executive summaries, quick references

```
Client: John Doe
Referral: Wilson Law (File #789)
Insurance: Test Insurance (Claim #123)
```

### Standard Prompt
- Purpose: Complete client information
- Length: 2-3 paragraphs
- Focus: All essential demographics
- Use Case: Standard reports and assessments

```
Demographics & Personal Information
Insurance Details
Legal Representative Information
```

### Detailed Prompt
- Purpose: Comprehensive client context
- Length: Multiple paragraphs
- Focus: All available information with context
- Use Case: Detailed assessments, legal reports

```
Comprehensive Client Information
Insurance & Claims Details
Legal Context
Family/Household Information
Special Considerations
```

## Data Formatting

### Standard Format Structure
```
[Client Demographics]
Name: {firstName} {lastName}
DOB: {dateOfBirth}
...

[Insurance Information]
Provider: {provider}
Claim #: {claimNumber}
...

[Legal Information]
Representative: {name}
Firm: {firm}
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
1. Start with client identification
2. Follow logical information flow
3. Group related information
4. End with contextual details

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
export function formatDemographicsData(data: Demographics): string {
  // Convert structured data to prompt format
}

export function preparePrompt(data: Demographics, type: PromptType): string {
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
const data = getDemographicsData();
const formattedData = formatDemographicsData(data);
const prompt = preparePrompt(data, 'standard');
const narrative = await generateWithClaude(prompt);
```