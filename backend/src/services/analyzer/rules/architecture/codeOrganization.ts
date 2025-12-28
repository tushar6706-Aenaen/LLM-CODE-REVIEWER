import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { Rule, Violation } from '../../types';

export const codeOrganizationRule: Rule = {
  name: 'code-organization',
  description: 'Checks code organization and structure',
  severity: 'low',
  check: (ast, code) => {
    const violations: Violation[] = [];
    const lines = code.split('\n');

    // Check for very long files (> 500 lines)
    if (lines.length > 500) {
      violations.push({
        rule: 'code-organization',
        severity: 'low',
        message: `File is very long (${lines.length} lines). Consider splitting into smaller modules`,
        recommendation: 'Split large files into smaller, focused modules',
      });
    }

    // Check for too many nested levels
    let maxNesting = 0;
    let currentNesting = 0;

    lines.forEach((line) => {
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      currentNesting += openBraces - closeBraces;
      maxNesting = Math.max(maxNesting, currentNesting);
    });

    if (maxNesting > 5) {
      violations.push({
        rule: 'code-organization',
        severity: 'low',
        message: `High nesting level detected (${maxNesting} levels). Consider refactoring`,
        recommendation: 'Reduce nesting by extracting functions or using early returns',
      });
    }

    return violations;
  },
};

