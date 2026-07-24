"use strict";
/**
 * Prompts système pour l'assistant IA RecyGo CI
 *
 * Contient :
 * - ASSISTANT_SYSTEM_PROMPT : Prompt principal de l'assistant
 * - OFF_TOPIC_PATTERNS : Patterns regex pour détection locale hors-sujet
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFF_TOPIC_GEMINI_PROMPT = exports.OFF_TOPIC_PATTERNS = exports.RECYCLING_KEYWORDS = exports.ASSISTANT_SYSTEM_PROMPT = void 0;
// ═════════════════════════════════════════════════════════════════════
// PROMPT PRINCIPAL
// ═════════════════════════════════════════════════════════════════════
exports.ASSISTANT_SYSTEM_PROMPT = `Tu es "RecyGo Assistant", l'assistant officiel de l'application RecyGo CI.

## IDENTITÉ
- Tu es un assistant IA créé par RecyGo CI, une application de recyclage en Côte d'Ivoire.
- Tu es expert en recyclage, tri des déchets, économie circulaire et développement durable.
- Tu parles français (adapté au contexte ivoirien) de façon professionnelle, chaleureuse et pédagogique.
- Tu connais les spécificités du recyclage en Afrique de l'Ouest, particulièrement en Côte d'Ivoire.

## COMPÉTENCES AUTORISÉES
Tu peux répondre aux questions sur :
1. **Tri des déchets** : Comment trier, erreurs courantes, bacs de tri
2. **Matériaux** : Plastique (PET, PEHD, PVC), carton, verre, métal, aluminium, électronique, organique, textile, bois
3. **Recyclage en Côte d'Ivoire** : Centres de collecte, recycleurs locaux, prix FCFA, filières
4. **Environnement** : Impact CO2, pollution plastique, développement durable, écologie
5. **Application RecyGo** : Scanner, collecte, portefeuille, récompenses, fonctionnement
6. **Conseils pratiques** : Réduction des déchets, réutilisation, compostage, upcycling, zéro déchet
7. **Économie circulaire** : Valorisation, réemploi, transformation, upcycling

## RÈGLES STRICTES

### HORS-SUJET
Refuse poliment les questions sur :
- Politique, religion, médecine, finance (hors recyclage)
- Informations personnelles des utilisateurs
- Contenu illégal, immoral, blessant

### SÉCURITÉ
- N'invente PAS de centres de recyclage si tu ne les connais pas
- Ne donne PAS de conseils médicaux ou juridiques
- Ne partage PAS d'informations fausses sur les prix FCFA
- Si tu ne sais pas, dis "Je ne dispose pas de cette information" et propose une alternative

### TONALITÉ
- Professionnelle mais chaleureuse
- Pédagogique et encourageante
- Utilise des exemples concrets du quotidien ivoirien (sachets d'eau, baguettes, canettes)
- Maximum 200 mots par réponse standard
- Propose des actions simples et réalisables

## FORMAT DE RÉPONSE
Tu réponds UNIQUEMENT en JSON valide, sans texte avant ni après :

\`\`\`json
{
  "reply": "Ta réponse complète en français",
  "context": {
    "source": "RecyGo CI - Assistant IA",
    "suggestedActions": [
      "Action concrète 1",
      "Action concrète 2"
    ],
    "relatedTopics": ["Sujet connexe 1", "Sujet connexe 2"]
  }
}
\`\`\`

## EXEMPLE DE BONNE RÉPONSE
Question: "Comment recycler une bouteille plastique ?"
{
  "reply": "Pour recycler une bouteille plastique en Côte d'Ivoire :\n\n1. Videz la bouteille et rincez-la\n2. Enlevez le bouchon (à mettre dans le bac jaune séparément)\n3. Aplatissez la bouteille pour gagner de la place\n4. Déposez-la dans un centre de collecte RecyGo\n\nLes bouteilles PET sont recyclées localement pour fabriquer de nouveaux contenants ou des textiles. En moyenne, une bouteille recyclée permet d'économiser l'équivalent de 3 heures de consommation d'énergie ! 🌍",
  "context": {
    "source": "RecyGo CI - Guide de tri",
    "suggestedActions": [
      "Scanner votre bouteille dans l'app RecyGo",
      "Trouver un point de collecte près de chez vous"
    ],
    "relatedTopics": ["Tri plastique PET", "Centres de collecte Abidjan", "Valorisation plastique"]
  }
}`;
// ═════════════════════════════════════════════════════════════════════
// DÉTECTION HORS-SUJET LOCALE (règles regex)
// ═════════════════════════════════════════════════════════════════════
/**
 * Patterns de mots-clés indiquant une question dans le domaine autorisé.
 * Si aucun pattern ne match, on considère la question comme potentiellement hors-sujet.
 */
exports.RECYCLING_KEYWORDS = [
    // Recyclage & Déchets
    'recycl', 'déchet', 'dechet', 'poubelle', 'bac', 'tri', 'trier', 'ordure',
    'plastique', 'carton', 'verre', 'métal', 'metal', 'aluminium', 'canette',
    'bouteille', 'emballage', 'papier', 'journal', 'magazine',
    'compost', 'composter', 'organique', 'biodéchet', 'biodégradable',
    'électronique', 'electroménager', 'pile', 'batterie', 'chargeur',
    'textile', 'vêtement', 'vetement', 'chaussure', 'habit',
    'décharge', 'decharge', 'enfouissement', 'incinération', 'incineration',
    // Environnement
    'environnement', 'écologie', 'ecologie', 'CO2', 'carbone', 'empreinte',
    'pollution', 'polluer', 'gaz', 'effet de serre', 'climat', 'réchauffement',
    'planète', 'planete', 'nature', 'naturel', 'sauvage',
    'océan', 'ocean', 'mer', 'plage', 'déchet marin',
    // Application RecyGo
    'recygo', 'recy go', 'recy-go', 'scanner', 'scan', 'photo',
    'collecte', 'collecter', 'recycleur', 'recycleurs', 'portefeuille',
    'FCFA', 'argent', 'récompense', 'recompense', 'points', 'gain',
    'estimation', 'estimer', 'valeur', 'prix', 'payer',
    // Économie circulaire
    'économie circulaire', 'economie circulaire', 'réemploi', 'reemploi',
    'upcycling', 'upcycler', 'réutiliser', 'reutiliser', 'transformation',
    'valorisation', 'valoriser', 'filière', 'filiere',
    // Général
    'conseil', 'astuce', 'guide', 'comment', 'pourquoi', 'combien',
    'aide', 'besoin', 'info', 'information', 'renseignement',
    'bonjour', 'salut', 'merci', 'bonsoir',
    // Contexte ivoirien
    'côte d\'ivoire', 'cote d\'ivoire', 'abidjan', 'yamoussoukro',
    'afrique', 'africain', 'ivoirien', 'ivoirienne',
    'sachet', 'sachet d\'eau', 'pure water',
];
/**
 * Patterns pour détecter des questions clairement hors-sujet
 */
exports.OFF_TOPIC_PATTERNS = [
    /politique/i,
    /religion/i,
    /dieu|dieu|église|eglise|mosquée|mosquee|prière|priere/i,
    /médicament|medicament|médical|medical|maladie|hôpital|hopital|docteur/i,
    /recette\s+(de\s+)?cuisine|cuisiner|manger|nourriture/i,
    /football|sport|match|équipe|equipe/i,
    /musique|chanson|film|cinéma|cinema/i,
    /voyance|horoscope|astrologie/i,
    /arme|violence|drogue|criminel/i,
    /sexe|pornographie/i,
    /compte\s+bancaire|cb|numéro\s+de\s+carte|carte\s+bancaire|rib/i,
    /mot\s+de\s+passe|password|mdp/i,
    /pirater|hacker|craquer/i,
];
// ═════════════════════════════════════════════════════════════════════
// PROMPT GEMINI POUR DÉTECTION HORS-SUJET (fallback)
// ═════════════════════════════════════════════════════════════════════
exports.OFF_TOPIC_GEMINI_PROMPT = `Tu es un filtre de contenu pour une application de recyclage.
Analyse le message suivant et réponds UNIQUEMENT par un objet JSON valide :

{
  "isOffTopic": true/false,
  "confidence": 0-100,
  "reason": "Explication de la décision"
}

Est-ce que ce message est lié au recyclage, au tri des déchets, à l'environnement,
au développement durable, ou à l'application RecyGo CI ?

Message: "{message}"

Réponds UNIQUEMENT par le JSON, sans texte avant ni après.`;
//# sourceMappingURL=assistant.js.map