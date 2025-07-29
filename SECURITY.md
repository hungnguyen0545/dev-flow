# Security Guide - Secret Management

This document explains how GitHub detects secrets and how to prevent accidentally exposing sensitive information in your commits.

## 🔍 How GitHub Detects Secrets

### 1. **GitGuardian Integration**

- GitHub partners with GitGuardian to scan all public repositories
- Automatically detects API keys, tokens, passwords, and other sensitive data
- Uses pattern recognition to identify common secret formats

### 2. **Built-in Secret Scanning**

- Scans for known patterns from popular services (AWS, Google Cloud, etc.)
- Detects secrets in real-time during pushes and pull requests
- Uses regex patterns to identify common secret formats

### 3. **Pre-commit Hooks**

- We've set up Husky hooks to scan before commits
- Checks for .env files, credential files, and potential secrets
- Prevents accidental commits of sensitive data

## 🛡️ Our Protection Setup

### 1. **Pre-commit Hooks (Husky)**

We've configured Husky to run secret checks before every commit:

```bash
# The hook runs automatically on every commit
git commit -m "your message"

# Or run manually
npm run check-secrets
```

### 2. **Secret Scanning Script**

We provide a comprehensive secret scanning script:

```bash
# Run the secret scanner
npm run check-secrets
```

This script checks for:

- `.env` files
- Credential files (`.pem`, `.key`, `.p12`, `.pfx`)
- Service account keys (`credentials.json`, `service-account-key.json`)
- Potential secrets in code

### 3. **Git Ignore Protection**

Our `.gitignore` excludes:

- Environment files (`.env*`)
- Private keys (`*.pem`, `*.key`)
- Credential files (`credentials.json`, `service-account-key.json`)
- Database files (`*.db`, `*.sqlite`)

## 🚨 What to Do If Secrets Are Exposed

### Immediate Actions

1. **Revoke the exposed secret immediately**
2. **Remove from git history** (if caught early)
3. **Notify team members**
4. **Update the secret** in all environments

### Removing from Git History

If you accidentally commit a secret:

```bash
# Remove from last commit (if not pushed)
git reset --soft HEAD~1

# Remove from git history (if already pushed)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (use with caution)
git push origin --force --all
```

## 📋 Best Practices

### Environment Variables

✅ **Good:**

```bash
# .env.local (not committed)
DATABASE_URL=mongodb://localhost:27017/devflow
JWT_SECRET=your-secret-here
```

❌ **Bad:**

```javascript
// Hardcoded in code
const apiKey = "sk-1234567890abcdef";
```

### Configuration Files

✅ **Good:**

```javascript
// config/database.js
const config = {
  url: process.env.DATABASE_URL,
  // ...
};
```

❌ **Bad:**

```javascript
// Hardcoded credentials
const config = {
  username: "admin",
  password: "secret123",
  // ...
};
```

### API Keys

✅ **Good:**

```javascript
// Use environment variables
const apiKey = process.env.API_KEY;
```

❌ **Bad:**

```javascript
// Hardcoded API key
const apiKey = "sk-1234567890abcdef";
```

## 🔍 Manual Checks

Before committing, always check:

1. **No .env files** in your changes
2. **No hardcoded secrets** in code
3. **No credential files** in repository
4. **No private keys** or certificates

### Quick Check Commands

```bash
# Check for .env files
find . -name ".env*" -type f

# Check for potential secrets in code
grep -r -i -E "(api_key|password|secret|token)" . --exclude-dir=node_modules

# Check for credential files
find . -name "*.pem" -o -name "*.key" -o -name "credentials.json"

# Run our automated check
npm run check-secrets
```

## 🔄 Regular Security Reviews

- Run secret scans weekly: `npm run check-secrets`
- Review access permissions monthly
- Update dependencies regularly
- Monitor GitHub security alerts

## 📞 Emergency Contacts

If you discover a security issue:

1. **Immediate**: Revoke any exposed credentials
2. **Notify**: Contact the development team
3. **Document**: Update this security guide if needed
4. **Review**: Conduct a security review of the codebase

---

**Remember**: When in doubt, treat any credential or configuration as sensitive and use environment variables or secure secret management systems.
