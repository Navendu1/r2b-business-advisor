# Contributing to R2B Venture Architect

Thank you for your interest in contributing! Here's how you can help.

## Code of Conduct

Be respectful, inclusive, and professional. All contributors are expected to adhere to this standard.

## How to Contribute

### 1. **Report Bugs**
- Check existing issues first
- Use the bug report template
- Include reproducible steps and expected vs actual behavior

### 2. **Suggest Features**
- Use the feature request template
- Explain the use case and expected benefit
- Provide examples if helpful

### 3. **Submit Code**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature X"`
5. Push to your fork: `git push origin feature/your-feature`
6. Create a Pull Request with description

### 4. **Improve Documentation**
- Fix typos, unclear explanations
- Add examples or diagrams
- Improve API documentation
- Contribute to guides or tutorials

## Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/r2b-business-advisor.git
cd r2b-business-advisor

# Install dependencies
pip install -r requirements.txt

# Run tests
python test_integration.py

# Run in interactive mode
python orchestrator.py
```

## Code Standards

- Follow PEP 8 style guide
- Add docstrings to functions and classes
- Use type hints where possible
- Write clear, descriptive commit messages
- Test your changes before submitting

## Testing

```bash
# Run integration tests
python test_integration.py

# Test with sample profiles
python orchestrator.py profiles/alice_profile.yaml
python orchestrator.py profiles/bob_profile.yaml
```

## Pull Request Guidelines

- Link related issues
- Provide clear description of changes
- Include any breaking changes prominently
- Update documentation if needed
- Ensure tests pass

## Questions?

Create a discussion or open an issue with your question. We're here to help!

---

Thank you for contributing to R2B! 🚀
