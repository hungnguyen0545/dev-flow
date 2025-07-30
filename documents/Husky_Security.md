# Husky Security Guide

This document explains how Husky works in our project and provides step-by-step guidelines for automatic secret scanning.

## 🔧 What is Husky?

Husky is a Git hooks tool that allows you to run scripts automatically before Git operations like commits, pushes, etc. In our project, we use Husky to run secret scanning before every commit to prevent accidentally exposing sensitive information.

## 📁 Project Structure

```
dev_flow/
├── .husky/
│   └── pre-commit          # Git hook that runs before commits
├── scripts/
│   └── check-secrets.js    # Secret scanning script
├── documents/
│   └── Husky_Security.md   # This file
└── package.json            # Husky configuration
```

## 🚀 How Husky Works in Our Source Code

### 1. **Git Hooks Directory**

- Location: [`.husky/`](https://github.com/hungnguyen0545/dev-flow/blob/main/.husky)
- Contains: [`pre-commit`](https://github.com/hungnguyen0545/dev-flow/blob/main/.husky/pre-commit) file
- Purpose: Defines what runs before each commit

### 2. **Pre-commit Hook**

```bash
# .husky/pre-commit
echo "🔍 Running pre-commit checks..."

# Run our secret checking script
npm run check-secrets

# Check for .env files in staged changes
if git diff --cached --name-only | grep -E "\.env"; then
    echo "❌ Error: .env files detected in commit!"
    echo "Please ensure all .env files are in .gitignore"
    exit 1
fi

# Check for credential files in staged changes
if git diff --cached --name-only | grep -E "\.(pem|key|p12|pfx)$|credentials\.json|service-account-key\.json"; then
    echo "❌ Error: Credential files detected in commit!"
    echo "Please ensure all credential files are in .gitignore"
    exit 1
fi

echo "✅ Pre-commit checks passed!"
```

### 3. **Secret Scanning Script**

- Location: [`scripts/check-secrets.js`](https://github.com/hungnguyen0545/dev-flow/blob/main/scripts/check-secrets.js)
- Purpose: Comprehensive secret detection
- Features:
  - Scans for hardcoded API keys, secrets, tokens
  - Checks for `.env` files
  - Detects credential files
  - Bypasses legitimate environment variable usage

### 4. **Package.json Configuration**

```json
{
  "scripts": {
    "check-secrets": "node scripts/check-secrets.js"
  },
  "type": "module"
}
```

## 🔄 Automatic Workflow

### **Step-by-Step Process:**

1. **Developer makes changes**

   ```bash
   # Edit files, add new code, etc.
   ```

2. **Developer stages changes**

   ```bash
   git add .
   ```

3. **Developer commits changes**

   ```bash
   git commit -m "Add new feature"
   ```

4. **Husky automatically triggers pre-commit hook**

   ```bash
   # Husky runs .husky/pre-commit automatically
   ```

5. **Pre-commit hook runs secret scanning**

   ```bash
   # Executes: npm run check-secrets
   # Scans for hardcoded secrets, .env files, credentials
   ```

6. **Result:**
   - ✅ **If no secrets found:** Commit proceeds
   - ❌ **If secrets detected:** Commit blocked with error message

## 🛡️ What Gets Scanned

### **Detected (Blocked):**

- Hardcoded API keys: `const API_KEY = "123456-abcdefg"`
- Hardcoded secrets: `const SECRET = "sk-1234567890"`
- `.env` files in repository
- Credential files: `.pem`, `.key`, `.p12`, `.pfx`
- Service account keys: `credentials.json`, `service-account-key.json`

### **Bypassed (Allowed):**

- Environment variables: `process.env.API_KEY`
- Next.js public env vars: `process.env.NEXT_PUBLIC_*`
- Configuration files in `.gitignore`
- Comments and documentation
- Import/export statements

## 📋 Step-by-Step Setup Guide

### **For New Developers:**

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dev_flow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Husky is automatically set up**
   - The `.husky/` directory is included in the repository
   - Pre-commit hooks are automatically active

4. **Start developing**
   ```bash
   # Make your changes
   git add .
   git commit -m "Your commit message"
   # Secret scanning runs automatically!
   ```

### **For Existing Projects:**

1. **Install Husky**

   ```bash
   npm install --save-dev husky
   ```

2. **Initialize Husky**

   ```bash
   npx husky init
   ```

3. **Create pre-commit hook**

   ```bash
   # Copy the pre-commit content from this project
   ```

4. **Create secret scanning script**
   ```bash
   # Copy scripts/check-secrets.js from this project
   ```

## 🔍 Manual Testing

### **Test Secret Detection:**

```bash
# Run secret scan manually
npm run check-secrets
```

### **Test Pre-commit Hook:**

```bash
# Make a change
echo "const API_KEY = 'test-secret';" >> test.js
git add test.js
git commit -m "Test commit"
# Should be blocked if secrets detected
```

## 🚨 Troubleshooting

### **Pre-commit Hook Not Running:**

1. Check if `.husky/pre-commit` exists and is executable
2. Verify Husky is installed: `npm list husky`
3. Reinstall Husky: `npx husky init`

### **Secret Scanning Not Working:**

1. Check if `scripts/check-secrets.js` exists
2. Verify Node.js is installed: `node --version`
3. Test script manually: `npm run check-secrets`

### **False Positives:**

1. Use environment variables: `process.env.VARIABLE_NAME`
2. Add files to `.gitignore` if they contain secrets
3. Use comments to document legitimate usage

## 📚 Best Practices

### **✅ Good Practices:**

```javascript
// Use environment variables
const apiKey = process.env.API_KEY;
const config = { apiKey: process.env.API_KEY };

// Configuration files in .gitignore
import { config } from "./config/local.js";
```

### **❌ Avoid:**

```javascript
// Hardcoded secrets
const API_KEY = "123456-abcdefg";
const SECRET_TOKEN = "sk-1234567890";
```

## 🔧 Configuration Files

### **`.gitignore` (Enhanced):**

```gitignore
# Environment files
.env*

# Secrets and sensitive files
*.pem
*.key
*.p12
*.pfx
secrets.json
credentials.json
service-account-key.json
```

### **`package.json` (Scripts):**

```json
{
  "scripts": {
    "check-secrets": "node scripts/check-secrets.js"
  },
  "type": "module"
}
```

## 🎯 Summary

Husky provides automatic secret protection by:

1. **Intercepting commits** before they're made
2. **Running secret scans** automatically
3. **Blocking commits** with detected secrets
4. **Providing helpful feedback** to developers

This ensures that no secrets are accidentally committed to the repository, maintaining security without requiring manual intervention.

---

**Remember:** The secret scanning runs automatically on every commit. No need to remember to run manual scans!
