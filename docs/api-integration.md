# Anthropic API Integration

## Overview
The project uses Anthropic's Claude API for generating narrative sections of OT reports.

## Configuration
```typescript
// src/services/claude.ts
const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
});

const DEFAULT_OPTIONS = {
  maxTokens: 2000,
  temperature: 0.7,
  model: 'claude-3-opus-20240229'
};
```

## Usage
```typescript
const result = await generateWithClaude(prompt, {
  cacheKey: 'unique-key'  // Optional caching
});
```

## Prompt Structure
1. **Context Setting**
   ```
   As an occupational therapist, write a professional [section] for an OT report...
   ```

2. **Data Presentation**
   ```
   [Structured data relevant to section]
   ```

3. **Instructions**
   ```
   Please:
   1. [Specific instructions]
   2. [Formatting requirements]
   3. [Clinical elements to include]
   ```

## Error Handling
- Retry logic for API failures
- Cache for development
- Error reporting

## Response Processing
1. Extract content
2. Format according to section needs
3. Handle error cases

## Development Testing
1. Use caching in development
2. Mock responses in tests
3. Verify prompt structures

## Best Practices
1. Structure prompts clearly
2. Include all relevant data
3. Specify clinical requirements
4. Handle errors gracefully
5. Use caching appropriately

## Troubleshooting
1. Check API key configuration
2. Verify prompt formatting
3. Review error messages
4. Check response handling