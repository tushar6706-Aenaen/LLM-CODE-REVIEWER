import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  codeContent: string;
  ruleBasedResults: {
    violations: Array<{
      rule: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      line?: number;
      column?: number;
    }>;
    score: number;
    totalViolations: number;
  };
  llmResults?: {
    analysis: string;
    recommendations: string[];
    securityIssues: string[];
    architecturalIssues: string[];
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
    ruleBasedResults: {
      violations: [
        {
          rule: String,
          severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            required: true,
          },
          message: String,
          line: Number,
          column: Number,
        },
      ],
      score: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      totalViolations: {
        type: Number,
        default: 0,
      },
    },
    llmResults: {
      analysis: String,
      recommendations: [String],
      securityIssues: [String],
      architecturalIssues: [String],
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
AnalysisSchema.index({ 'ruleBasedResults.score': 1 });

export const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);

