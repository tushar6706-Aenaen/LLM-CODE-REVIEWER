"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisIdSchema = exports.getAnalysesSchema = void 0;
const zod_1 = require("zod");
// Schema for analysis query parameters
exports.getAnalysesSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: zod_1.z.string().regex(/^\d+$/).optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    }),
});
// Schema for analysis ID parameter
exports.analysisIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid analysis ID'),
    }),
});
//# sourceMappingURL=analysis.validator.js.map