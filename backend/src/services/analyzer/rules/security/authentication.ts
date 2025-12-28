import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const authenticationRule: Rule = {
  name: 'missing-authentication',
  description: 'Detects missing authentication/authorization checks',
  severity: 'high',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for route handlers without authentication middleware
    const routePatterns = [
      /app\.(get|post|put|delete|patch)\s*\(/i,
      /router\.(get|post|put|delete|patch)\s*\(/i,
    ];

    const authMiddlewarePatterns = [
      /authenticate/i,
      /auth/i,
      /requireAuth/i,
      /isAuthenticated/i,
      /verifyToken/i,
      /passport\.authenticate/i,
    ];

    routePatterns.forEach((routePattern, routeIndex) => {
      lines.forEach((line, lineIndex) => {
        if (routePattern.test(line)) {
          // Check if authentication middleware is used in the same route definition
          const routeEnd = findRouteEnd(lines, lineIndex);
          const routeBlock = lines.slice(lineIndex, routeEnd).join('\n');

          const hasAuth = authMiddlewarePatterns.some((pattern) =>
            pattern.test(routeBlock)
          );

          if (!hasAuth) {
            violations.push({
              rule: 'missing-authentication',
              severity: 'high',
              message: `Route handler may be missing authentication/authorization middleware`,
              line: lineIndex + 1,
              recommendation: 'Add authentication middleware to protect this route',
            });
          }
        }
      });
    });

    return violations;
  },
};

function findRouteEnd(lines: string[], startIndex: number): number {
  let depth = 0;
  let foundStart = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('(') && !foundStart) {
      foundStart = true;
      depth = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
    } else if (foundStart) {
      depth += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      if (depth <= 0) {
        return i + 1;
      }
    }
  }
  return lines.length;
}

