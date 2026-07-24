/**
 * Service d'appel à l'assistant IA RecyGo
 *
 * Communique avec la Firebase Function askAssistant
 * Gère les erreurs et le formatage des réponses
 */

// ═════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface AssistantResponse {
  success: boolean;
  data?: {
    reply: string;
    context?: Record<string, unknown>;
    sources?: string[];
  };
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  processingTimeMs: number;
}

// ═════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═════════════════════════════════════════════════════════════════════

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

const FUNCTIONS_BASE_URL = isDev
  ? 'http://localhost:5001/recygo-ci-dev/us-central1'
  : 'https://us-central1-recygo-ci-dev.cloudfunctions.net';

const ASSISTANT_ENDPOINT = `${FUNCTIONS_BASE_URL}/askAssistant`;

// ═════════════════════════════════════════════════════════════════════
// SERVICE
// ═════════════════════════════════════════════════════════════════════

/**
 * Envoie une question à l'assistant IA RecyGo
 *
 * @param request - Le message et optionnellement l'historique
 * @param idToken - Token Firebase Authentication (obtenu via getAuth().currentUser.getIdToken())
 * @returns AssistantResponse
 */
export async function askAssistant(
  request: AssistantRequest,
  idToken?: string
): Promise<AssistantResponse> {
  const startTime = Date.now();

  try {
    // 1. Valider le message côté client
    if (!request.message || request.message.trim().length === 0) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Veuillez écrire un message',
        },
        processingTimeMs: 0,
      };
    }

    if (request.message.length > 2000) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Le message est trop long (max 2000 caractères)',
        },
        processingTimeMs: 0,
      };
    }

    if (!idToken) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Vous devez être connecté pour utiliser l\'assistant',
        },
        processingTimeMs: 0,
      };
    }

    // 2. Préparer la requête
    const body: AssistantRequest = {
      message: request.message.trim(),
    };

    // Ajouter l'historique si présent (limité aux 10 derniers messages)
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      body.conversationHistory = request.conversationHistory.slice(-10);
    }

    // 3. Définir un timeout de 30s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // 4. Appeler la Firebase Function
    const response = await fetch(ASSISTANT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 5. Gérer les erreurs HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 401) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Session expirée. Veuillez vous reconnecter.',
          },
          processingTimeMs: Date.now() - startTime,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: 'Trop de requêtes. Veuillez patienter quelques instants.',
          },
          processingTimeMs: Date.now() - startTime,
        };
      }

      return {
        success: false,
        error: {
          code: errorData?.error?.code || 'SERVER_ERROR',
          message:
            errorData?.error?.message || 'Erreur du serveur. Veuillez réessayer.',
          details: errorData?.error?.details,
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    // 6. Parser la réponse
    const result: AssistantResponse = await response.json();
    return {
      ...result,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    // 7. Gérer les erreurs réseau et timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message:
            'Le serveur met trop de temps à répondre. Veuillez réessayer.',
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue';

    if (
      errorMessage.includes('Network request failed') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('network')
    ) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message:
            'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
        },
        processingTimeMs: Date.now() - startTime,
      };
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Une erreur inattendue est survenue. Veuillez réessayer.',
        details: isDev ? errorMessage : undefined,
      },
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Nettoie le texte de la réponse pour l'affichage
 */
export function formatReply(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Gras markdown
    .replace(/__(.*?)__/g, '$1') // Souligné
    .replace(/`(.*?)`/g, '$1') // Code inline
    .replace(/\n{3,}/g, '\n\n') // Sauts de ligne excessifs
    .trim();
}

/**
 * Extrait les actions suggérées du contexte
 */
export function extractSuggestedActions(
  context?: Record<string, unknown>
): string[] {
  if (!context) return [];
  const actions = context.suggestedActions;
  if (Array.isArray(actions)) {
    return actions.slice(0, 5).map(String);
  }
  return [];
}

/**
 * Extrait les sujets connexes du contexte
 */
export function extractRelatedTopics(
  context?: Record<string, unknown>
): string[] {
  if (!context) return [];
  const topics = context.relatedTopics;
  if (Array.isArray(topics)) {
    return topics.slice(0, 5).map(String);
  }
  return [];
}

