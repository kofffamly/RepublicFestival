/**
 * Tests unitaires pour les prompts d'analyse de déchets Gemini
 */

import { ANALYZE_WASTE_SYSTEM_PROMPT } from '../../prompts/analyze-waste';

describe('ANALYZE_WASTE_SYSTEM_PROMPT', () => {
  it('devrait contenir le format JSON de réponse', () => {
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('```json');
  });

  it('devrait contenir le contexte ivoirien', () => {
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('Côte d\'Ivoire');
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('FCFA');
  });

  it('devrait définir les catégories de déchets', () => {
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('wasteType');
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('category');
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('material');
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('confidence');
  });

  it('devrait définir les règles strictes (JSON uniquement)', () => {
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('UNIQUEMENT en JSON');
  });

  it('devrait gérer le cas "NO_WASTE_DETECTED"', () => {
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('NO_WASTE_DETECTED');
  });

  it('devrait mentionner les types de déchets ivoiriens courants', () => {
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('sachets d\'eau');
    expect(ANALYZE_WASTE_SYSTEM_PROMPT).toContain('bouteilles plastique');
  });
});

