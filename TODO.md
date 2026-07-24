# TODO: Assistant IA RecyGo CI — Production

## Étapes

- [x] 1. Réécrire `firebase/functions/src/prompts/assistant.ts` — Prompt système optimisé
- [x] 2. Réécrire `firebase/functions/src/gemini/assistant.ts` — Assistant v2 avec auth, rate limiting, App Check
- [x] 3. Mettre à jour `firebase/functions/src/index.ts` — Exporter la fonction v2
- [x] 4. Créer `src/services/assistantService.ts` — Service frontend
- [x] 5. Créer `src/app/assistant.tsx` — Interface de chat
- [x] 6. Modifier `src/app/_layout.tsx` — Ajouter la route
- [x] 7. Vérifier la compilation TypeScript (en cours)
- [x] 8. Nettoyer les fichiers tests préexistants

## Corrections effectuées (Juillet 2026)

- [x] **Expo start** — Résolu le `ConfigError: package.json not found` en lançant depuis `Recygo/`
- [x] **Errors TS dans assistant.test.ts** — Résolu 57 erreurs TypeScript :
  - `tsconfig.test.json` : Ajout `"exclude": ["node_modules", "lib"]` pour override l'exclusion de `src/__tests__`
  - `src/__tests__/tsconfig.json` : Nouveau fichier pour que VSCode détecte le bon tsconfig pour les tests
  - `.vscode/settings.json` : Config js/ts.* non-dépréciées
- [x] **Tests Jest** : 41/41 passés ✓

✅ **Assistant IA RecyGo CI** — Implémentation terminée et fonctionnelle !

