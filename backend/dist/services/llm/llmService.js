"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmService = exports.LLMService = void 0;
const huggingFaceClient_1 = require("./huggingFaceClient");
const cache_1 = require("./cache");
const prompts_1 = require("./prompts");
const logger_1 = __importDefault(require("../../utils/logger"));
class LLMService {
    constructor() {
        this.MAX_CODE_LENGTH = 10000; // Max characters before chunking
    }
    /**
     * Parse JSON response from LLM
     */
    parseLLMResponse(text) {
        try {
            // Try to extract JSON from markdown code blocks
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
            const jsonText = jsonMatch ? jsonMatch[1] : text;
            // Try to find JSON object in text
            const jsonObjectMatch = jsonText.match(/\{[\s\S]*\}/);
            const finalJson = jsonObjectMatch ? jsonObjectMatch[0] : jsonText;
            const parsed = JSON.parse(finalJson.trim());
            // Validate and normalize response
            return {
                analysis: parsed.analysis || 'No analysis provided',
                recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
                securityIssues: Array.isArray(parsed.securityIssues) ? parsed.securityIssues : [],
                architecturalIssues: Array.isArray(parsed.architecturalIssues) ? parsed.architecturalIssues : [],
                performanceIssues: Array.isArray(parsed.performanceIssues) ? parsed.performanceIssues : [],
                score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : 75,
            };
        }
        catch (error) {
            logger_1.default.warn('Failed to parse LLM response as JSON, using fallback:', error);
            // Fallback: create structured response from text
            return {
                analysis: text.substring(0, 500),
                recommendations: this.extractRecommendations(text),
                securityIssues: this.extractIssues(text, ['security', 'vulnerability', 'attack']),
                architecturalIssues: this.extractIssues(text, ['architecture', 'structure', 'design']),
                performanceIssues: this.extractIssues(text, ['performance', 'speed', 'optimization']),
                score: 70, // Default score
            };
        }
    }
    /**
     * Extract recommendations from text
     */
    extractRecommendations(text) {
        const recommendations = [];
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.match(/^[-*•]\s*(recommend|suggest|should|consider)/i)) {
                recommendations.push(line.replace(/^[-*•]\s*/i, '').trim());
            }
        }
        return recommendations.slice(0, 10); // Limit to 10 recommendations
    }
    /**
     * Extract issues from text based on keywords
     */
    extractIssues(text, keywords) {
        const issues = [];
        const lines = text.split('\n');
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (keywords.some((keyword) => lowerLine.includes(keyword))) {
                const cleanLine = line.replace(/^[-*•]\s*/i, '').trim();
                if (cleanLine.length > 20) {
                    issues.push(cleanLine);
                }
            }
        }
        return issues.slice(0, 10); // Limit to 10 issues
    }
    /**
     * Analyze code with LLM
     */
    async analyzeCode(code, fileName, options = {}) {
        if (!huggingFaceClient_1.huggingFaceClient.isAvailable()) {
            throw new Error('LLM service is not available. Please configure HUGGINGFACE_API_KEY.');
        }
        // Check cache first
        if (options.useCache !== false) {
            const cached = cache_1.codeCache.get(code);
            if (cached) {
                logger_1.default.info('Using cached LLM analysis result');
                return cached;
            }
        }
        try {
            // Chunk code if too long
            let codeToAnalyze = code;
            if (code.length > this.MAX_CODE_LENGTH) {
                logger_1.default.info(`Code too long (${code.length} chars), analyzing first chunk`);
                const chunks = huggingFaceClient_1.huggingFaceClient.chunkCode(code, 3000);
                codeToAnalyze = chunks[0]?.code || code;
            }
            // Create prompt
            const prompt = (0, prompts_1.createAnalysisPrompt)(codeToAnalyze, fileName);
            logger_1.default.info(`Sending code analysis request to LLM (${codeToAnalyze.length} chars)`);
            // Call LLM
            const response = await huggingFaceClient_1.huggingFaceClient.generateText(prompt, {
                maxTokens: options.maxTokens || 2000,
                temperature: options.temperature || 0.7,
                ...options,
            });
            // Parse response
            const result = this.parseLLMResponse(response);
            // Cache result
            if (options.useCache !== false) {
                cache_1.codeCache.set(code, result);
            }
            logger_1.default.info(`LLM analysis completed. Score: ${result.score}, Issues: ${result.securityIssues.length + result.architecturalIssues.length}`);
            return result;
        }
        catch (error) {
            logger_1.default.error('LLM analysis failed:', error);
            throw error;
        }
    }
}
exports.LLMService = LLMService;
exports.llmService = new LLMService();
//# sourceMappingURL=llmService.js.map