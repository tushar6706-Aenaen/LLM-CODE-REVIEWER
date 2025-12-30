# LLM Service Documentation

## Overview

The LLM service integrates Hugging Face Inference API to provide comprehensive code analysis. It accepts raw code as plain text, sends it to the LLM, and returns structured feedback.

## Architecture

### Components

1. **HuggingFaceClient** (`huggingFaceClient.ts`)
   - Wraps Hugging Face Inference API
   - Handles rate limiting and concurrent requests
   - Provides code chunking for large files
   - Token estimation utilities

2. **LLMService** (`llmService.ts`)
   - Main service orchestrating LLM analysis
   - Response parsing and normalization
   - Fallback mechanisms for parsing errors

3. **CodeCache** (`cache.ts`)
   - In-memory cache for LLM results
   - SHA-256 hash-based deduplication
   - 24-hour TTL
   - Automatic expiration

4. **Prompts** (`prompts.ts`)
   - Structured prompt templates for code analysis
   - Focuses on security, architecture, API design, and performance

## How It Works

1. **Accept Code**: Receives raw code as plain text string
2. **Send to LLM**: Sends code directly to Hugging Face API with analysis prompt
3. **Parse Response**: Extracts structured JSON from LLM response
4. **Return Results**: Returns analysis with security issues, recommendations, and score

## Cost Optimization

1. **Caching**: Identical code patterns are cached (24h TTL)
2. **Code Chunking**: Large files are split into chunks (max 3000 tokens)
3. **Rate Limiting**: Max 3 concurrent requests

## Usage

```typescript
import { llmService } from './services/llm';

// Analyze code
const result = await llmService.analyzeCode(
  code,
  'file.js',
  { useCache: true }
);
```

## Environment Variables

- `HUGGINGFACE_API_KEY`: Your Hugging Face API token (required)
- `LLM_ENABLED`: Enable/disable LLM (default: true)
- `LLM_MODEL`: Model to use (default: meta-llama/Meta-Llama-3.1-8B-Instruct)
- `LLM_MAX_TOKENS`: Max tokens per request (default: 2000)
- `LLM_TEMPERATURE`: Temperature for generation (default: 0.7)

## Error Handling

- Handles rate limits gracefully
- Validates and normalizes LLM responses
- Provides fallback parsing if JSON parsing fails
- Returns structured error messages

## Response Format

```typescript
{
  analysis: string;              // Overall analysis summary
  recommendations: string[];     // Actionable recommendations
  securityIssues: string[];      // Security vulnerabilities
  architecturalIssues: string[];  // Architecture problems
  performanceIssues?: string[];  // Performance concerns
  score: number;                 // 0-100 score
}
```
