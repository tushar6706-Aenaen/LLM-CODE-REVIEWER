import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const sqlInjectionRule: Rule = {
  name: 'sql-injection',
  description: 'Detects potential SQL injection vulnerabilities',
  severity: 'high',
  check: (ast, code) => {
    const violations: Violation[] = [];

    traverse(ast, {
      CallExpression(path) {
        const node = path.node;
        const callee = node.callee;

        // Check for database query methods
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property)
        ) {
          const methodName = callee.property.name;
          const queryMethods = ['query', 'execute', 'exec', 'run'];

          if (queryMethods.includes(methodName)) {
            // Check if query string is constructed with user input
            if (node.arguments.length > 0) {
              const firstArg = node.arguments[0];

              // Check for template literals with expressions (potential injection)
              if (t.isTemplateLiteral(firstArg)) {
                if (firstArg.expressions.length > 0) {
                  violations.push({
                    rule: 'sql-injection',
                    severity: 'high',
                    message: `Potential SQL injection: Query uses template literal with expressions. Use parameterized queries instead.`,
                    line: node.loc?.start.line,
                    column: node.loc?.start.column,
                    recommendation: 'Use parameterized queries or prepared statements instead of string concatenation',
                  });
                }
              }

              // Check for string concatenation in query
              if (t.isBinaryExpression(firstArg) && firstArg.operator === '+') {
                violations.push({
                  rule: 'sql-injection',
                  severity: 'high',
                  message: `Potential SQL injection: Query uses string concatenation. Use parameterized queries instead.`,
                  line: node.loc?.start.line,
                  column: node.loc?.start.column,
                  recommendation: 'Use parameterized queries or prepared statements instead of string concatenation',
                });
              }
            }
          }
        }
      },
    });

    return violations;
  },
};

