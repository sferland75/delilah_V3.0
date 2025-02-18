# Delilah V3.0

## Overview
Delilah V3.0 is a comprehensive medical assessment tool designed to streamline patient care documentation and analysis. The system provides structured assessment modules for various aspects of patient care, from demographics to specialized medical evaluations.

## Current Status
- Demographics section: Testing in progress
  - Personal component: Base tests complete
  - Contact component: Pending
  - Insurance/Legal components: Pending
- Medical History: Next section for implementation
- Other sections: Pending

## Project Structure
```
delilah_V3.0/
├── docs/                   # Project documentation
│   ├── DEVELOPMENT_GUIDE.md   # Development patterns
│   ├── TESTING_GUIDE.md      # Testing strategy
│   ├── QUICKSTART.md         # Quick setup guide
│   └── REFERENCE_POINTS.md   # Implementation references
├── src/
│   ├── app/               # Core application
│   ├── components/        # Shared UI components
│   ├── contexts/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Core libraries
│   ├── narrative/        # Narrative generation
│   ├── sections/         # Assessment sections
│   │   ├── 1-DemographicsAndHeader/
│   │   │   ├── components/     # Section components
│   │   │   ├── tests/         # Component tests
│   │   │   ├── index.tsx      # Main section
│   │   │   └── schema.ts      # Validation
│   │   └── 3-MedicalHistory/
│   ├── services/         # External services
│   ├── test/            # Test utilities
│   └── utils/           # Utility functions
└── config files         # Configuration
```

## Assessment Sections
1. Demographics and Header (In Progress)
   - Personal Information ✅
   - Contact Information 🚧
   - Insurance Details 🚧
   - Legal Information 🚧
2. Initial Assessment (Pending)
3. Medical History (Next)
4. Functional Status
5. Specialized Assessments
6. Housekeeping Calculator
7. Environmental Assessment
8. Activities of Daily Living
9. Attendant Care
10. AMA Guides Assessment

## Getting Started
1. Clone repository
```bash
git clone https://github.com/sferland75/delilah_V3.0.git
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Run tests
```bash
# All tests
npm test

# Specific section
npm test src/sections/1-DemographicsAndHeader

# With coverage
npm test -- --coverage
```

## Development Process
1. Follow patterns in Demographics section
2. Write tests first (TDD)
3. Meet coverage requirements (80%)
4. Update documentation
5. Update knowledge graph

## Testing
- Follow [Testing Guide](docs/TESTING_GUIDE.md)
- Use established mock patterns
- Maintain coverage thresholds
- Test structure before interactions

## Documentation
- Development Guide: Implementation patterns
- Testing Guide: Test strategy and patterns
- QuickStart: Fast setup guide
- Reference Points: Example implementations

## Contributing
1. Clone repository
2. Create feature branch
3. Follow development patterns
4. Write tests
5. Update documentation
6. Submit PR

## Resources
- Development Guide
- Testing Guide
- Knowledge Graph
- Component Library

## Next Steps
1. Complete Demographics tests
2. Implement Medical History
3. Expand test coverage
4. Add E2E tests