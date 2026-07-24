/**
 * Tests unitaires pour les validateurs de requêtes
 */

import { validateAnalyzeWasteRequest, validateAssistantRequest } from '../../validators';
import { ValidationError } from '../../utils/errors';

const validBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL';

describe('validateAnalyzeWasteRequest', () => {
  it('devrait valider une requête correcte', () => {
    const result = validateAnalyzeWasteRequest({
      imageBase64: validBase64,
      mimeType: 'image/jpeg',
      userId: 'test-user-123',
    });

    expect(result).toEqual({
      imageBase64: validBase64,
      mimeType: 'image/jpeg',
      userId: 'test-user-123',
    });
  });

  it('devrait rejeter si imageBase64 est manquant', () => {
    expect(() =>
      validateAnalyzeWasteRequest({
        mimeType: 'image/jpeg',
      })
    ).toThrow(ValidationError);
  });

  it('devrait rejeter si imageBase64 est trop court', () => {
    expect(() =>
      validateAnalyzeWasteRequest({
        imageBase64: 'abc',
        mimeType: 'image/jpeg',
      })
    ).toThrow(ValidationError);
  });

  it('devrait rejeter si mimeType est manquant', () => {
    expect(() =>
      validateAnalyzeWasteRequest({
        imageBase64: validBase64,
      })
    ).toThrow(ValidationError);
  });

  it('devrait rejeter si mimeType est non supporté', () => {
    expect(() =>
      validateAnalyzeWasteRequest({
        imageBase64: validBase64,
        mimeType: 'image/gif',
      })
    ).toThrow(ValidationError);
  });

  it('devrait accepter tous les formats MIME autorisés', () => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

    for (const mimeType of allowed) {
      expect(() =>
        validateAnalyzeWasteRequest({ imageBase64: validBase64, mimeType })
      ).not.toThrow();
    }
  });
});

describe('validateAssistantRequest', () => {
  it('devrait valider une requête correcte avec message seulement', () => {
    const result = validateAssistantRequest({
      message: 'Comment recycler le plastique ?',
    });

    expect(result).toEqual({
      message: 'Comment recycler le plastique ?',
      conversationHistory: undefined,
      userId: undefined,
    });
  });

  it('devrait valider une requête avec historique de conversation', () => {
    const result = validateAssistantRequest({
      message: 'Comment recycler le verre ?',
      conversationHistory: [
        { role: 'user', content: 'Bonjour' },
        { role: 'assistant', content: 'Bonjour, comment puis-je vous aider ?' },
      ],
    });

    expect(result.message).toBe('Comment recycler le verre ?');
    expect(result.conversationHistory).toHaveLength(2);
  });

  it('devrait rejeter si message est manquant', () => {
    expect(() =>
      validateAssistantRequest({})
    ).toThrow(ValidationError);
  });

  it('devrait rejeter si message est vide', () => {
    expect(() =>
      validateAssistantRequest({ message: '   ' })
    ).toThrow(ValidationError);
  });

  it('devrait rejeter si message est trop long (> 2000 caractères)', () => {
    const longMessage = 'a'.repeat(2001);
    expect(() =>
      validateAssistantRequest({ message: longMessage })
    ).toThrow(ValidationError);
  });

  it('devrait rejeter si conversationHistory n\'est pas un tableau', () => {
    expect(() =>
      validateAssistantRequest({
        message: 'test',
        conversationHistory: 'not-an-array',
      })
    ).toThrow(ValidationError);
  });

  it('devrait accepter un message de taille limite (2000 caractères)', () => {
    const longMessage = 'a'.repeat(2000);
    expect(() =>
      validateAssistantRequest({ message: longMessage })
    ).not.toThrow(ValidationError);
  });
});

