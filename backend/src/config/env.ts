import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-code-reviewer',
  
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '',
  
  // LLM Configuration
  LLM_ENABLED: process.env.LLM_ENABLED !== 'false', // Default to true
  LLM_MODEL: process.env.LLM_MODEL || 'meta-llama/Meta-Llama-3.1-8B-Instruct',
  LLM_MAX_TOKENS: parseInt(process.env.LLM_MAX_TOKENS || '2000', 10),
  LLM_TEMPERATURE: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];

if (env.NODE_ENV === 'production') {
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
}

