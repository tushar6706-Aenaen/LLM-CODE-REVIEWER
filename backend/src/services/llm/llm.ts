import { HfInference } from '@huggingface/inference';
import { env } from '../../config/env';
import logger from '../../utils/logger';

// Create Hugging Face client
let hfClient: HfInference | null = null;

if (env.HUGGINGFACE_API_KEY) {
  hfClient = new HfInference(env.HUGGINGFACE_API_KEY);
  logger.info('Hugging Face client initialized');
} else {
  logger.warn('HUGGINGFACE_API_KEY not set. LLM features will be disabled.');
}

// Create prompt for code analysis
function createPrompt(code: string, fileName: string): string {
  return `You are an expert code reviewer specializing in Node.js/Express backend security and architecture.

Analyze the following code and provide a comprehensive review focusing on:
1. Security vulnerabilities
2. Architectural patterns and best practices
3. API design quality
4. Performance implications
5. Actionable recommendations

**File:** ${fileName}
**Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Task:**
Provide a detailed analysis in the following JSON format:
{
  "analysis": "Overall analysis summary (2-3 paragraphs)",
  "recommendations": ["recommendation1", "recommendation2", ...],
  "securityIssues": ["security issue 1", "security issue 2", ...],
  "architecturalIssues": ["architectural issue 1", "architectural issue 2", ...],
  "performanceIssues": ["performance issue 1", "performance issue 2", ...],
  "score": 85
}

**Guidelines:**
- Score should be 0-100 (higher is better)
- Be specific and actionable
- Consider real-world security implications
- Evaluate code organization and maintainability
- Provide concrete examples from the code

Respond ONLY with valid JSON, no markdown formatting.`;
}

// Call Hugging Face API
async function callLLM(prompt: string): Promise<string> {
  if (!hfClient) {
    throw new Error('Hugging Face API key not configured');
  }

  const model = 'meta-llama/Meta-Llama-3.1-8B-Instruct';
  const maxTokens = 2000;
  const temperature = 0.7;

  try {
    logger.info(`Sending request to Hugging Face model: ${model}`);

    const response = await hfClient.textGeneration({
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

    // Handle different response formats
    if (response && typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && 'generated_text' in response) {
      return (response as any).generated_text;
    }

    if (Array.isArray(response) && (response as any[]).length > 0) {
      const first = (response as any[])[0];
      if (typeof first === 'string') {
        return first;
      }
      if (typeof first === 'object' && 'generated_text' in first) {
        return (first as any).generated_text;
      }
    }

    logger.warn('Unexpected response format from Hugging Face API');
    return JSON.stringify(response);
  } catch (error: any) {
    logger.error('Hugging Face API error:', error);

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

// Main function: analyze code
export async function analyzeCode(code: string, fileName: string = 'code.js'): Promise<string> {
  if (!hfClient) {
    throw new Error('LLM service is not available. Please configure HUGGINGFACE_API_KEY.');
  }

  logger.info(`Analyzing code (${code.length} chars)`);

  const prompt = createPrompt(code, fileName);
  const response = await callLLM(prompt);

  logger.info('LLM analysis completed');

  return response;
}

