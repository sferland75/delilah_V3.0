# Next Developer Guide - Delilah V3.0

## Project Status (February 2025)
We are implementing a hybrid approach for report generation:
1. **Anthropic API** - for complex narrative sections requiring clinical reasoning
2. **Agents** - for structured data formatting (e.g., demographics, tables)

## Implementation Progress
- ✅ Demographics section - Using agent for structured formatting
- ✅ Medical History section - Using Anthropic API for narrative
- 🚧 Purpose & Methodology - Next section to implement

## Implementation Strategy
1. Working through sections sequentially per CONFIG.SECTIONS
2. For each section:
   - Implement basic functionality
   - Create tests
   - Verify tests pass
3. After all sections:
   - UI integration
   - Real data testing
   - End-to-end testing

## Architecture
### API Integration
```typescript
// src/sections/[section-name]/generate.ts
export async function generate[Section]Narrative(data: [SectionType]) {
  const prompt = `...`; // Section-specific prompt
  return await generateWithClaude(prompt, {
    cacheKey: `section-${JSON.stringify(data)}`
  });
}
```

### Testing
- Each section has its own test file
- Tests verify prompt formatting and data handling
- Mocks Claude API responses

## Key Files & Documentation
### Configuration
- `/src/config.ts` - Section definitions and settings
- `/src/services/claude.ts` - Anthropic API integration

### Documentation
- `/docs/` - Detailed documentation directory
- `README.md` - Project overview
- `SETUP.md` - Development environment setup

### Testing
- `run_tests.bat` - Run all tests
- Individual section test batch files (e.g., `run_medical_history_tests.bat`)

## Next Steps
1. Implement Purpose & Methodology section
2. Continue section-by-section implementation
3. Complete all sections with tests
4. Begin UI integration and real data testing

## Test Coverage
Current test status:
- 47 tests passing
- 70 tests to be addressed
- Focus on section-by-section fixes

## Environment Setup
1. Ensure `.env` contains `NEXT_PUBLIC_ANTHROPIC_API_KEY`
2. Run `npm install`
3. Use section-specific test files during development

## Development Guidelines
1. Follow established pattern for each section:
   - Create section directory in `/src/sections/`
   - Implement generate.ts
   - Create test file
   - Verify tests pass

2. Choose approach based on section type:
   - Use Anthropic API for narrative sections
   - Use agents for structured data formatting

3. Testing Requirements:
   - Write tests before implementation
   - Verify prompt formatting
   - Test empty/invalid data handling

## Reference Documentation
1. `/docs/section-patterns.md` - Section implementation patterns
2. `/docs/testing-strategy.md` - Testing approach and guidelines
3. `/docs/api-integration.md` - Anthropic API integration details

## Getting Help
1. Review existing section implementations
2. Check documentation
3. Run relevant test files
4. Study CONFIG.SECTIONS for section structure

Remember: Focus on one section at a time, ensure tests pass, then move to the next section. UI integration and real data testing will follow completion of all sections.