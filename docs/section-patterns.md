# Section Implementation Patterns

## Overview
Each report section follows a standardized implementation pattern while accommodating specific needs.

## Section Types
1. **Narrative Sections** (using Anthropic API)
   - Medical History
   - Subjective Information
   - Clinical Reasoning sections

2. **Structured Sections** (using Agents)
   - Demographics
   - Tables/Data presentation
   - Title page elements

## Implementation Pattern
### File Structure
```
/src/sections/[section-name]/
  ├── generate.ts        # Main generation logic
  ├── generate.test.ts   # Tests
  └── types.ts           # Section-specific types
```

### Code Pattern - Narrative Sections
```typescript
// generate.ts
export async function generateNarrative(data: SectionData) {
  const prompt = createPrompt(data);
  return await generateWithClaude(prompt, {
    cacheKey: `section-${JSON.stringify(data)}`
  });
}

// generate.test.ts
describe('generateNarrative', () => {
  it('formats prompt correctly', async () => {
    // Test prompt formatting
  });
  
  it('handles empty data', async () => {
    // Test empty data cases
  });
});
```

### Code Pattern - Structured Sections
```typescript
// Agent implementation for structured data
export class StructuredAgent extends BaseAgent {
  formatData(data: SectionData): string {
    // Format data according to section needs
  }
}
```

## Testing Requirements
1. Prompt formatting verification
2. Empty/invalid data handling
3. API response processing
4. Error cases

## Examples
See:
- `/src/sections/medical-history/` - Narrative example
- `/src/sections/demographics/` - Structured example