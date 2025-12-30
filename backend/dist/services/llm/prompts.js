"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalysisPrompt = void 0;
const createAnalysisPrompt = (code, fileName) => {
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
};
exports.createAnalysisPrompt = createAnalysisPrompt;
//# sourceMappingURL=prompts.js.map