"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
// Ensure upload directory exists
const uploadDir = env_1.env.UPLOAD_DIR;
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});
// File filter
const fileFilter = (req, file, cb) => {
    // Allow JavaScript, TypeScript, and JSON files
    const allowedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.json'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${ext} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: env_1.env.MAX_FILE_SIZE,
    },
});
// Middleware for single file upload
exports.uploadSingle = exports.upload.single('file');
// Middleware for multiple files upload
exports.uploadMultiple = exports.upload.array('files', 10);
//# sourceMappingURL=upload.js.map