/**
 * Assistant IA RecyGo — Interface de chat conversationnel
 *
 * Permet aux utilisateurs de poser des questions sur le recyclage,
 * le tri des déchets, l'environnement et l'application RecyGo.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated as RNAnimated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  askAssistant,
  formatReply,
  extractSuggestedActions,
  type ChatMessage,
  type AssistantResponse,
} from '@/services/assistantService';

// ─── Constantes ─────────────────────────────────────────────────────
const GREEN_DARK = '#0F5C34';
const GREEN_MID = '#1E7A46';
const GREEN_CTA = '#2ECC71';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#111827';
const TEXT_GRAY = '#6B7280';
const BG_LIGHT = '#F8FAFC';

const SUGGESTED_QUESTIONS = [
  'Comment recycler une bouteille plastique ?',
  'Où se trouvent les centres de recyclage à Abidjan ?',
  'Comment fonctionne l\'application RecyGo ?',
  'Quels déchets sont recyclables en Côte d\'Ivoire ?',
];

// ─── Message d'accueil ──────────────────────────────────────────────
const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    '👋 Bonjour ! Je suis l\'assistant RecyGo, votre expert en recyclage.\n\n' +
    'Je peux vous aider avec :\n' +
    '• Le tri de vos déchets\n' +
    '• Les centres de recyclage en Côte d\'Ivoire\n' +
    '• Les astuces pour réduire vos déchets\n' +
    '• L\'utilisation de l\'application RecyGo\n\n' +
    'Que puis-je pour vous ?',
};

// ─── Composant Message ──────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(10)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      RNAnimated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View
      style={[
        styles.messageRow,
        isUser ? styles.userRow : styles.assistantRow,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {!isUser && (
        <View style={styles.assistantAvatar}>
          <Text style={styles.assistantAvatarText}>♻️</Text>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {formatReply(message.content)}
        </Text>
      </View>
    </RNAnimated.View>
  );
}

// ─── Composant Suggestion ───────────────────────────────────────────
function SuggestionChip({
  text,
  onPress,
  index,
}: {
  text: string;
  onPress: () => void;
  index: number;
}) {
  const opacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay: 200 + index * 100,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <RNAnimated.View style={{ opacity }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.suggestionChip,
          pressed && styles.suggestionChipPressed,
        ]}
      >
        <Text style={styles.suggestionText}>{text}</Text>
      </Pressable>
    </RNAnimated.View>
  );
}

// ─── Écran Principal ────────────────────────────────────────────────
export default function AssistantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Scroll vers le bas automatiquement
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Envoyer un message
  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || inputText.trim();
      if (!messageText || isLoading) return;

      setError(null);
      setShowSuggestions(false);

      // Ajouter le message utilisateur
      const userMessage: ChatMessage = {
        role: 'user',
        content: messageText,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        // Préparer l'historique (sans le message d'accueil)
        const history = messages
          .filter(
            (m) =>
              m.content !== WELCOME_MESSAGE.content || m.role !== 'assistant'
          )
          .slice(-10);

        // Appeler l'assistant (le token est géré côté serveur en mode dev/émulateur)
        const response: AssistantResponse = await askAssistant(
          {
            message: messageText,
            conversationHistory: history,
          },
          undefined // Le backend tolère les appels sans token en développement
        );

        if (response.success && response.data) {
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: response.data.reply,
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Si le contexte contient des actions suggérées, les afficher
          const actions = extractSuggestedActions(response.data.context);
          if (actions.length > 0) {
            const actionsMessage: ChatMessage = {
              role: 'assistant',
              content: `💡 Suggestions :\n• ${actions.join('\n• ')}`,
            };
            setMessages((prev) => [...prev, actionsMessage]);
          }
        } else {
          setError(
            response.error?.message || 'Une erreur est survenue'
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erreur de connexion'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, isLoading, messages]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN_DARK} />

      {/* ── En-tête ──────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Assistant RecyGo</Text>
            <Text style={styles.headerSubtitle}>
              Posez vos questions sur le recyclage
            </Text>
          </View>
          <View style={styles.onlineDot} />
        </View>
      </View>

      {/* ── Messages ─────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <MessageBubble key={`msg-${index}`} message={msg} />
          ))}

          {/* Squelette de chargement */}
          {isLoading && (
            <View style={styles.loadingRow}>
              <View style={styles.assistantAvatar}>
                <Text style={styles.assistantAvatarText}>♻️</Text>
              </View>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color={GREEN_CTA} />
                <Text style={styles.loadingText}>Réflexion...</Text>
              </View>
            </View>
          )}

          {/* Message d'erreur */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                onPress={() => setError(null)}
                style={styles.errorDismiss}
              >
                <Text style={styles.errorDismissText}>✕</Text>
              </Pressable>
            </View>
          )}

          {/* Questions suggérées */}
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>
                Questions fréquentes :
              </Text>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <SuggestionChip
                  key={i}
                  text={q}
                  index={i}
                  onPress={() => handleSend(q)}
                />
              ))}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* ── Barre de saisie ────────────────────────────────────── */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Posez votre question..."
              placeholderTextColor={TEXT_GRAY}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
              editable={!isLoading}
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
              blurOnSubmit
            />
            <Pressable
              onPress={() => handleSend()}
              style={[
                styles.sendBtn,
                (!inputText.trim() || isLoading) &&
                  styles.sendBtnDisabled,
              ]}
              disabled={!inputText.trim() || isLoading}
            >
              <Text
                style={[
                  styles.sendBtnText,
                  (!inputText.trim() || isLoading) &&
                    styles.sendBtnTextDisabled,
                ]}
              >
                ↑
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN_DARK,
  },

  // ── En-tête ──
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: GREEN_DARK,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: WHITE,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: WHITE,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN_CTA,
  },

  // ── Chat ──
  chatContainer: {
    flex: 1,
    backgroundColor: BG_LIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ── Messages ──
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9F8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  assistantAvatarText: {
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: GREEN_CTA,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: WHITE,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: WHITE,
  },
  assistantText: {
    color: TEXT_DARK,
  },

  // ── Loading ──
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    fontSize: 13,
    color: TEXT_GRAY,
  },

  // ── Erreur ──
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 18,
  },
  errorDismiss: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  errorDismissText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
  },

  // ── Suggestions ──
  suggestionsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_GRAY,
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: WHITE,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionChipPressed: {
    backgroundColor: '#F0FDF4',
    borderColor: GREEN_CTA,
  },
  suggestionText: {
    fontSize: 13,
    color: TEXT_DARK,
    lineHeight: 18,
  },

  // ── Input ──
  inputBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG_LIGHT,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
    maxHeight: 100,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GREEN_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendBtnText: {
    fontSize: 18,
    color: WHITE,
    fontWeight: '700',
  },
  sendBtnTextDisabled: {
    opacity: 0.5,
  },
});

