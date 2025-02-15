# Delilah V3.0 Setup Guide

## Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/delilah.git
cd delilah

# Switch to V3 branch
git checkout v3-restructure

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

## Branch Structure

- `main` - Original Delilah codebase
- `v3-restructure` - Clean, reorganized V3.0 implementation

## Development Workflow

1. Always work from `v3-restructure` branch
2. Create feature branches for new sections:
```bash
git checkout -b feature/section-name
```

3. Follow section implementation pattern:
```bash
# Create section directory
mkdir -p src/sections/N-SectionName/{components,tests}

# Start development
code src/sections/N-SectionName
```

4. Commit changes with conventional commits:
```bash
git commit -m "feat(section-name): implement base structure"
git commit -m "test(section-name): add component tests"
git commit -m "docs(section-name): add documentation"
```

5. Push changes and create PR:
```bash
git push origin feature/section-name
# Create PR through GitHub interface
```

## Important Commands

```bash
# Update from remote
git pull origin v3-restructure

# Create new feature branch
git checkout -b feature/section-name

# Stage changes
git add .

# Commit with conventional commit
git commit -m "type(scope): description"

# Push changes
git push origin feature/section-name
```

## Commit Types

- `feat`: New feature or enhancement
- `fix`: Bug fix
- `docs`: Documentation only changes
- `test`: Adding missing tests
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Changes that do not affect the meaning of the code
- `chore`: Changes to the build process or auxiliary tools

## Working Across Machines

1. Push all changes before switching:
```bash
git push origin v3-restructure
```

2. On new machine:
```bash
git clone https://github.com/yourusername/delilah.git
cd delilah
git checkout v3-restructure
npm install
```

## Environmental Setup

1. Copy environment template:
```bash
cp .env.example .env
```

2. Required environment variables:
```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here
# Add other required variables
```

## Testing Setup

```bash
# Run all tests
npm test

# Run specific section tests
npm test src/sections/1-DemographicsAndHeader

# Run with coverage
npm test -- --coverage
```

## Documentation Updates

1. Always update documentation with code changes
2. Follow established patterns in `docs/`
3. Update knowledge graph
4. Keep QUICKSTART.md and REFERENCE_POINTS.md up to date

## CI/CD

- All PRs must pass tests
- Maintain minimum 80% test coverage
- Follow conventional commits
- Update documentation
- Include knowledge graph updates

Remember: V3 is our clean slate. Maintain the structure and patterns established in the Demographics section.