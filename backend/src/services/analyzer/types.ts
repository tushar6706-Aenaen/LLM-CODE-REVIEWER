export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Violation {
  rule: string;
  severity: Severity;
  message: string;
  line?: number;
  column?: number;
  codeSnippet?: string;
  recommendation?: string;
}

export interface RuleResult {
  rule: string;
  violations: Violation[];
  passed: boolean;
}

export interface AnalysisResult {
  violations: Violation[];
  score: number;
  totalViolations: number;
  ruleResults: RuleResult[];
}

export interface Rule {
  name: string;
  description: string;
  severity: Severity;
  check: (ast: any, code: string) => Violation[];
}

