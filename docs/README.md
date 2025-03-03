# Delilah V3.0 Documentation

## Active Documentation

### Core Documents
1. [NEXT_DEVELOPER.md](../NEXT_DEVELOPER.md) - Start here for project orientation
2. [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Test patterns and implementation
3. [api-integration.md](./api-integration.md) - API integration details
4. [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md) - Domain model and data relationships
5. [section-patterns.md](./section-patterns.md) - Section implementation patterns

### Section-Specific Documentation
All section-specific documentation is located within each section's directory:
```
src/sections/[section-name]/
├── IMPLEMENTATION.md  # Implementation details
└── PROMPTS.md        # Section-specific prompts
```

## Documentation Guidelines

1. Keep docs minimal and focused
2. Source code and tests are source of truth
3. Section-specific details belong in section directories
4. Archive outdated docs instead of deleting

## Archived Documentation
Historical documentation is available in the `docs/archive` directory. These documents are kept for reference but should not be used for current development.