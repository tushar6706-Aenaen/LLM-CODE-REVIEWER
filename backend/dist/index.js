"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = __importDefault(require("./utils/logger"));
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.path}`);
    next();
});
// API routes
app.use('/api', routes_1.default);
// 404 handler
app.use(errorHandler_1.notFoundHandler);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        // Connect to database
        await (0, database_1.connectDatabase)();
        // Start listening
        app.listen(env_1.env.PORT, () => {
            logger_1.default.info(`🚀 Server is running on http://localhost:${env_1.env.PORT}`);
            logger_1.default.info(`📝 Environment: ${env_1.env.NODE_ENV}`);
            logger_1.default.info(`🌐 Frontend URL: ${env_1.env.FRONTEND_URL}`);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map