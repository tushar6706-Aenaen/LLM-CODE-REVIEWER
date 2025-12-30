import mongoose, { Document } from 'mongoose';
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
export declare const Analysis: mongoose.Model<IAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IAnalysis, {}, mongoose.DefaultSchemaOptions> & IAnalysis & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IAnalysis>;
//# sourceMappingURL=Analysis.d.ts.map