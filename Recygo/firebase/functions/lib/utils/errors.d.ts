/**
 * Système de gestion d'erreurs unifié pour RecyGo CI
 *
 * Codes d'erreur standardisés, classes d'erreur personnalisées
 * et helper pour créer des réponses d'erreur.
 */
export declare const ErrorCodes: {
    readonly UNKNOWN_ERROR: "UNKNOWN_ERROR";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly CONFLICT: "CONFLICT";
    readonly TIMEOUT: "TIMEOUT";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly FIREBASE_AUTH_ERROR: "FIREBASE_AUTH_ERROR";
    readonly FIREBASE_FIRESTORE_ERROR: "FIREBASE_FIRESTORE_ERROR";
    readonly FIREBASE_STORAGE_ERROR: "FIREBASE_STORAGE_ERROR";
    readonly FIREBASE_QUOTA_EXCEEDED: "FIREBASE_QUOTA_EXCEEDED";
    readonly GEMINI_NOT_CONFIGURED: "GEMINI_NOT_CONFIGURED";
    readonly GEMINI_API_ERROR: "GEMINI_API_ERROR";
    readonly GEMINI_QUOTA_EXCEEDED: "GEMINI_QUOTA_EXCEEDED";
    readonly GEMINI_TIMEOUT: "GEMINI_TIMEOUT";
    readonly GEMINI_INVALID_RESPONSE: "GEMINI_INVALID_RESPONSE";
    readonly GEMINI_SAFETY_BLOCKED: "GEMINI_SAFETY_BLOCKED";
    readonly GEMINI_EMPTY_RESPONSE: "GEMINI_EMPTY_RESPONSE";
    readonly IMAGE_TOO_LARGE: "IMAGE_TOO_LARGE";
    readonly IMAGE_UNSUPPORTED_FORMAT: "IMAGE_UNSUPPORTED_FORMAT";
    readonly IMAGE_BLURRY: "IMAGE_BLURRY";
    readonly IMAGE_EMPTY: "IMAGE_EMPTY";
    readonly IMAGE_TOO_DARK: "IMAGE_TOO_DARK";
    readonly IMAGE_NO_OBJECT: "IMAGE_NO_OBJECT";
    readonly IMAGE_MULTIPLE_OBJECTS: "IMAGE_MULTIPLE_OBJECTS";
    readonly IMAGE_INVALID: "IMAGE_INVALID";
    readonly ASSISTANT_OFF_TOPIC: "ASSISTANT_OFF_TOPIC";
    readonly ASSISTANT_EMPTY_MESSAGE: "ASSISTANT_EMPTY_MESSAGE";
    readonly ASSISTANT_TOO_LONG: "ASSISTANT_TOO_LONG";
};
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
export declare class AppError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly details?: string;
    readonly timestamp: string;
    readonly isOperational: boolean;
    constructor(code: ErrorCode, message: string, details?: string, statusCode?: number, isOperational?: boolean);
    toJSON(): {
        error: {
            code: ErrorCode;
            message: string;
            details: string | undefined;
            timestamp: string;
        };
    };
}
export declare class ValidationError extends AppError {
    constructor(message: string, details?: string);
}
export declare class AuthError extends AppError {
    constructor(message?: string, details?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, details?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string, id?: string);
}
export declare class GeminiError extends AppError {
    constructor(code: ErrorCode, message: string, details?: string);
}
export declare class ImageError extends AppError {
    constructor(code: ErrorCode, message: string, details?: string);
}
export declare class TimeoutError extends AppError {
    constructor(operation: string, timeoutMs: number);
}
/**
 * Crée une réponse d'erreur standardisée pour les Cloud Functions
 */
export declare function createErrorResponse(error: AppError | Error): {
    success: false;
    error: {
        code: string;
        message: string;
        details?: string;
    };
    processingTimeMs: number;
};
/**
 * Journalise une erreur avec contexte
 */
export declare function logError(context: string, error: AppError | Error, metadata?: Record<string, unknown>): void;
//# sourceMappingURL=errors.d.ts.map