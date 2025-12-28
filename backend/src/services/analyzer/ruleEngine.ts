import { AnalysisResult, Rule, Violation } from './types';
import logger from '../../utils/logger';

export class RuleEngine {
  private rules: Rule[] = [];

  registerRule(rule: Rule): void {
    this.rules.push(rule);
    logger.debug(`Registered rule: ${rule.name}`);
  }

  registerRules(rules: Rule[]): void {
    rules.forEach((rule) => this.registerRule(rule));
  }

  async analyze(ast: any, code: string): Promise<AnalysisResult> {
    if (!ast) {
      return {
        violations: [],
        score: 0,
        totalViolations: 0,
        ruleResults: [],
      };
    }

    const allViolations: Violation[] = [];
    const ruleResults: Array<{ rule: string; violations: Violation[]; passed: boolean }> = [];

    // Run each rule
    for (const rule of this.rules) {
      try {
        const violations = rule.check(ast, code);
        allViolations.push(...violations);
        ruleResults.push({
          rule: rule.name,
          violations,
          passed: violations.length === 0,
        });
      } catch (error: any) {
        logger.error(`Error running rule ${rule.name}:`, error);
      }
    }

    // Calculate score (100 - penalty points)
    const score = this.calculateScore(allViolations);
    const totalViolations = allViolations.length;

    return {
      violations: allViolations,
      score,
      totalViolations,
      ruleResults,
    };
  }

  private calculateScore(violations: Violation[]): number {
    let penalty = 0;

    violations.forEach((violation) => {
      switch (violation.severity) {
        case 'critical':
          penalty += 20;
          break;
        case 'high':
          penalty += 10;
          break;
        case 'medium':
          penalty += 5;
          break;
        case 'low':
          penalty += 2;
          break;
      }
    });

    return Math.max(0, 100 - penalty);
  }

  getRegisteredRules(): string[] {
    return this.rules.map((r) => r.name);
  }
}

