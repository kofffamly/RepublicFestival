"use strict";
/**
 * Tests unitaires pour les prompts d'analyse de déchets Gemini
 */
Object.defineProperty(exports, "__esModule", { value: true });
const analyze_waste_1 = require("../../prompts/analyze-waste");
describe('ANALYZE_WASTE_SYSTEM_PROMPT', () => {
    it('devrait contenir le format JSON de réponse', () => {
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('```json');
    });
    it('devrait contenir le contexte ivoirien', () => {
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('Côte d\'Ivoire');
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('FCFA');
    });
    it('devrait définir les catégories de déchets', () => {
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('wasteType');
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('category');
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('material');
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('confidence');
    });
    it('devrait définir les règles strictes (JSON uniquement)', () => {
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('UNIQUEMENT en JSON');
    });
    it('devrait gérer le cas "NO_WASTE_DETECTED"', () => {
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('NO_WASTE_DETECTED');
    });
    it('devrait mentionner les types de déchets ivoiriens courants', () => {
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('sachets d\'eau');
        expect(analyze_waste_1.ANALYZE_WASTE_SYSTEM_PROMPT).toContain('bouteilles plastique');
    });
});
//# sourceMappingURL=analyze-waste.test.js.map