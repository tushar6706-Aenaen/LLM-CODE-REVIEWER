"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.huggingFaceClient = exports.HuggingFaceClient = void 0;
const inference_1 = require("@huggingface/inference");
const env_1 = require("../../config/env");
const logger_1 = __importDefault(require("../../utils/logger"));
class HuggingFaceClient {
    constructor() {
        this.defaultModel = 'meta-llama/Meta-Llama-3.1-8B-Instruct';
        this.rateLimitQueue = [];
        this.isProcessingQueue = false;
        this.MAX_CONCURRENT_REQUESTS = 3;
        this.activeRequests = 0;
        if (!env_1.env.HUGGINGFACE_API_KEY) {
            logger_1.default.warn('HUGGINGFACE_API_KEY not set. LLM features will be disabled.');
            this.client = null;
        }
        else {
            this.client = new inference_1.HfInference(env_1.env.HUGGINGFACE_API_KEY);
            logger_1.default.info('Hugging Face client initialized');
        }
    }
    /**
     * Check if LLM is available
     */
    isAvailable() {
        return !!env_1.env.HUGGINGFACE_API_KEY && !!this.client;
    }
    /**
     * Generate text completion using Hugging Face Inference API
     */
    async generateText(prompt, options = {}) {
        if (!this.isAvailable()) {
            throw new Error('Hugging Face API key not configured');
        }
        const model = options.model || this.defaultModel;
        const maxTokens = options.maxTokens || 2000;
        const temperature = options.temperature || 0.7;
        try {
            // Wait for rate limit slot
            await this.waitForRateLimit();
            this.activeRequests++;
            logger_1.default.debug(`Sending request to Hugging Face model: ${model}`);
            const response = await this.client.textGeneration({
                model,
                inputs: prompt,
                parameters: {
                    max_new_tokens: maxTokens,
                    temperature,
                    return_full_text: false,
                    top_p: 0.95,
                    repetition_penalty: 1.1,
                },
            });
            this.activeRequests--;
            if (response && typeof response === 'string') {
                return response;
            }
            // Handle different response formats
            if (typeof response === 'object' && 'generated_text' in response) {
                return response.generated_text;
            }
            if (Array.isArray(response) && response.length > 0) {
                const first = response[0];
                if (typeof first === 'string') {
                    return first;
                }
                if (typeof first === 'object' && 'generated_text' in first) {
                    return first.generated_text;
                }
            }
            logger_1.default.warn('Unexpected response format from Hugging Face API');
            return JSON.stringify(response);
        }
        catch (error) {
            this.activeRequests--;
            logger_1.default.error('Hugging Face API error:', error);
            // Handle specific error types
            if (error.message?.includes('rate limit')) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            if (error.status === 401) {
                throw new Error('Invalid Hugging Face API key');
            }
            if (error.status === 503) {
                throw new Error('Hugging Face service temporarily unavailable');
            }
            throw new Error(`LLM API error: ${error.message || 'Unknown error'}`);
        }
    }
    /**
     * Rate limiting: wait for available slot
     */
    async waitForRateLimit() {
        return new Promise((resolve) => {
            const checkQueue = () => {
                if (this.activeRequests < this.MAX_CONCURRENT_REQUESTS) {
                    resolve();
                }
                else {
                    setTimeout(checkQueue, 100); // Check every 100ms
                }
            };
            checkQueue();
        });
    }
    /**
     * Estimate token count (rough approximation)
     */
    estimateTokens(text) {
        // Rough estimation: ~4 characters per token for English code
        return Math.ceil(text.length / 4);
    }
    /**
     * Chunk code if it's too long
     */
    chunkCode(code, maxTokens = 3000) {
        const lines = code.split('\n');
        const chunks = [];
        let currentChunk = [];
        let currentStartLine = 1;
        let currentTokens = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineTokens = this.estimateTokens(line);
            if (currentTokens + lineTokens > maxTokens && currentChunk.length > 0) {
                // Save current chunk
                chunks.push({
                    code: currentChunk.join('\n'),
                    startLine: currentStartLine,
                    endLine: i,
                });
                // Start new chunk
                currentChunk = [line];
                currentStartLine = i + 1;
                currentTokens = lineTokens;
            }
            else {
                currentChunk.push(line);
                currentTokens += lineTokens;
            }
        }
        // Add remaining chunk
        if (currentChunk.length > 0) {
            chunks.push({
                code: currentChunk.join('\n'),
                startLine: currentStartLine,
                endLine: lines.length,
            });
        }
        return chunks;
    }
}
exports.HuggingFaceClient = HuggingFaceClient;
exports.huggingFaceClient = new HuggingFaceClient();
//# sourceMappingURL=huggingFaceClient.js.map