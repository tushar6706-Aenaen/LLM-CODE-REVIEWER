import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const inputValidationRule: Rule = {
  name: 'missing-input-validation',
  description: 'Detects missing input validation',
  severity: 'medium',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for direct use of req.body, req.query, req.params without validation
    const validationPatterns = [
      /express-validator/i,
      /joi/i,
      /yup/i,
      /zod/i,
      /validator/i,
      /\.validate/i,
      /\.check/i,
      /\.body\(/i,
    ];

    lines.forEach((line, index) => {
      // Check for direct access to user input
      if (
        /req\.(body|query|params|headers)\[/.test(line) ||
        /req\.(body|query|params|headers)\./.test(line)
      ) {
        // Check if validation is present in the file
        const hasValidation = validationPatterns.some((pattern) =>
          pattern.test(code)
        );

        // Check if it's in a validation middleware context
        const isInValidationContext = checkValidationContext(lines, index);

        if (!hasValidation && !isInValidationContext) {
          violations.push({
            rule: 'missing-input-validation',
            severity: 'medium',
            message: `User input (req.body/query/params) is used without validation`,
            line: index + 1,
            recommendation: 'Add input validation middleware (express-validator, joi, zod, etc.)',
          });
        }
      }
    });

    return violations;
  },
};

function checkValidationContext(lines: string[], index: number): boolean {
  // Check if we're in a validation middleware function
  const contextLines = lines.slice(Math.max(0, index - 10), index);
  return contextLines.some((line) =>
    /(validate|check|sanitize|validator)/i.test(line)
  );
}

