import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const insecureHeadersRule: Rule = {
  name: 'insecure-http-headers',
  description: 'Detects missing or insecure HTTP security headers',
  severity: 'medium',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for helmet middleware (recommended)
    const hasHelmet = /helmet/i.test(code);

    // Check for security headers
    const securityHeaders = [
      { name: 'X-Content-Type-Options', pattern: /x[_-]?content[_-]?type[_-]?options/i },
      { name: 'X-Frame-Options', pattern: /x[_-]?frame[_-]?options/i },
      { name: 'X-XSS-Protection', pattern: /x[_-]?xss[_-]?protection/i },
      { name: 'Strict-Transport-Security', pattern: /strict[_-]?transport[_-]?security|hsts/i },
      { name: 'Content-Security-Policy', pattern: /content[_-]?security[_-]?policy|csp/i },
    ];

    if (!hasHelmet) {
      const missingHeaders = securityHeaders.filter(
        (header) => !header.pattern.test(code)
      );

      if (missingHeaders.length > 0) {
        violations.push({
          rule: 'insecure-http-headers',
          severity: 'medium',
          message: `Missing security headers. Consider using helmet middleware or manually setting: ${missingHeaders.map((h) => h.name).join(', ')}`,
          recommendation: 'Use helmet middleware to set security headers automatically',
        });
      }
    }

    return violations;
  },
};

