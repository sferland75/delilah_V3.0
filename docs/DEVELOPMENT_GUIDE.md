# Delilah V3.0 Development Guide

## Section Implementation Pattern

Using the Demographics section as our template, each assessment section should follow this implementation pattern:

### 1. Directory Structure
```
section-name/
├── components/           # Form and display components
├── tests/               # Component and integration tests
├── index.tsx            # Main section component
├── schema.ts           # Zod validation & types
├── prompts.ts          # Claude prompt templates
└── docs/               # Section documentation
```

### 2. Required Components
- Main section container (edit/view modes)
- Form components (subsections)
- Display component (view mode)
- Validation schema
- Prompt templates
- Tests for all components

### 3. Features Checklist
- [ ] Form validation with Zod
- [ ] TypeScript type safety
- [ ] Auto-save functionality
- [ ] Error handling
- [ ] Accessibility support
- [ ] Test coverage
- [ ] Claude integration
- [ ] Documentation

### 4. Documentation Requirements
- README.md (overview)
- IMPLEMENTATION.md (technical details)
- PROMPTS.md (Claude integration)
- Component documentation
- Test documentation

### 5. Testing Standards
- Component rendering tests
- Form validation tests
- User interaction tests
- Error handling tests
- Prompt generation tests
- Integration tests

### 6. Prompt Lab Integration
- Brief/Standard/Detailed templates
- Data formatting utilities
- Clear guidelines structure
- Professional tone
- Error handling

## Development Workflow

1. Structure Setup
   - Create directory structure
   - Set up basic components
   - Define types and schema

2. Component Development
   - Implement form components
   - Add validation
   - Create display component
   - Add error handling

3. Testing
   - Write component tests
   - Add integration tests
   - Test edge cases
   - Verify accessibility

4. Prompt Integration
   - Create prompt templates
   - Implement data formatting
   - Test with Claude API
   - Verify output quality

5. Documentation
   - Update section docs
   - Add implementation details
   - Document prompt system
   - Update knowledge graph

6. Review & Refinement
   - Code review
   - Testing review
   - Documentation review
   - Performance optimization

## Quality Standards

### Code Quality
- TypeScript strict mode enabled
- ESLint rules followed
- Prettier formatting
- Error boundaries implemented
- Performance optimizations
- No any types
- Proper type exports

### Testing Standards
- Jest + Testing Library
- Minimum 80% coverage
- Unit tests for all components
- Integration tests for flows
- Edge case coverage
- Accessibility testing
- Performance testing

### Documentation Standards
- Clear and concise
- Code examples
- Implementation details
- Usage instructions
- Edge cases noted
- Known limitations
- Dependencies listed

### Accessibility Standards
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Proper ARIA labels
- Color contrast
- Focus management
- Error announcements

### Performance Standards
- Load time < 1s
- No unnecessary re-renders
- Efficient form handling
- Optimized state updates
- Memoization where needed
- Code splitting
- Bundle size optimization

## Prompt Lab Standards

### Template Structure
```typescript
export const sectionPrompts = {
  brief: {
    template: string;
    guidelines: string[];
    format: string;
  };
  standard: {/* ... */};
  detailed: {/* ... */};
};
```

### Data Formatting
```typescript
export function formatSectionData(data: SectionData): string {
  // Consistent formatting
  // Handle missing data
  // Clear structure
  // Professional terminology
}
```

### Implementation Requirements
1. Clear prompt structure
2. Professional guidelines
3. Error handling
4. Data validation
5. Consistent formatting
6. Testing coverage

## Knowledge Graph Management

### Entity Creation
```typescript
createEntities([{
  name: "SectionName_V3",
  entityType: "Assessment Section",
  observations: [
    "Implementation details",
    "Features",
    "Standards met"
  ]
}]);
```

### Relationship Definition
```typescript
createRelations([{
  from: "SectionName_V3",
  to: "SubsystemName_V3",
  relationType: "contains|uses|implements"
}]);
```

### Documentation Integration
- Link to implementation docs
- Track dependencies
- Note design decisions
- Record testing patterns
- Document prompt systems

## Maintenance Guidelines

### Code Maintenance
1. Regular dependency updates
2. Performance monitoring
3. Error tracking
4. Test suite maintenance
5. Documentation updates

### Quality Assurance
1. Automated testing
2. Manual verification
3. Accessibility audits
4. Performance profiling
5. Code reviews

### Documentation Updates
1. Keep docs in sync with code
2. Update examples
3. Track changes
4. Version documentation
5. Maintain knowledge graph

## Development Tools

### Required
- VS Code
- TypeScript
- ESLint
- Prettier
- Jest
- Testing Library
- Zod
- shadcn/ui

### Recommended Extensions
- ESLint
- Prettier
- Jest Runner
- TypeScript Hero
- Error Lens
- Auto Import

## Getting Started

1. Clone the repository
2. Install dependencies
3. Read documentation
4. Set up development tools
5. Review existing sections
6. Follow implementation pattern

## Tips for Success

1. Follow the pattern strictly
2. Document as you go
3. Write tests first
4. Keep components focused
5. Maintain type safety
6. Consider accessibility
7. Optimize performance
8. Update knowledge graph

## Common Pitfalls

1. Skipping documentation
2. Insufficient testing
3. Poor type definitions
4. Missing error handling
5. Accessibility oversights
6. Performance issues
7. Inconsistent formatting

## Support and Resources

- Project documentation
- Knowledge graph
- Team guidelines
- Code reviews
- Technical support
- Development tools

Remember: The Demographics section serves as our reference implementation. When in doubt, refer to its structure and patterns.