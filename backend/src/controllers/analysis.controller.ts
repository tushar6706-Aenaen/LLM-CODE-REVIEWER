import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { Analysis } from '../models';
import { CustomError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import CodeAnalyzer from '../services/analyzer';

export const uploadAndAnalyze = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new CustomError('No file uploaded', 400);
    }

    // Read file content
    const codeContent = fs.readFileSync(req.file.path, 'utf-8');

    // Create analysis record with pending status
    const analysis = new Analysis({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      codeContent,
      status: 'processing',
      ruleBasedResults: {
        violations: [],
        score: 100,
        totalViolations: 0,
      },
    });

    await analysis.save();

    logger.info(`Analysis created: ${analysis._id}, starting analysis...`);

    // Run static analysis
    try {
      const analyzer = new CodeAnalyzer();
      const analysisResult = await analyzer.analyze(codeContent, req.file.originalname);

      // Update analysis with results
      analysis.ruleBasedResults = {
        violations: analysisResult.violations.map((v) => ({
          rule: v.rule,
          severity: v.severity,
          message: v.message,
          line: v.line,
          column: v.column,
        })),
        score: analysisResult.score,
        totalViolations: analysisResult.totalViolations,
      };
      analysis.status = 'completed';
      await analysis.save();

      logger.info(`Analysis completed for ${analysis._id}: ${analysisResult.totalViolations} violations found`);
    } catch (analysisError: any) {
      logger.error(`Analysis failed for ${analysis._id}:`, analysisError);
      analysis.status = 'failed';
      await analysis.save();
    }

    res.status(201).json({
      success: true,
      data: {
        id: analysis._id,
        fileName: analysis.fileName,
        status: analysis.status,
        ruleBasedResults: analysis.ruleBasedResults,
        message: 'File uploaded and analyzed successfully.',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAnalyses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-codeContent') // Exclude code content for list view
      .lean();

    const total = await Analysis.countDocuments();

    res.json({
      success: true,
      data: {
        analyses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id);

    if (!analysis) {
      throw new CustomError('Analysis not found', 404);
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id);

    if (!analysis) {
      throw new CustomError('Analysis not found', 404);
    }

    // Delete file from filesystem
    if (fs.existsSync(analysis.filePath)) {
      fs.unlinkSync(analysis.filePath);
    }

    await Analysis.findByIdAndDelete(id);

    logger.info(`Analysis deleted: ${id}`);

    res.json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

