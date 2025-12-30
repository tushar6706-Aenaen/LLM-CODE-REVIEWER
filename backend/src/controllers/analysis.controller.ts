import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { analyzeCode } from '../services/llm';

export async function analyzeCodeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { code, fileName } = req.body;

    if (!code || typeof code !== 'string') {
      throw new CustomError('Code is required in request body', 400);
    }

    logger.info(`Received code analysis request (${code.length} chars)`);

    // Call LLM
    const llmResponse = await analyzeCode(code, fileName || 'code.js');

    // Try to parse as JSON, if it fails return as text
    let responseData: any;
    try {
      responseData = JSON.parse(llmResponse);
    } catch {
      // If not JSON, return as text
      responseData = { response: llmResponse };
    }

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    next(error);
  }
}
