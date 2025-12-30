"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        logger_1.default.info('✅ MongoDB connected successfully');
        // Handle connection events
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.default.error('MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.default.warn('MongoDB disconnected');
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            logger_1.default.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        logger_1.default.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map