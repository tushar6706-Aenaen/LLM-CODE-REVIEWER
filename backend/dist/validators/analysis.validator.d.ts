import { z } from 'zod';
export declare const getAnalysesSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
        limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const analysisIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=analysis.validator.d.ts.map