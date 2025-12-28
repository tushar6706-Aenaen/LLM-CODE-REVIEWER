# Security & Architecture Rules

This document describes all the rules implemented in the static analysis engine.

## Security Rules

### 1. Hardcoded Secrets (`hardcoded-secrets`)
- **Severity:** Critical
- **Description:** Detects hardcoded passwords, API keys, tokens, and other secrets in code
- **Patterns Detected:**
  - `password = "..."`, `api_key = "..."`, `secret = "..."`, etc.
  - Database connection strings with credentials
- **Recommendation:** Use environment variables (`process.env`) instead

### 2. SQL Injection (`sql-injection`)
- **Severity:** High
- **Description:** Detects potential SQL injection vulnerabilities
- **Patterns Detected:**
  - Template literals with expressions in database queries
  - String concatenation in query construction
- **Recommendation:** Use parameterized queries or prepared statements

### 3. XSS Vulnerability (`xss-vulnerability`)
- **Severity:** High
- **Description:** Detects potential Cross-Site Scripting (XSS) vulnerabilities
- **Patterns Detected:**
  - `innerHTML`, `outerHTML`, `insertAdjacentHTML` with user input
  - `document.write()` usage
  - `res.send()` with potentially unsanitized user input
- **Recommendation:** Sanitize user input or use `textContent` instead of `innerHTML`

### 4. Missing Authentication (`missing-authentication`)
- **Severity:** High
- **Description:** Detects route handlers without authentication middleware
- **Patterns Detected:**
  - Route definitions without authentication/authorization middleware
- **Recommendation:** Add authentication middleware to protect routes

### 5. Missing Input Validation (`missing-input-validation`)
- **Severity:** Medium
- **Description:** Detects use of user input without validation
- **Patterns Detected:**
  - Direct access to `req.body`, `req.query`, `req.params` without validation
- **Recommendation:** Add input validation middleware (express-validator, joi, zod, etc.)

### 6. Missing Rate Limiting (`missing-rate-limiting`)
- **Severity:** Medium
- **Description:** Detects missing rate limiting middleware
- **Patterns Detected:**
  - Routes defined without rate limiting middleware
- **Recommendation:** Add rate limiting middleware (express-rate-limit) to protect API endpoints

### 7. CORS Misconfiguration (`cors-misconfiguration`)
- **Severity:** High/Critical
- **Description:** Detects CORS misconfigurations
- **Patterns Detected:**
  - Wildcard origin (`*`) usage
  - Wildcard origin with credentials enabled (critical)
  - Missing CORS configuration
- **Recommendation:** Specify allowed origins explicitly, never use wildcard with credentials

### 8. Insecure HTTP Headers (`insecure-http-headers`)
- **Severity:** Medium
- **Description:** Detects missing security headers
- **Patterns Detected:**
  - Missing security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **Recommendation:** Use helmet middleware to set security headers automatically

### 9. Unsafe Deserialization (`unsafe-deserialization`)
- **Severity:** Critical/High/Medium
- **Description:** Detects unsafe deserialization practices
- **Patterns Detected:**
  - `eval()` usage (critical)
  - `Function()` constructor with user input (high)
  - `JSON.parse()` with unvalidated user input (medium)
- **Recommendation:** Never use `eval()`, validate input before parsing

## Architecture Rules

### 10. Code Organization (`code-organization`)
- **Severity:** Low
- **Description:** Checks code organization and structure
- **Patterns Detected:**
  - Very long files (> 500 lines)
  - High nesting levels (> 5 levels)
- **Recommendation:** Split large files, reduce nesting by extracting functions

### 11. Error Handling (`error-handling`)
- **Severity:** Medium
- **Description:** Checks error handling patterns
- **Patterns Detected:**
  - Database operations without try-catch blocks
  - Improper async/await usage
- **Recommendation:** Wrap database operations in try-catch, ensure proper async handling

### 12. API Design (`api-design`)
- **Severity:** Low
- **Description:** Checks API design best practices
- **Patterns Detected:**
  - Invalid HTTP status codes
  - Inconsistent response formats
- **Recommendation:** Use valid status codes, maintain consistent response format

### 13. Middleware Usage (`middleware-usage`)
- **Severity:** Low
- **Description:** Checks middleware usage patterns
- **Patterns Detected:**
  - Incorrect middleware order (body parser after routes)
- **Recommendation:** Register middleware in correct order

## Scoring System

Violations are penalized based on severity:
- **Critical:** -20 points
- **High:** -10 points
- **Medium:** -5 points
- **Low:** -2 points

Final score = max(0, 100 - total penalty)

## Rule Engine Architecture

The rule engine:
1. Parses code to AST using Babel parser
2. Traverses AST to detect patterns
3. Runs all registered rules
4. Aggregates violations
5. Calculates security score
6. Returns structured results

