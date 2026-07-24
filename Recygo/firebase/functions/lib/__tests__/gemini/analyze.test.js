"use strict";
/**
 * Tests unitaires pour le service d'analyse d'image de déchet
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const analyze_1 = require("../../gemini/analyze");
const client = __importStar(require("../../gemini/client"));
const errors_1 = require("../../utils/errors");
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
        client.getGeminiModel.mockReturnValue(mockModel);
    });
    it('devrait analyser une image de déchet avec succès', async () => {
        const result = await (0, analyze_1.analyzeWasteImage)(mockValidImageRequest);
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.wasteType).toBe('Bouteille plastique PET');
        expect(result.data?.category).toBe('plastic');
        expect(result.data?.confidence).toBe(95);
        expect(result.processingTimeMs).toBeGreaterThan(0);
    });
    it('devrait retourner une erreur si l\'image est vide', async () => {
        const result = await (0, analyze_1.analyzeWasteImage)({
            ...mockValidImageRequest,
            imageBase64: '',
        });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.VALIDATION_ERROR);
    });
    it('devrait retourner une erreur si le format MIME est non supporté', async () => {
        const result = await (0, analyze_1.analyzeWasteImage)({
            ...mockValidImageRequest,
            mimeType: 'image/gif',
        });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.IMAGE_UNSUPPORTED_FORMAT);
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
        client.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, analyze_1.analyzeWasteImage)(mockValidImageRequest);
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.IMAGE_NO_OBJECT);
    });
    it('devrait incrémenter les métriques en cas de succès', async () => {
        await (0, analyze_1.analyzeWasteImage)(mockValidImageRequest);
        expect(client.metrics.totalCalls).toBe(1);
        expect(client.metrics.totalTokens).toBe(150);
    });
    it('devrait gérer une image trop volumineuse', async () => {
        const largeBase64 = 'a'.repeat(15 * 1024 * 1024);
        const result = await (0, analyze_1.analyzeWasteImage)({
            ...mockValidImageRequest,
            imageBase64: largeBase64,
        });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.IMAGE_TOO_LARGE);
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
        client.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, analyze_1.analyzeWasteImage)(mockValidImageRequest);
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.GEMINI_SAFETY_BLOCKED);
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
        client.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, analyze_1.analyzeWasteImage)(mockValidImageRequest);
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.GEMINI_INVALID_RESPONSE);
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
        client.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, analyze_1.analyzeWasteImage)(mockValidImageRequest);
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.GEMINI_INVALID_RESPONSE);
    });
});
//# sourceMappingURL=analyze.test.js.map