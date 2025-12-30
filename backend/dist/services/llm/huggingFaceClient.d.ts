import { LLMRequestOptions } from './types';
export declare class HuggingFaceClient {
    private client;
    private defaultModel;
    private rateLimitQueue;
    private isProcessingQueue;
    private readonly MAX_CONCURRENT_REQUESTS;
    private activeRequests;
    constructor();
    /**
     * Check if LLM is available
     */
    isAvailable(): boolean;
    /**
     * Generate text completion using Hugging Face Inference API
     */
    generateText(prompt: string, options?: LLMRequestOptions): Promise<string>;
    /**
     * Rate limiting: wait for available slot
     */
    private waitForRateLimit;
    /**
     * Estimate token count (rough approximation)
     */
    estimateTokens(text: string): number;
    /**
     * Chunk code if it's too long
     */
    chunkCode(code: string, maxTokens?: number): Array<{
        code: string;
        startLine: number;
        endLine: number;
    }>;
}
export declare const huggingFaceClient: HuggingFaceClient;
//# sourceMappingURL=huggingFaceClient.d.ts.map