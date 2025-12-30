declare class CodeCache {
    private cache;
    private readonly TTL;
    private readonly MAX_SIZE;
    /**
     * Generate a hash for code content
     */
    generateHash(code: string): string;
    /**
     * Get cached result if available and not expired
     */
    get(code: string): any | null;
    /**
     * Store result in cache
     */
    set(code: string, result: any): void;
    /**
     * Clear expired entries
     */
    clearExpired(): void;
    /**
     * Clear all cache
     */
    clear(): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        maxSize: number;
        entries: number;
    };
}
export declare const codeCache: CodeCache;
export {};
//# sourceMappingURL=cache.d.ts.map