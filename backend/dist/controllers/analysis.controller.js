"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnalysis = exports.getAnalysisById = exports.getAllAnalyses = exports.uploadAndAnalyze = void 0;
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const llm_1 = require("../services/llm");
const uploadAndAnalyze = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new errorHandler_1.CustomError('No file uploaded', 400);
        }
        // Read file content
        const codeContent = fs_1.default.readFileSync(req.file.path, 'utf-8');
        // Create analysis record with pending status
        const analysis = new models_1.Analysis({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            codeContent,
            status: 'processing',
        });
        await analysis.save();
        logger_1.default.info(`Analysis created: ${analysis._id}, starting LLM analysis...`);
        // Run LLM analysis
        try {
            const llmResult = await llm_1.llmService.analyzeCode(codeContent, req.file.originalname, { useCache: true });
            // Update analysis with LLM results
            analysis.llmResults = {
                analysis: llmResult.analysis,
                recommendations: llmResult.recommendations,
                securityIssues: llmResult.securityIssues,
                architecturalIssues: llmResult.architecturalIssues,
                score: llmResult.score,
            };
            analysis.status = 'completed';
            await analysis.save();
            logger_1.default.info(`LLM analysis completed for ${analysis._id}: Score ${llmResult.score}`);
        }
        catch (analysisError) {
            logger_1.default.error(`LLM analysis failed for ${analysis._id}:`, analysisError);
            analysis.status = 'failed';
            await analysis.save();
        }
        res.status(201).json({
            success: true,
            data: {
                id: analysis._id,
                fileName: analysis.fileName,
                status: analysis.status,
                llmResults: analysis.llmResults || null,
                message: 'File uploaded and analyzed successfully.',
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadAndAnalyze = uploadAndAnalyze;
const getAllAnalyses = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const analyses = await models_1.Analysis.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-codeContent') // Exclude code content for list view
            .lean();
        const total = await models_1.Analysis.countDocuments();
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAllAnalyses = getAllAnalyses;
const getAnalysisById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const analysis = await models_1.Analysis.findById(id);
        if (!analysis) {
            throw new errorHandler_1.CustomError('Analysis not found', 404);
        }
        res.json({
            success: true,
            data: analysis,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalysisById = getAnalysisById;
const deleteAnalysis = async (req, res, next) => {
    try {
        const { id } = req.params;
        const analysis = await models_1.Analysis.findById(id);
        if (!analysis) {
            throw new errorHandler_1.CustomError('Analysis not found', 404);
        }
        // Delete file from filesystem
        if (fs_1.default.existsSync(analysis.filePath)) {
            fs_1.default.unlinkSync(analysis.filePath);
        }
        await models_1.Analysis.findByIdAndDelete(id);
        logger_1.default.info(`Analysis deleted: ${id}`);
        res.json({
            success: true,
            message: 'Analysis deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAnalysis = deleteAnalysis;
//# sourceMappingURL=analysis.controller.js.map