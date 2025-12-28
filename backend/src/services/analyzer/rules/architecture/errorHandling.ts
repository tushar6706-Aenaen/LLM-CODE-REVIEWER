import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const errorHandlingRule: Rule = {
  name: 'error-handling',
  description: 'Checks error handling patterns',
  severity: 'medium',
  check: (ast, code) => {
    const violations: Violation[] = [];

    traverse(ast, {
      CallExpression(path) {
        const node = path.node;
        const callee = node.callee;

        // Check for async functions without error handling
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property)
        ) {
          const methodName = callee.property.name;

          // Check for database operations without try-catch
          if (['query', 'execute', 'save', 'find', 'findOne', 'create'].includes(methodName)) {
            // Check if parent is in try-catch
            let parent = path.parent;
            let inTryCatch = false;

            while (parent) {
              if (t.isTryStatement(parent)) {
                inTryCatch = true;
                break;
              }
              parent = parent.parent;
            }

            if (!inTryCatch) {
              violations.push({
                rule: 'error-handling',
                severity: 'medium',
                message: `Database operation (${methodName}) may need error handling`,
                line: node.loc?.start.line,
                column: node.loc?.start.column,
                recommendation: 'Wrap database operations in try-catch blocks',
              });
            }
          }
        }
      },
    });

    // Check for unhandled promise rejections
    const asyncFunctionPattern = /async\s+function|async\s*\(/;
    const awaitPattern = /await\s+/;
    const hasAsync = asyncFunctionPattern.test(code);
    const hasAwait = awaitPattern.test(code);

    if (hasAwait && !hasAsync) {
      violations.push({
        rule: 'error-handling',
        severity: 'low',
        message: 'await is used but function may not be async',
        recommendation: 'Ensure async/await is properly used',
      });
    }

    return violations;
  },
};

