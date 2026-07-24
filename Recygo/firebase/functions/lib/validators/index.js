"use strict";
/**
 * Validateurs de requêtes pour les Cloud Functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnalyzeWasteRequest = validateAnalyzeWasteRequest;
exports.validateAssistantRequest = validateAssistantRequest;
const errors_1 = require("../utils/errors");
// ═════════════════════════════════════════════════════════════════════
// ANALYSE D'IMAGE
// ═════════════════════════════════════════════════════════════════════
function validateAnalyzeWasteRequest(body) {
    const errors = [];
    if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
        errors.push('imageBase64 requis (base64 string)');
    }
    else if (body.imageBase64.length < 100) {
        errors.push('imageBase64 trop court (image vide ou invalide)');
    }
    if (!body.mimeType || typeof body.mimeType !== 'string') {
        errors.push('mimeType requis (ex: image/jpeg)');
    }
    else {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!allowed.includes(body.mimeType)) {
            errors.push(`mimeType non supporté. Acceptés: ${allowed.join(', ')}`);
        }
    }
    if (errors.length > 0) {
        throw new errors_1.ValidationError('Requête invalide', errors.join('; '));
    }
    return {
        imageBase64: body.imageBase64,
        mimeType: body.mimeType,
        userId: body.userId,
    };
}
// ═════════════════════════════════════════════════════════════════════
// ASSISTANT IA
// ═════════════════════════════════════════════════════════════════════
function validateAssistantRequest(body) {
    const errors = [];
    if (!body.message || typeof body.message !== 'string') {
        errors.push('message requis (string)');
    }
    else if (body.message.trim().length === 0) {
        errors.push('message ne peut pas être vide');
    }
    else if (body.message.length > 2000) {
        errors.push('message trop long (max 2000 caractères)');
    }
    if (body.conversationHistory !== undefined) {
        if (!Array.isArray(body.conversationHistory)) {
            errors.push('conversationHistory doit être un tableau');
        }
    }
    if (errors.length > 0) {
        throw new errors_1.ValidationError('Requête invalide', errors.join('; '));
    }
    return {
        message: body.message,
        conversationHistory: body.conversationHistory,
        userId: body.userId,
    };
}
//# sourceMappingURL=index.js.map