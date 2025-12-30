import { LLMAnalysisResult, LLMRequestOptions } from './types';
export declare class LLMService {
    private readonly MAX_CODE_LENGTH;
    /**
     * Parse JSON response from LLM
     */
    private parseLLMResponse;
    /**
     * Extract recommendations from text
     */
    private extractRecommendations;
    /**
     * Extract issues from text based on keywords
     */
    private extractIssues;
    /**
     * Analyze code with LLM
     */
    analyzeCode(code: string, fileName: string, options?: LLMRequestOptions): Promise<LLMAnalysisResult>;
}
export declare const llmService: LLMService;
//# sourceMappingURL=llmService.d.ts.map