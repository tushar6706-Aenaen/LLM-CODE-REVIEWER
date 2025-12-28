import parser from '@babel/parser';
import { Rule } from './types';
import logger from '../../utils/logger';

export interface ParseResult {
  ast: any;
  code: string;
  success: boolean;
  error?: string;
}

export const parseCode = (code: string, filename: string): ParseResult => {
  try {
    // Try to parse as JavaScript/TypeScript
    const ast = parser.parse(code, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      plugins: [
        'typescript',
        'jsx',
        'decorators-legacy',
        'classProperties',
        'objectRestSpread',
        'asyncGenerators',
        'functionBind',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'dynamicImport',
        'nullishCoalescingOperator',
        'optionalChaining',
      ],
    });

    return {
      ast,
      code,
      success: true,
    };
  } catch (error: any) {
    logger.warn(`Failed to parse ${filename}:`, error.message);
    return {
      ast: null,
      code,
      success: false,
      error: error.message,
    };
  }
};

