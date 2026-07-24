/**
 * Service d'analyse d'image de déchet via Gemini
 *
 * Fonction : analyzeWasteImage()
 *
 * Valide l'image, l'envoie à Gemini, parse la réponse JSON
 * et retourne une analyse structurée.
 */
import type { AnalyzeWasteRequest, AnalyzeWasteResponse } from '../types';
export declare function analyzeWasteImage(request: AnalyzeWasteRequest): Promise<AnalyzeWasteResponse>;
//# sourceMappingURL=analyze.d.ts.map