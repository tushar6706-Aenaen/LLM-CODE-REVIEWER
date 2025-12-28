import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const unsafeDeserializationRule: Rule = {
  name: 'unsafe-deserialization',
  description: 'Detects unsafe deserialization practices',
  severity: 'high',
  check: (ast, code) => {
    const violations: Violation[] = [];

    traverse(ast, {
      CallExpression(path) {
        const node = path.node;
        const callee = node.callee;

        // Check for eval() usage
        if (t.isIdentifier(callee) && callee.name === 'eval') {
          violations.push({
            rule: 'unsafe-deserialization',
            severity: 'critical',
            message: 'eval() is used, which can lead to code injection vulnerabilities',
            line: node.loc?.start.line,
            column: node.loc?.start.column,
            recommendation: 'Never use eval(). Use JSON.parse() or other safe parsing methods',
          });
        }

        // Check for Function constructor with user input
        if (t.isIdentifier(callee) && callee.name === 'Function') {
          violations.push({
            rule: 'unsafe-deserialization',
            severity: 'high',
            message: 'Function constructor is used, which can be dangerous with user input',
            line: node.loc?.start.line,
            column: node.loc?.start.column,
            recommendation: 'Avoid using Function constructor with user input',
          });
        }

        // Check for unsafe JSON.parse with user input
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object) &&
          callee.object.name === 'JSON' &&
          t.isIdentifier(callee.property) &&
          callee.property.name === 'parse'
        ) {
          // This is generally safe, but we can check if it's used with req.body directly
          if (node.arguments.length > 0) {
            const arg = node.arguments[0];
            if (
              t.isMemberExpression(arg) &&
              t.isIdentifier(arg.object) &&
              arg.object.name === 'req'
            ) {
              violations.push({
                rule: 'unsafe-deserialization',
                severity: 'medium',
                message: 'JSON.parse() is used with user input. Ensure input is validated before parsing',
                line: node.loc?.start.line,
                column: node.loc?.start.column,
                recommendation: 'Validate and sanitize user input before JSON.parse()',
              });
            }
          }
        }
      },
    });

    return violations;
  },
};

