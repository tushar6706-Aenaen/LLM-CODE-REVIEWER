import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const apiDesignRule: Rule = {
  name: 'api-design',
  description: 'Checks API design best practices',
  severity: 'low',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for proper HTTP status codes
    const statusCodePattern = /\.status\s*\(\s*(\d+)\s*\)/;
    lines.forEach((line, index) => {
      const match = line.match(statusCodePattern);
      if (match) {
        const statusCode = parseInt(match[1], 10);
        if (statusCode < 100 || statusCode > 599) {
          violations.push({
            rule: 'api-design',
            severity: 'low',
            message: `Invalid HTTP status code: ${statusCode}`,
            line: index + 1,
            recommendation: 'Use valid HTTP status codes (100-599)',
          });
        }
      }
    });

    // Check for consistent response format
    const hasConsistentResponse = /res\.(json|send)\s*\(/.test(code);
    if (!hasConsistentResponse) {
      violations.push({
        rule: 'api-design',
        severity: 'low',
        message: 'Consider using consistent response format (res.json())',
        recommendation: 'Use consistent response format across all endpoints',
      });
    }

    return violations;
  },
};

