"use strict";
/**
 * Tests unitaires pour les validateurs de requêtes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../../validators");
const errors_1 = require("../../utils/errors");
const validBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL';
describe('validateAnalyzeWasteRequest', () => {
    it('devrait valider une requête correcte', () => {
        const result = (0, validators_1.validateAnalyzeWasteRequest)({
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
        expect(() => (0, validators_1.validateAnalyzeWasteRequest)({
            mimeType: 'image/jpeg',
        })).toThrow(errors_1.ValidationError);
    });
    it('devrait rejeter si imageBase64 est trop court', () => {
        expect(() => (0, validators_1.validateAnalyzeWasteRequest)({
            imageBase64: 'abc',
            mimeType: 'image/jpeg',
        })).toThrow(errors_1.ValidationError);
    });
    it('devrait rejeter si mimeType est manquant', () => {
        expect(() => (0, validators_1.validateAnalyzeWasteRequest)({
            imageBase64: validBase64,
        })).toThrow(errors_1.ValidationError);
    });
    it('devrait rejeter si mimeType est non supporté', () => {
        expect(() => (0, validators_1.validateAnalyzeWasteRequest)({
            imageBase64: validBase64,
            mimeType: 'image/gif',
        })).toThrow(errors_1.ValidationError);
    });
    it('devrait accepter tous les formats MIME autorisés', () => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        for (const mimeType of allowed) {
            expect(() => (0, validators_1.validateAnalyzeWasteRequest)({ imageBase64: validBase64, mimeType })).not.toThrow();
        }
    });
});
describe('validateAssistantRequest', () => {
    it('devrait valider une requête correcte avec message seulement', () => {
        const result = (0, validators_1.validateAssistantRequest)({
            message: 'Comment recycler le plastique ?',
        });
        expect(result).toEqual({
            message: 'Comment recycler le plastique ?',
            conversationHistory: undefined,
            userId: undefined,
        });
    });
    it('devrait valider une requête avec historique de conversation', () => {
        const result = (0, validators_1.validateAssistantRequest)({
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
        expect(() => (0, validators_1.validateAssistantRequest)({})).toThrow(errors_1.ValidationError);
    });
    it('devrait rejeter si message est vide', () => {
        expect(() => (0, validators_1.validateAssistantRequest)({ message: '   ' })).toThrow(errors_1.ValidationError);
    });
    it('devrait rejeter si message est trop long (> 2000 caractères)', () => {
        const longMessage = 'a'.repeat(2001);
        expect(() => (0, validators_1.validateAssistantRequest)({ message: longMessage })).toThrow(errors_1.ValidationError);
    });
    it('devrait rejeter si conversationHistory n\'est pas un tableau', () => {
        expect(() => (0, validators_1.validateAssistantRequest)({
            message: 'test',
            conversationHistory: 'not-an-array',
        })).toThrow(errors_1.ValidationError);
    });
    it('devrait accepter un message de taille limite (2000 caractères)', () => {
        const longMessage = 'a'.repeat(2000);
        expect(() => (0, validators_1.validateAssistantRequest)({ message: longMessage })).not.toThrow(errors_1.ValidationError);
    });
});
//# sourceMappingURL=index.test.js.map