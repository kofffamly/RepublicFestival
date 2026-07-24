"use strict";
/**
 * Tests unitaires pour le service d'assistant IA conversationnel
 *
 * La fonction askRecyclingAssistant accepte désormais :
 *   (request: AskAssistantRequest, authToken?: string, appCheckToken?: string)
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Simuler l'émulateur Firebase pour les tests (contourne l'auth)
process.env.FUNCTIONS_EMULATOR = 'true';
const assistant_1 = require("../../gemini/assistant");
const client_1 = require("../../gemini/client");
const errors_1 = require("../../utils/errors");
// Mock du client Gemini
jest.mock('../../gemini/client', () => ({
    getGeminiModel: jest.fn(),
    metrics: { totalCalls: 0, totalTokens: 0, errors: 0, lastCallTime: 0 },
}));
// Mock Firestore (inliné dans jest.mock pour éviter les hoisting issues)
jest.mock('../../firebase', () => {
    const mockGet = jest.fn();
    const mockAdd = jest.fn();
    return {
        getFirestore: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnThis(),
            doc: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            get: mockGet,
            add: mockAdd,
            batch: jest.fn().mockReturnValue({ commit: jest.fn() }),
        }),
        getAuth: jest.fn().mockReturnValue({
            verifyIdToken: jest.fn().mockResolvedValue({
                uid: 'test-user-123',
                email: 'test@recygo.ci',
            }),
        }),
        getFirebaseApp: jest.fn(),
    };
});
jest.mock('firebase-admin', () => ({
    firestore: {
        Timestamp: {
            now: () => ({ toMillis: () => Date.now(), seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
        },
    },
    appCheck: jest.fn().mockReturnValue({
        verifyToken: jest.fn().mockResolvedValue({}),
    }),
}));
describe('askRecyclingAssistant', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        client_1.metrics.totalCalls = 0;
        client_1.metrics.totalTokens = 0;
        client_1.metrics.errors = 0;
    });
    it('devrait répondre à une question sur le recyclage', async () => {
        const mockReply = JSON.stringify({
            reply: 'Pour recycler le plastique, rincez d\'abord la bouteille...',
            context: {
                source: 'RecyGo CI',
                suggestedActions: ['Scanner un déchet', 'Voir les centres'],
            },
        });
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
        client_1.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, assistant_1.askRecyclingAssistant)({
            message: 'Comment recycler le plastique ?',
        });
        expect(result.success).toBe(true);
        expect(result.data?.reply).toContain('recycler le plastique');
        expect(result.data?.context).toBeDefined();
        expect(result.processingTimeMs).toBeGreaterThan(0);
    });
    it('devrait rejeter les messages hors-sujet', async () => {
        const result = await (0, assistant_1.askRecyclingAssistant)({
            message: 'Quel est ton parti politique ?',
        });
        expect(result.success).toBe(true);
        expect(result.data?.context?.offTopicDetected).toBe(true);
    });
    it('devrait retourner une erreur si le message est vide', async () => {
        const result = await (0, assistant_1.askRecyclingAssistant)({ message: '' });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.VALIDATION_ERROR);
    });
    it('devrait retourner une erreur si le message est trop long', async () => {
        const result = await (0, assistant_1.askRecyclingAssistant)({ message: 'a'.repeat(2001) });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.VALIDATION_ERROR);
    });
    it('devrait tronquer l\'historique s\'il est trop long', async () => {
        const longHistory = Array.from({ length: 30 }, (_, i) => ({
            role: (i % 2 === 0 ? 'user' : 'assistant'),
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
        client_1.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, assistant_1.askRecyclingAssistant)({
            message: 'test',
            conversationHistory: longHistory,
        });
        expect(result.success).toBe(true);
    });
    it('devrait gérer les erreurs Gemini', async () => {
        const mockModel = {
            generateContent: jest.fn().mockResolvedValue({
                response: { text: () => 'true' },
            }),
            startChat: jest.fn().mockReturnValue({
                sendMessage: jest.fn().mockRejectedValue(new Error('Erreur inconnue')),
            }),
        };
        client_1.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, assistant_1.askRecyclingAssistant)({ message: 'Comment recycler ?' });
        expect(result.success).toBe(false);
        expect(result.error?.code).toBe(errors_1.ErrorCodes.INTERNAL_ERROR);
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
        client_1.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, assistant_1.askRecyclingAssistant)({ message: 'Comment trier ?' });
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
        client_1.getGeminiModel.mockReturnValue(mockModel);
        const result = await (0, assistant_1.askRecyclingAssistant)({ message: 'test' });
        expect(result.success).toBe(true);
        expect(result.data?.reply).toBe('Réponse texte brut simple');
    });
});
//# sourceMappingURL=assistant.test.js.map