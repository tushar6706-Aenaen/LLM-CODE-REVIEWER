"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeCache = void 0;
const crypto = __importStar(require("crypto"));
const logger_1 = __importDefault(require("../../utils/logger"));
class CodeCache {
    constructor() {
        this.cache = new Map();
        this.TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.MAX_SIZE = 100; // Maximum cache entries
    }
    /**
     * Generate a hash for code content
     */
    generateHash(code) {
        return crypto.createHash('sha256').update(code.trim()).digest('hex');
    }
    /**
     * Get cached result if available and not expired
     */
    get(code) {
        const hash = this.generateHash(code);
        const entry = this.cache.get(hash);
        if (!entry) {
            return null;
        }
        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(hash);
            logger_1.default.debug(`Cache entry expired for hash: ${hash.substring(0, 8)}...`);
            return null;
        }
        logger_1.default.debug(`Cache hit for hash: ${hash.substring(0, 8)}...`);
        return entry.result;
    }
    /**
     * Store result in cache
     */
    set(code, result) {
        const hash = this.generateHash(code);
        // Evict oldest entries if cache is full
        if (this.cache.size >= this.MAX_SIZE) {
            const oldestKey = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
            this.cache.delete(oldestKey);
            logger_1.default.debug(`Evicted cache entry: ${oldestKey.substring(0, 8)}...`);
        }
        const entry = {
            hash,
            result,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.TTL,
        };
        this.cache.set(hash, entry);
        logger_1.default.debug(`Cached result for hash: ${hash.substring(0, 8)}...`);
    }
    /**
     * Clear expired entries
     */
    clearExpired() {
        const now = Date.now();
        let cleared = 0;
        for (const [hash, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(hash);
                cleared++;
            }
        }
        if (cleared > 0) {
            logger_1.default.debug(`Cleared ${cleared} expired cache entries`);
        }
    }
    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        logger_1.default.info('Cache cleared');
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.MAX_SIZE,
            entries: Array.from(this.cache.values()).length,
        };
    }
}
exports.codeCache = new CodeCache();
//# sourceMappingURL=cache.js.map