export interface LLMAnalysisResult {
    analysis: string;
    recommendations: string[];
    securityIssues: string[];
    architecturalIssues: string[];
    performanceIssues?: string[];
    score: number;
}
export interface LLMRequestOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    useCache?: boolean;
}
export interface CodeChunk {
    code: string;
    startLine: number;
    endLine: number;
    context?: string;
}
//# sourceMappingURL=types.d.ts.map