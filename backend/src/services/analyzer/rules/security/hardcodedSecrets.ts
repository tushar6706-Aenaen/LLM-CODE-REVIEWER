import traverse from '@babel/traverse';
import { Rule, Violation } from '../../types';

// Common patterns for secrets and credentials
const SECRET_PATTERNS = [
  /password\s*[:=]\s*['"](.+?)['"]/i,
  /api[_-]?key\s*[:=]\s*['"](.+?)['"]/i,
  /secret\s*[:=]\s*['"](.+?)['"]/i,
  /token\s*[:=]\s*['"](.+?)['"]/i,
  /auth[_-]?token\s*[:=]\s*['"](.+?)['"]/i,
  /access[_-]?token\s*[:=]\s*['"](.+?)['"]/i,
  /private[_-]?key\s*[:=]\s*['"](.+?)['"]/i,
  /database[_-]?password\s*[:=]\s*['"](.+?)['"]/i,
  /db[_-]?pass\s*[:=]\s*['"](.+?)['"]/i,
  /mongodb[_-]?uri\s*[:=]\s*['"](.+?)['"]/i,
];

const ENV_VAR_PATTERNS = [
  /process\.env\.\w+/i,
];

export const hardcodedSecretsRule: Rule = {
  name: 'hardcoded-secrets',
  description: 'Detects hardcoded secrets, passwords, API keys, and credentials',
  severity: 'critical',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for hardcoded secrets in code
    lines.forEach((line, index) => {
      SECRET_PATTERNS.forEach((pattern) => {
        if (pattern.test(line)) {
          // Check if it's using environment variables (acceptable)
          if (!ENV_VAR_PATTERNS.some((envPattern) => envPattern.test(line))) {
            violations.push({
              rule: 'hardcoded-secrets',
              severity: 'critical',
              message: `Hardcoded secret detected: ${line.trim().substring(0, 50)}`,
              line: index + 1,
              recommendation: 'Use environment variables (process.env) instead of hardcoding secrets',
            });
          }
        }
      });
    });

    return violations;
  },
};

