import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const xssRule: Rule = {
  name: 'xss-vulnerability',
  description: 'Detects potential XSS vulnerabilities',
  severity: 'high',
  check: (ast, code) => {
    const violations: Violation[] = [];

    traverse(ast, {
      CallExpression(path) {
        const node = path.node;
        const callee = node.callee;

        // Check for innerHTML, outerHTML, document.write
        if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
          const propertyName = callee.property.name;

          if (['innerHTML', 'outerHTML', 'insertAdjacentHTML'].includes(propertyName)) {
            // Check if user input is used without sanitization
            if (node.arguments.length > 0) {
              const firstArg = node.arguments[0];

              // Check if it's a direct user input (req.body, req.query, req.params)
              if (
                t.isMemberExpression(firstArg) &&
                t.isIdentifier(firstArg.object) &&
                (firstArg.object.name === 'req' || firstArg.object.name === 'request')
              ) {
                violations.push({
                  rule: 'xss-vulnerability',
                  severity: 'high',
                  message: `Potential XSS: ${propertyName} is set with user input without sanitization`,
                  line: node.loc?.start.line,
                  column: node.loc?.start.column,
                  recommendation: 'Sanitize user input before setting innerHTML/outerHTML or use textContent instead',
                });
              }
            }
          }

          // Check for document.write
          if (
            t.isIdentifier(callee) &&
            callee.name === 'write' &&
            t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.object) &&
            node.callee.object.name === 'document'
          ) {
            violations.push({
              rule: 'xss-vulnerability',
              severity: 'high',
              message: 'Potential XSS: document.write() is used, which can lead to XSS vulnerabilities',
              line: node.loc?.start.line,
              column: node.loc?.start.column,
              recommendation: 'Avoid using document.write(), use DOM manipulation methods instead',
            });
          }
        }

        // Check for res.send with user input
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property) &&
          callee.property.name === 'send'
        ) {
          if (
            t.isMemberExpression(callee.object) &&
            t.isIdentifier(callee.object.property) &&
            callee.object.property.name === 'res'
          ) {
            // This is a basic check - in real scenarios, we'd need deeper analysis
            violations.push({
              rule: 'xss-vulnerability',
              severity: 'medium',
              message: 'Ensure user input in res.send() is properly sanitized',
              line: node.loc?.start.line,
              column: node.loc?.start.column,
              recommendation: 'Sanitize user input before sending in response',
            });
          }
        }
      },
    });

    return violations;
  },
};

