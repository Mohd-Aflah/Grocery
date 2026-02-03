# Contributing to Abdul Rasheed Grocery Website

First off, thank you for considering contributing to Abdul Rasheed Grocery's website! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by respect, kindness, and professionalism. Please be respectful and constructive in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Clear description** of the enhancement
- **Use cases** and benefits
- **Mockups or examples** if applicable

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Issues that need assistance

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Abdul-Rasheed-Grocery.git
   cd Abdul-Rasheed-Grocery
   ```
3. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make your changes** in your feature branch
2. **Test your changes**:
   ```bash
   npm run dev
   ```
3. **Run tests**:
   ```bash
   npm run test
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```
5. **Ensure no lint errors**:
   ```bash
   npm run lint
   ```

## Style Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

- Use functional components with hooks
- Follow the existing component structure
- Keep components in `src/components/`
- Use TypeScript interfaces for props
- Implement proper error handling

### CSS/Styling

- Use **Tailwind CSS** classes
- Follow the existing color scheme
- Ensure responsive design (mobile-first)
- Test in both light and dark modes
- Maintain accessibility standards

### File Organization

```
src/
├── components/     # React components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── lib/            # Utility functions
├── pages/          # Page components
└── assets/         # Images, icons, etc.
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new product category filter
fix: resolve mobile menu closing issue
docs: update installation instructions
style: format code with prettier
refactor: simplify language context logic
test: add tests for Hero component
chore: update dependencies
```

**Examples:**
- `feat: add WhatsApp integration`
- `fix: resolve dark mode toggle issue`
- `docs: update README with deployment steps`

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update the README.md** with details of changes if applicable
5. **Create a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what and why
   - Screenshots for UI changes
   - Reference to related issues

### PR Review Process

- PRs require review before merging
- Address review comments promptly
- Keep discussions respectful and constructive
- Be open to feedback and suggestions

## Language Support

This project supports both English and Arabic:

- Add translations in `LanguageContext.tsx`
- Test UI in both languages
- Ensure RTL (Right-to-Left) layout works properly for Arabic
- Maintain consistent terminology

## Questions?

Feel free to reach out:
- Create an issue with the `question` label
- Contact the maintainer: [@Mohd-Aflah](https://github.com/Mohd-Aflah)

## Recognition

Contributors will be recognized in:
- Project README
- Release notes (for significant contributions)

---

Thank you for contributing to Abdul Rasheed Grocery's website! 🙏

**Mohammed Aflah**  
Project Maintainer
