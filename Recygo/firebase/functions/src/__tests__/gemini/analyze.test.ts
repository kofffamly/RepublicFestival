/**
 * Tests unitaires pour le service d'analyse d'image de déchet
 */

import { analyzeWasteImage } from '../../gemini/analyze';
import * as client from '../../gemini/client';
import { ErrorCodes } from '../../utils/errors';

// Mock du client Gemini
jest.mock('../../gemini/client', () => ({
  getGeminiModel: jest.fn(),
  metrics: { totalCalls: 0, totalTokens: 0, errors: 0, lastCallTime: 0 },
}));

describe('analyzeWasteImage', () => {
  const mockValidImageRequest = {
    imageBase64: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAg...',
    mimeType: 'image/jpeg',
    userId: 'test-user',
  };

  const mockAIAnalysisResponse = {
    response: {
      text: () => JSON.stringify({
        wasteType: 'Bouteille plastique PET',
        category: 'plastic',
        material: 'Polyéthylène téréphtalate',
        confidence: 95,
        description: 'Bouteille en plastique transparent de 1.5L',
        recommendation: 'Rincer et déposer dans le bac plastique',
        recyclingInstructions: 'Bien vider et rincer avant de jeter',
        binType: 'plastique',
        hazardLevel: 'none',
        estimatedWeight: 0.05,
        estimatedValueMin: 25,
        estimatedValueMax: 100,
        recyclable: true,
        tags: ['bouteille', 'plastique', 'pet'],
      }),
      usageMetadata: { totalTokenCount: 150 },
      promptFeedback: undefined,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    client.metrics.totalCalls = 0;
    client.metrics.totalTokens = 0;
    client.metrics.errors = 0;

    const mockModel = {
      generateContent: jest.fn().mockResolvedValue(mockAIAnalysisResponse),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);
  });

  it('devrait analyser une image de déchet avec succès', async () => {
    const result = await analyzeWasteImage(mockValidImageRequest);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.wasteType).toBe('Bouteille plastique PET');
    expect(result.data?.category).toBe('plastic');
    expect(result.data?.confidence).toBe(95);
    expect(result.processingTimeMs).toBeGreaterThan(0);
  });

  it('devrait retourner une erreur si l\'image est vide', async () => {
    const result = await analyzeWasteImage({
      ...mockValidImageRequest,
      imageBase64: '',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.VALIDATION_ERROR);
  });

  it('devrait retourner une erreur si le format MIME est non supporté', async () => {
    const result = await analyzeWasteImage({
      ...mockValidImageRequest,
      mimeType: 'image/gif',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.IMAGE_UNSUPPORTED_FORMAT);
  });

  it('devrait gérer le cas "NO_WASTE_DETECTED"', async () => {
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({ code: 'NO_WASTE_DETECTED' }),
          usageMetadata: { totalTokenCount: 10 },
          promptFeedback: undefined,
        },
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await analyzeWasteImage(mockValidImageRequest);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.IMAGE_NO_OBJECT);
  });

  it('devrait incrémenter les métriques en cas de succès', async () => {
    await analyzeWasteImage(mockValidImageRequest);

    expect(client.metrics.totalCalls).toBe(1);
    expect(client.metrics.totalTokens).toBe(150);
  });

  it('devrait gérer une image trop volumineuse', async () => {
    const largeBase64 = 'a'.repeat(15 * 1024 * 1024);

    const result = await analyzeWasteImage({
      ...mockValidImageRequest,
      imageBase64: largeBase64,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.IMAGE_TOO_LARGE);
  });

  it('devrait retourner une erreur si la réponse Gemini est vide', async () => {
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => '',
          usageMetadata: undefined,
          promptFeedback: { blockReason: 'SAFETY' },
        },
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await analyzeWasteImage(mockValidImageRequest);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.GEMINI_SAFETY_BLOCKED);
  });

  it('devrait retourner une erreur si le JSON est invalide', async () => {
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Réponse non-JSON invalide',
          usageMetadata: { totalTokenCount: 5 },
          promptFeedback: undefined,
        },
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await analyzeWasteImage(mockValidImageRequest);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.GEMINI_INVALID_RESPONSE);
  });

  it('devrait gérer les champs manquants dans la réponse', async () => {
    const mockModel = {
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            wasteType: 'Test',
            // category manquant
            material: 'Test',
            // confidence manquant
          }),
          usageMetadata: { totalTokenCount: 5 },
          promptFeedback: undefined,
        },
      }),
    };
    (client.getGeminiModel as jest.Mock).mockReturnValue(mockModel);

    const result = await analyzeWasteImage(mockValidImageRequest);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(ErrorCodes.GEMINI_INVALID_RESPONSE);
  });
});

