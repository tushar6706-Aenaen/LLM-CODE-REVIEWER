import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const corsRule: Rule = {
  name: 'cors-misconfiguration',
  description: 'Detects CORS misconfiguration',
  severity: 'high',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for CORS configuration
    const corsPattern = /cors\s*\(/i;
    const wildcardPattern = /origin\s*:\s*['"]\*['"]/i;
    const credentialsWithWildcard = /credentials\s*:\s*true/i;

    const hasCors = corsPattern.test(code);
    const hasWildcard = wildcardPattern.test(code);
    const hasCredentials = credentialsWithWildcard.test(code);

    if (hasCors) {
      if (hasWildcard) {
        violations.push({
          rule: 'cors-misconfiguration',
          severity: 'high',
          message: 'CORS is configured with wildcard origin (*), which allows all origins',
          recommendation: 'Specify allowed origins explicitly instead of using wildcard',
        });
      }

      if (hasWildcard && hasCredentials) {
        violations.push({
          rule: 'cors-misconfiguration',
          severity: 'critical',
          message: 'CORS is configured with wildcard origin and credentials enabled, which is a security risk',
          recommendation: 'Never use wildcard origin with credentials. Specify allowed origins explicitly',
        });
      }
    } else {
      violations.push({
        rule: 'cors-misconfiguration',
        severity: 'low',
        message: 'CORS middleware is not configured. This may cause CORS errors in production',
        recommendation: 'Configure CORS middleware with appropriate origin settings',
      });
    }

    return violations;
  },
};

