/**
 * Validateurs de requêtes pour les Cloud Functions
 */

import { ValidationError } from '../utils/errors';
import type {
  AnalyzeWasteRequest,
  AskAssistantRequest,
} from '../types';

// ═════════════════════════════════════════════════════════════════════
// ANALYSE D'IMAGE
// ═════════════════════════════════════════════════════════════════════

export function validateAnalyzeWasteRequest(body: Record<string, unknown>): AnalyzeWasteRequest {
  const errors: string[] = [];

  if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
    errors.push('imageBase64 requis (base64 string)');
  } else if (body.imageBase64.length < 100) {
    errors.push('imageBase64 trop court (image vide ou invalide)');
  }

  if (!body.mimeType || typeof body.mimeType !== 'string') {
    errors.push('mimeType requis (ex: image/jpeg)');
  } else {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowed.includes(body.mimeType)) {
      errors.push(`mimeType non supporté. Acceptés: ${allowed.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Requête invalide', errors.join('; '));
  }

  return {
    imageBase64: body.imageBase64 as string,
    mimeType: body.mimeType as string,
    userId: body.userId as string | undefined,
  };
}

// ═════════════════════════════════════════════════════════════════════
// ASSISTANT IA
// ═════════════════════════════════════════════════════════════════════

export function validateAssistantRequest(body: Record<string, unknown>): AskAssistantRequest {
  const errors: string[] = [];

  if (!body.message || typeof body.message !== 'string') {
    errors.push('message requis (string)');
  } else if (body.message.trim().length === 0) {
    errors.push('message ne peut pas être vide');
  } else if (body.message.length > 2000) {
    errors.push('message trop long (max 2000 caractères)');
  }

  if (body.conversationHistory !== undefined) {
    if (!Array.isArray(body.conversationHistory)) {
      errors.push('conversationHistory doit être un tableau');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Requête invalide', errors.join('; '));
  }

  return {
    message: body.message as string,
    conversationHistory: body.conversationHistory as AskAssistantRequest['conversationHistory'],
    userId: body.userId as string | undefined,
  };
}
