# Security Policy

## Reporting Security Issues

**Please do NOT open a public issue for security vulnerabilities.**

Instead, email your findings to: **[your-security-email@example.com]**

Include:
- Description of the vulnerability
- Steps to reproduce (if possible)
- Potential impact
- Suggested fix (if any)

We will:
1. Acknowledge receipt within 48 hours
2. Investigate and confirm the vulnerability
3. Work on a fix in private
4. Release a patch and credit you (if desired)

---

## Security Best Practices

### For Users

- ✅ Keep Python updated to the latest version
- ✅ Use virtual environments to isolate dependencies
- ✅ Review generated DPRs before sharing externally
- ✅ Never commit `.env` files with secrets to version control
- ✅ Use `.gitignore` to prevent credential leaks

### For Contributors

- ✅ Validate all user inputs
- ✅ Don't hardcode secrets or API keys
- ✅ Use type hints to catch bugs early
- ✅ Run security linters before submitting PRs
- ✅ Review dependencies in `requirements.txt` for known vulnerabilities

---

## Known Limitations

- This tool does not perform real-time market research; it uses static databases
- Legal analysis is informational only; consult actual legal counsel for compliance
- No guarantee of idea viability; market conditions change rapidly
- Founder profiles are stored locally; implement your own encryption if sensitive

---

## Dependency Security

We monitor dependencies for CVEs using:
```bash
pip install safety
safety check
```

Report any vulnerable dependencies to the maintainers immediately.

---

## Questions?

Contact: **[your-security-email@example.com]**
