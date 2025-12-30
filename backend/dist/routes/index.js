"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analysis_routes_1 = __importDefault(require("./analysis.routes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
// API routes
router.use('/analysis', analysis_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map