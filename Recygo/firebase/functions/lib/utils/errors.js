"use strict";
/**
 * Système de gestion d'erreurs unifié pour RecyGo CI
 *
 * Codes d'erreur standardisés, classes d'erreur personnalisées
 * et helper pour créer des réponses d'erreur.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.ImageError = exports.GeminiError = exports.NotFoundError = exports.ForbiddenError = exports.AuthError = exports.ValidationError = exports.AppError = exports.ErrorCodes = void 0;
exports.createErrorResponse = createErrorResponse;
exports.logError = logError;
// ═════════════════════════════════════════════════════════════════════
// CODES D'ERREUR
// ═════════════════════════════════════════════════════════════════════
exports.ErrorCodes = {
    // ─── Génériques ────────────────────────────────────────────────
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    CONFLICT: 'CONFLICT',
    TIMEOUT: 'TIMEOUT',
    RATE_LIMITED: 'RATE_LIMITED',
    // ─── Firebase ──────────────────────────────────────────────────
    FIREBASE_AUTH_ERROR: 'FIREBASE_AUTH_ERROR',
    FIREBASE_FIRESTORE_ERROR: 'FIREBASE_FIRESTORE_ERROR',
    FIREBASE_STORAGE_ERROR: 'FIREBASE_STORAGE_ERROR',
    FIREBASE_QUOTA_EXCEEDED: 'FIREBASE_QUOTA_EXCEEDED',
    // ─── Gemini / IA ───────────────────────────────────────────────
    GEMINI_NOT_CONFIGURED: 'GEMINI_NOT_CONFIGURED',
    GEMINI_API_ERROR: 'GEMINI_API_ERROR',
    GEMINI_QUOTA_EXCEEDED: 'GEMINI_QUOTA_EXCEEDED',
    GEMINI_TIMEOUT: 'GEMINI_TIMEOUT',
    GEMINI_INVALID_RESPONSE: 'GEMINI_INVALID_RESPONSE',
    GEMINI_SAFETY_BLOCKED: 'GEMINI_SAFETY_BLOCKED',
    GEMINI_EMPTY_RESPONSE: 'GEMINI_EMPTY_RESPONSE',
    // ─── Image ─────────────────────────────────────────────────────
    IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
    IMAGE_UNSUPPORTED_FORMAT: 'IMAGE_UNSUPPORTED_FORMAT',
    IMAGE_BLURRY: 'IMAGE_BLURRY',
    IMAGE_EMPTY: 'IMAGE_EMPTY',
    IMAGE_TOO_DARK: 'IMAGE_TOO_DARK',
    IMAGE_NO_OBJECT: 'IMAGE_NO_OBJECT',
    IMAGE_MULTIPLE_OBJECTS: 'IMAGE_MULTIPLE_OBJECTS',
    IMAGE_INVALID: 'IMAGE_INVALID',
    // ─── Assistant ────────────────────────────────────────────────
    ASSISTANT_OFF_TOPIC: 'ASSISTANT_OFF_TOPIC',
    ASSISTANT_EMPTY_MESSAGE: 'ASSISTANT_EMPTY_MESSAGE',
    ASSISTANT_TOO_LONG: 'ASSISTANT_TOO_LONG',
};
// ═════════════════════════════════════════════════════════════════════
// CLASSES D'ERREUR
// ═════════════════════════════════════════════════════════════════════
class AppError extends Error {
    code;
    statusCode;
    details;
    timestamp;
    isOperational;
    constructor(code, message, details, statusCode = 500, isOperational = true) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.isOperational = isOperational;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message,
                details: this.details,
                timestamp: this.timestamp,
            },
        };
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, details) {
        super(exports.ErrorCodes.VALIDATION_ERROR, message, details, 400);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class AuthError extends AppError {
    constructor(message = 'Non authentifié', details) {
        super(exports.ErrorCodes.UNAUTHORIZED, message, details, 401);
        this.name = 'AuthError';
    }
}
exports.AuthError = AuthError;
class ForbiddenError extends AppError {
    constructor(message = 'Accès interdit', details) {
        super(exports.ErrorCodes.FORBIDDEN, message, details, 403);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(resource, id) {
        super(exports.ErrorCodes.NOT_FOUND, `${resource}${id ? ` (${id})` : ''} introuvable`, undefined, 404);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class GeminiError extends AppError {
    constructor(code, message, details) {
        super(code, message, details, 502);
        this.name = 'GeminiError';
    }
}
exports.GeminiError = GeminiError;
class ImageError extends AppError {
    constructor(code, message, details) {
        super(code, message, details, 400);
        this.name = 'ImageError';
    }
}
exports.ImageError = ImageError;
class TimeoutError extends AppError {
    constructor(operation, timeoutMs) {
        super(exports.ErrorCodes.TIMEOUT, `L'opération "${operation}" a dépassé le temps limite (${timeoutMs}ms)`, undefined, 504);
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
// ═════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════
/**
 * Crée une réponse d'erreur standardisée pour les Cloud Functions
 */
function createErrorResponse(error) {
    if (error instanceof AppError) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
            },
            processingTimeMs: 0,
        };
    }
    // Erreur non gérée
    console.error('[UNHANDLED_ERROR]', error);
    return {
        success: false,
        error: {
            code: exports.ErrorCodes.INTERNAL_ERROR,
            message: 'Une erreur interne est survenue',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        processingTimeMs: 0,
    };
}
/**
 * Journalise une erreur avec contexte
 */
function logError(context, error, metadata) {
    const entry = {
        timestamp: new Date().toISOString(),
        context,
        error: error instanceof AppError ? error.toJSON() : { message: error.message },
        metadata,
    };
    if (error instanceof AppError && error.isOperational) {
        console.warn('[OPERATIONAL_ERROR]', JSON.stringify(entry, null, 2));
    }
    else {
        console.error('[CRITICAL_ERROR]', JSON.stringify(entry, null, 2));
    }
}
//# sourceMappingURL=errors.js.map