import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const middlewareRule: Rule = {
  name: 'middleware-usage',
  description: 'Checks middleware usage patterns',
  severity: 'low',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for middleware order (body parser should be before routes)
    const bodyParserPattern = /express\.(json|urlencoded)/i;
    const routePattern = /app\.(get|post|put|delete|patch)/i;

    let bodyParserIndex = -1;
    let firstRouteIndex = -1;

    lines.forEach((line, index) => {
      if (bodyParserPattern.test(line) && bodyParserIndex === -1) {
        bodyParserIndex = index;
      }
      if (routePattern.test(line) && firstRouteIndex === -1) {
        firstRouteIndex = index;
      }
    });

    if (firstRouteIndex !== -1 && bodyParserIndex > firstRouteIndex) {
      violations.push({
        rule: 'middleware-usage',
        severity: 'low',
        message: 'Body parser middleware should be registered before route handlers',
        line: firstRouteIndex + 1,
        recommendation: 'Register middleware in the correct order: body parser before routes',
      });
    }

    return violations;
  },
};

