import { RuleEngine } from './ruleEngine';
import { parseCode } from './parser';
import { AnalysisResult } from './types';
import * as rules from './rules';
import logger from '../../utils/logger';

export class CodeAnalyzer {
  private ruleEngine: RuleEngine;

  constructor() {
    this.ruleEngine = new RuleEngine();
    this.registerAllRules();
  }

  private registerAllRules(): void {
    // Register security rules
    this.ruleEngine.registerRule(rules.hardcodedSecretsRule);
    this.ruleEngine.registerRule(rules.sqlInjectionRule);
    this.ruleEngine.registerRule(rules.xssRule);
    this.ruleEngine.registerRule(rules.authenticationRule);
    this.ruleEngine.registerRule(rules.inputValidationRule);
    this.ruleEngine.registerRule(rules.rateLimitingRule);
    this.ruleEngine.registerRule(rules.corsRule);
    this.ruleEngine.registerRule(rules.insecureHeadersRule);
    this.ruleEngine.registerRule(rules.unsafeDeserializationRule);

    // Register architecture rules
    this.ruleEngine.registerRule(rules.codeOrganizationRule);
    this.ruleEngine.registerRule(rules.errorHandlingRule);
    this.ruleEngine.registerRule(rules.apiDesignRule);
    this.ruleEngine.registerRule(rules.middlewareRule);

    logger.info(`Registered ${this.ruleEngine.getRegisteredRules().length} analysis rules`);
  }

  async analyze(code: string, filename: string): Promise<AnalysisResult> {
    logger.info(`Analyzing file: ${filename}`);

    // Parse code to AST
    const parseResult = parseCode(code, filename);

    if (!parseResult.success) {
      logger.warn(`Failed to parse ${filename}, returning empty results`);
      return {
        violations: [],
        score: 0,
        totalViolations: 0,
        ruleResults: [],
      };
    }

    // Run rule engine
    const result = await this.ruleEngine.analyze(parseResult.ast, code);

    logger.info(
      `Analysis complete for ${filename}: ${result.totalViolations} violations found, score: ${result.score}`
    );

    return result;
  }

  getRegisteredRules(): string[] {
    return this.ruleEngine.getRegisteredRules();
  }
}

export default CodeAnalyzer;

