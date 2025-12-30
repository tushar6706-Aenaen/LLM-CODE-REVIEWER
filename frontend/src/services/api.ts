import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AnalysisRequest {
  code: string;
  fileName?: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: {
    analysis?: string;
    recommendations?: string[];
    securityIssues?: string[];
    architecturalIssues?: string[];
    performanceIssues?: string[];
    score?: number;
    response?: string;
  };
}

export async function analyzeCode(code: string, fileName?: string): Promise<AnalysisResponse> {
  try {
    const response = await axios.post<AnalysisResponse>(`${API_URL}/analysis`, {
      code,
      fileName,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error?.message || 'Analysis failed');
    }
    throw new Error('Analysis failed');
  }
}

