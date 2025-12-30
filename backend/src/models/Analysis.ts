import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  codeContent: string;
  llmResults?: {
    analysis: string;
    recommendations: string[];
    securityIssues: string[];
    architecturalIssues: string[];
    performanceIssues?: string[];
    score: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    codeContent: {
      type: String,
      required: true,
    },
    llmResults: {
      analysis: String,
      recommendations: [String],
      securityIssues: [String],
      architecturalIssues: [String],
      performanceIssues: [String],
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AnalysisSchema.index({ createdAt: -1 });
AnalysisSchema.index({ status: 1 });
AnalysisSchema.index({ 'llmResults.score': 1 });

export const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
