# Plan d'Améliorations — RecyGo CI

## ✅ Terminé
- [x] Analyse complète du codebase

## 🔄 À faire

### Priorité Haute
- [ ] **1. Créer composants `AnimatedView` & `AnimatedPressable` partagés** (DRY)
  - Créer `src/components/ui/AnimatedView.tsx`
  - Créer `src/components/ui/AnimatedPressable.tsx`
  - Mettre à jour `src/components/ui/index.ts`
  - Refactoriser tous les écrans pour utiliser ces composants

- [ ] **2. Centraliser les constantes de design dans `theme.ts`**
  - Ajouter toutes les couleurs manquantes
  - Mettre à jour `src/constants/theme.ts`
  - Mettre à jour les écrans pour importer depuis `theme.ts`
  - Supprimer les constantes locales dupliquées

- [ ] **3. Corriger `Button.tsx`** (incohérence design spec)
  - Changer `primary` de orange (`#E67E22`) → vert (`#2ECC71`)
  - Changer `borderRadius: 20` → `borderRadius: 999` (pill shape)
  - Changer `fontWeight: '800'` → `'700'`

- [ ] **4. Corriger Tab Bar - bouton Scanner flottant**
  - Améliorer le positionnement pour éviter les chevauchements
  - Ajouter `useSafeAreaInsets` correctement

### Priorité Moyenne
- [ ] **5. Nettoyer les stubs inutilisés**
  - `explore.tsx` → soit supprimer soit rendre fonctionnel
  - `camera-placeholder.tsx` → soit supprimer soit ne pas l'utiliser dans la nav

- [ ] **6. Remplacer les `as any` dans les router.push**
  - Utiliser les types Expo Router générés

### Priorité Faible
- [ ] **7. Optimiser les performances (FlatList + React.memo)**

