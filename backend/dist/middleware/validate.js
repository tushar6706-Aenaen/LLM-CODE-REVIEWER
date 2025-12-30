"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const errorHandler_1 = require("./errorHandler");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                const validationError = new errorHandler_1.CustomError('Validation failed', 400);
                validationError.details = errorMessages;
                next(validationError);
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map