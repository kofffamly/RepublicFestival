/**
 * Service d'analyse de déchet — RecyGo CI
 *
 * Envoie une image à la Firebase Function analyzeWaste
 * et retourne les résultats structurés de l'IA Gemini.
 */

// ─── Types ──────────────────────────────────────────────────────────

export interface AIAnalysis {
  wasteType: string;
  category: string;
  material: string;
  confidence: number;
  description: string;
  recommendation: string;
  recyclingInstructions: string;
  binType: string;
  hazardLevel: 'none' | 'low' | 'moderate' | 'high' | 'toxic';
  estimatedWeight: number;
  estimatedValueMin: number;
  estimatedValueMax: number;
  recyclable: boolean;
  tags: string[];
}

export interface AnalyzeWasteResponse {
  success: boolean;
  data?: AIAnalysis;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  processingTimeMs: number;
}

export interface AnalyzeError {
  code: string;
  message: string;
  details?: string;
}

// ─── Configuration ──────────────────────────────────────────────────

const FIREBASE_FUNCTION_URL =
  process.env.EXPO_PUBLIC_FIREBASE_FUNCTION_URL ||
  'https://us-central1-recygo-ci-dev.cloudfunctions.net/analyzeWaste';

const ANALYSIS_TIMEOUT_MS = 60000; // 60 secondes maximum

// ─── Compression d'image ────────────────────────────────────────────

/**
 * Redimensionne et compresse une image au format JPEG base64
 */
export async function compressImage(
  uri: string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.7
): Promise<{ base64: string; mimeType: string }> {
  try {
    // Tentative avec expo-image-manipulator
    const manipModule = await import('expo-image-manipulator');
    const result = await manipModule.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format: manipModule.SaveFormat.JPEG, base64: true }
    );
    return {
      base64: result.base64 || '',
      mimeType: 'image/jpeg',
    };
  } catch {
    // Fallback: fetch + FileReader (web)
    console.warn('[WasteAnalysis] ImageManipulator non disponible, fallback FileReader');
    const response = await fetch(uri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = () => reject(new Error('Échec de lecture du fichier image'));
      reader.readAsDataURL(blob);
    });
    return { base64, mimeType: blob.type || 'image/jpeg' };
  }
}

// ─── Appel API ──────────────────────────────────────────────────────

/**
 * Envoie une image à l'IA Gemini via Firebase Cloud Function
 */
export async function analyzeWasteImage(
  imageBase64: string,
  mimeType: string
): Promise<AnalyzeWasteResponse> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);

    const response = await fetch(FIREBASE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, userId: 'mobile-user' }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: `Erreur serveur (${response.status})`,
          details: errorText.substring(0, 500),
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    const result: AnalyzeWasteResponse = await response.json();
    result.processingTimeMs = Date.now() - startTime;
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: "L'analyse a pris trop de temps. Veuillez réessayer.",
          details: `Timeout après ${ANALYSIS_TIMEOUT_MS / 1000} secondes`,
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    const networkError = error as Error;
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        details: networkError.message,
      },
      processingTimeMs: Date.now() - startTime,
    };
  }
}

// ─── Utilitaires ────────────────────────────────────────────────────

/**
 * Obtient la couleur du bac de tri recommandé
 */
export function getBinColor(binType: string): string {
  const binColors: Record<string, string> = {
    plastique: '#FCD34D',
    papier: '#3B82F6',
    verre: '#22C55E',
    metal: '#6B7280',
    dechet_electronique: '#EF4444',
    dechet_organique: '#92400E',
    dechet_dangereux: '#DC2626',
  };
  return binColors[binType.toLowerCase()] || '#6B7280';
}

/**
 * Obtient le nom lisible du bac
 */
export function getBinLabel(binType: string): string {
  const binLabels: Record<string, string> = {
    plastique: 'Bac jaune (plastique)',
    papier: 'Bac bleu (papier)',
    verre: 'Bac vert (verre)',
    metal: 'Bac gris (métal)',
    dechet_electronique: 'Déchetterie électronique',
    dechet_organique: 'Bac marron (organique)',
    dechet_dangereux: 'Déchetterie spéciale',
  };
  return binLabels[binType.toLowerCase()] || 'Voir consignes';
}

/**
 * Obtient le niveau de dangerosité lisible
 */
export function getHazardLabel(level: string): string {
  const labels: Record<string, string> = {
    none: 'Aucun danger',
    low: 'Faible danger',
    moderate: 'Danger modéré',
    high: 'Dangereux',
    toxic: 'Toxique',
  };
  return labels[level] || 'Non spécifié';
}

