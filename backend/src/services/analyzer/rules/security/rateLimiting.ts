import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const rateLimitingRule: Rule = {
  name: 'missing-rate-limiting',
  description: 'Detects missing rate limiting middleware',
  severity: 'medium',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for rate limiting middleware
    const rateLimitPatterns = [
      /rate[_-]?limit/i,
      /express[_-]?rate[_-]?limit/i,
      /limiter/i,
      /throttle/i,
    ];

    const hasRateLimit = rateLimitPatterns.some((pattern) => pattern.test(code));

    // Check for route definitions
    const hasRoutes = /app\.(get|post|put|delete|patch)|router\.(get|post|put|delete|patch)/i.test(code);

    if (hasRoutes && !hasRateLimit) {
      violations.push({
        rule: 'missing-rate-limiting',
        severity: 'medium',
        message: 'Rate limiting middleware is not detected. Consider adding rate limiting to protect against abuse',
        recommendation: 'Add rate limiting middleware (express-rate-limit) to protect your API endpoints',
      });
    }

    return violations;
  },
};

