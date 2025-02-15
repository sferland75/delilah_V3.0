# Delilah V3.0 Quick Start Guide

## 🎯 Development Focus
We maintain absolute consistency across all sections. The Demographics section (1-DemographicsAndHeader) is our reference implementation - **follow it exactly**.

## 🚀 Getting Started

### 1. First Steps
```bash
# Clone and setup
git clone [repo]
cd delilah_V3.0
npm install

# Open reference implementation
code src/sections/1-DemographicsAndHeader
```

### 2. Creating a New Section
```bash
# Create directory structure (replace N with section number)
mkdir -p src/sections/N-SectionName/{components,tests}
touch src/sections/N-SectionName/{index.tsx,schema.ts,prompts.ts}
```

## 📋 Development Checklist

### 1. Base Structure (Day 1)
- [ ] Copy schema.ts pattern from Demographics
- [ ] Create basic index.tsx with tabs
- [ ] Set up component shells
- [ ] Write initial tests

### 2. Form Implementation (Day 2)
- [ ] Implement form components
- [ ] Add Zod validation
- [ ] Set up error handling
- [ ] Add accessibility features

### 3. Display Mode (Day 2)
- [ ] Create display component
- [ ] Implement view layouts
- [ ] Add formatting utilities
- [ ] Test view modes

### 4. Prompt Integration (Day 3)
- [ ] Copy prompts.ts pattern
- [ ] Customize templates
- [ ] Add data formatting
- [ ] Test with Claude

### 5. Testing & Documentation (Day 4)
- [ ] Complete test coverage
- [ ] Write documentation
- [ ] Update knowledge graph
- [ ] Final review

## 🎯 Key Principles

1. **NO DEVIATION** from established patterns
2. **COPY** Demographics section structure exactly
3. **MAINTAIN** documentation as you go
4. **UPDATE** knowledge graph with changes

## 🔍 Quick Reference

### File Structure
```
N-SectionName/
├── components/
│   ├── Form.tsx
│   ├── Display.tsx
│   └── [SubComponents].tsx
├── tests/
│   └── [Component].test.tsx
├── index.tsx
├── schema.ts
└── prompts.ts
```

### Required Tests
```typescript
// Component test template
describe('ComponentName', () => {
  it('renders in edit mode', () => {});
  it('renders in view mode', () => {});
  it('handles validation', () => {});
  it('manages state', () => {});
  it('processes updates', () => {});
});
```

### Knowledge Graph Update
```typescript
// Required entity creation
createEntities([{
  name: "SectionName_V3",
  entityType: "Assessment Section",
  observations: [
    "Implements standard section pattern",
    "Uses shadcn/ui components",
    "Includes Zod validation",
    "Features Claude integration"
  ]
}]);

// Required relationships
createRelations([{
  from: "SectionName_V3",
  to: "ValidationSystem_V3",
  relationType: "implements"
}]);
```

## 🚫 Common Mistakes

1. Creating new patterns - **DON'T**
2. Skipping tests - **DON'T**
3. Ignoring documentation - **DON'T**
4. Missing knowledge graph updates - **DON'T**

## 🔗 Quick Links

1. Reference Implementation: `/src/sections/1-DemographicsAndHeader`
2. Development Guide: `/docs/DEVELOPMENT_GUIDE.md`
3. Test Patterns: `/src/sections/1-DemographicsAndHeader/tests`
4. Prompt Templates: `/src/sections/1-DemographicsAndHeader/prompts.ts`

## 📅 Development Timeline

A section should take **4 days maximum**:
- Day 1: Structure & Schema
- Day 2: Forms & Display
- Day 3: Prompts & Integration
- Day 4: Testing & Documentation

## ⚡ Commands to Remember

```bash
# Development
npm run dev           # Start development server
npm run test         # Run tests
npm run test:watch   # Watch mode for section tests

# Testing
npm run test src/sections/N-SectionName  # Test specific section
npm run coverage     # Check test coverage

# Documentation
npm run docs         # Generate documentation
```

## 🆘 Need Help?

1. Check Demographics implementation first
2. Review DEVELOPMENT_GUIDE.md
3. Check knowledge graph for patterns
4. Ask for code review early

Remember: The goal is consistency and reliability. When in doubt, copy the Demographics section patterns exactly.