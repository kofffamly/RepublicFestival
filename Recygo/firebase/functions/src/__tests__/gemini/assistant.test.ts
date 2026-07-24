/**
 * Tests unitaires pour le service d'assistant IA conversationnel
 */

import { askRecyclingAssistant } from '../../gemini/assistant';
import * as client from '../../gemini/client';
import { ErrorCodes } from '../../utils/errors';

// Mock du client Gemini
jest.mock('../../gemini/client', () => ({
  getGeminiModel: jest.fn(),
  metrics: { totalCalls: 0, totalTokens: 0, errors: 0, lastCallTime: 0 },
}));

describe('askRecyclingAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    client.metrics.totalCalls = 0;
    client.metrics.totalTokens = 0;
    client.metrics.errors = 0;
  });

  it('devrait répondre à une question sur le recyclage', async () => {
    const mockReply = JSON.stringify({
      reply: 'Pour recycler le plastique, rincez d\'abord la bouteille...',
      context: {
        source: 'RecyGo CI',
        suggestedActions: ['Scanner un déchet', 'Voir les centres'],
      },
    });

    // Mock du modèle pour détection hors-sujet
    const mockModel = {
      generateContent: jest.fn().mockResolvedValueOnce({
        response: { text: () => 'true' },
      }),
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: () => mockReply,
            usageMetadata: { totalTokenCount: 100 },
            promptFeedback: undefined,
          },
        }),
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await askRecyclingAssistant({
      message: 'Comment recycler le plastique ?',
      userId: 'test-user',
    });

    expect(result.success).toBe(true);
    expect(result.data?.reply).toContain('recycler le plastique');
    expect(result.data?.context).toBeDefined();
    expect(result.processingTimeMs).toBeGreaterThan(0);
  });

  it('devrait rejeter les messages hors-sujet', async () => {
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'false' },
      }),
      startChat: jest.fn(),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await askRecyclingAssistant({
      message: 'Quel est le sens de la vie ?',
    });

    expect(result.success).toBe(true);
    expect(result.data?.context?.offTopicDetected).toBe(true);
  });

  it('devrait retourner une erreur si le message est vide', async () => {
    const result = await askRecyclingAssistant({
      message: '',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
  });

  it('devrait retourner une erreur si le message est trop long', async () => {
    const result = await askRecyclingAssistant({
      message: 'a'.repeat(2001),
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
  });

  it('devrait tronquer l\'historique s\'il est trop long', async () => {
    const longHistory = Array.from({ length: 30 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `Message ${i}`,
    }));

    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'true' },
      }),
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({ reply: 'OK' }),
            usageMetadata: { totalTokenCount: 10 },
          },
        }),
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await askRecyclingAssistant({
      message: 'test',
      conversationHistory: longHistory as any,
    });

    expect(result.success).toBe(true);
  });

  it('devrait gérer les erreurs Gemini', async () => {
    const mockModel = {
      generateContent: jest.fn().mockRejectedValue(new Error('API Error')),
      startChat: jest.fn(),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await askRecyclingAssistant({
      message: 'Comment recycler ?',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.INTERNAL_ERROR);
  });

  it('devrait parser la réponse JSON de Gemini', async () => {
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'true' },
      }),
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({
              reply: 'Voici comment trier vos déchets...',
              context: {
                source: 'RecyGo CI',
                suggestedActions: ['Action 1', 'Action 2'],
              },
            }),
            usageMetadata: { totalTokenCount: 50 },
          },
        }),
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await askRecyclingAssistant({
      message: 'Comment trier ?',
    });

    expect(result.success).toBe(true);
    expect(result.data?.reply).toBe('Voici comment trier vos déchets...');
    expect(result.data?.sources).toContain('Action 1');
  });

  it('devrait utiliser le texte brut si le JSON est invalide', async () => {
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'true' },
      }),
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: () => 'Réponse texte brut simple',
            usageMetadata: { totalTokenCount: 10 },
          },
        }),
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await askRecyclingAssistant({
      message: 'test',
    });

    expect(result.success).toBe(true);
    expect(result.data?.reply).toBe('Réponse texte brut simple');
  });
});

