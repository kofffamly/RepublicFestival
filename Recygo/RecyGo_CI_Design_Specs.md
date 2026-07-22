# RecyGo CI — Spécifications d'écrans pour agent de codage

Palette globale observée :
- Vert principal (marque) : `#1E7A46` → `#0F5C34` (dégradé foncé)
- Vert accent CTA : `#2ECC71` / `#22C55E`
- Fond clair menthe : `#EAF7F0`
- Fond clair crème/beige : `#FDF6E8`
- Fond clair bleu très pâle : `#F0F4FF`
- Texte foncé : `#1A1A1A` / `#111827`
- Texte gris secondaire : `#6B7280`
- Orange accent (Recycleur Pro) : `#F5A524` / `#EA8A2E`
- Bleu accent : `#3B82F6`
- Violet accent : `#8B5CF6`
- Jaune/or accent : `#EAB308`
- Rouge (déconnexion) : `#EF4444`
- Police : sans-serif arrondie type "Poppins" ou "Inter" — titres en gras (700), sous-titres en régulier (400), boutons en semi-bold (600)
- Rayon de bordure généreux : 16-24px sur cartes, 999px (pill) sur boutons et inputs
- Icônes : style "outline" arrondi (type Feather/Lucide), toujours dans un carré/rond de couleur pastel en fond

Chaque section ci-dessous est un prompt autonome, copiable tel quel pour un agent (Claude Code / Copilot), décrivant fidèlement l'écran à reproduire.

---

## 1. Splash Screen

**Prompt :**
Crée un écran de démarrage (Splash Screen) avec :
- Fond en dégradé radial vert foncé, plus sombre sur les bords et plus lumineux au centre (`#0F5C34` → `#1E7A46` → `#2ECC71` au centre).
- Au centre vertical de l'écran, une icône : carré arrondi blanc (~72x72px, radius 20px) contenant le logo de recyclage (symbole ♻️ stylisé en vert, style outline épais).
- Sous l'icône (marge ~16px) : texte "RecyGo" en blanc, gras, taille ~28px.
- Juste en dessous, collé : "CI" en jaune/orange (`#F5A524`), gras, même taille.
- Sous le titre (marge ~12px) : sous-titre en majuscules "LE RECYCLAGE, RÉINVENTÉ" en blanc, taille ~11px, letter-spacing large, opacité ~90%.
- En bas de l'écran (~15% du bas) : 3 petits points de pagination horizontaux (indicateurs de chargement, un plus clair que les autres) centrés.
- Sous les points : texte "Chargement en cours..." en vert clair (`#A7E8C4`), taille ~12px, centré.
- Pas de barre de navigation, écran plein écran, notch/encoche visible en haut si simulation de mobile.

---

## 2. Onboarding — Écran 1/3 : "Scannez vos déchets"

**Prompt :**
Crée un écran d'onboarding (1er de 3) avec :
- Fond uni vert très clair menthe (`#EAF7F0`).
- Centré verticalement dans la moitié haute : une icône carrée arrondie (radius 24px, ~110x110px) fond vert pâle (`#D8F0E4`) contenant une icône caméra en outline vert foncé, taille ~48px.
- Sous l'icône (marge ~32px) : titre "Scannez vos déchets" en noir/gris très foncé, gras, taille ~22px, centré.
- Sous le titre : sous-titre gris (`#6B7280`), centré, taille ~14px, 2 lignes : "Photographiez n'importe quel déchet recyclable. Notre IA l'identifie en secondes et estime sa valeur."
- Sous le texte : 3 points de pagination horizontaux, le premier plein/foncé (actif), les 2 autres gris clair (inactifs).
- En bas de l'écran : bouton plein largeur, fond vert (`#2ECC71`), coins très arrondis (pill), texte blanc gras "Continuer", hauteur ~52px.
- Sous le bouton, centré : lien texte "Passer" en orange/marron clair, taille ~13px, sans fond.

---

## 3. Onboarding — Écran 2/3 : "Trouvez un recycleur"

**Prompt :**
Identique en structure à l'écran 1, avec les différences suivantes :
- Fond uni beige/crème très clair (`#FDF6E8`).
- Icône carrée arrondie fond jaune pâle (`#FBEBC7`) contenant une icône de pin/localisation en outline orange (`#EA8A2E`).
- Titre : "Trouvez un recycleur".
- Sous-titre : "Des recycleurs professionnels proches de vous acceptent votre demande en quelques minutes."
- Pagination : 2ème point actif (couleur orange), les 2 autres gris clair.
- Bouton "Continuer" identique (vert plein largeur).
- Lien "Passer" identique sous le bouton.

---

## 4. Onboarding — Écran 3/3 : "Gagnez des revenus"

**Prompt :**
Identique en structure aux écrans précédents, avec :
- Fond blanc / bleu très pâle (`#F5F8FF`).
- Icône carrée arrondie fond bleu pâle (`#DCE7FF`) contenant une icône "$" (dollar) en outline bleu (`#3B82F6`).
- Titre : "Gagnez des revenus".
- Sous-titre : "Recevez directement l'argent sur votre portefeuille RecyGo et contribuez à un avenir vert."
- Pagination : 3ème point actif (couleur bleu/noir), les 2 autres gris clair.
- Bouton final plein largeur vert, texte "Commencer" (au lieu de "Continuer").
- **Pas de lien "Passer"** sur ce dernier écran (c'est la fin de l'onboarding).

---

## 5. Choix du profil ("Qui êtes-vous ?")

**Prompt :**
Crée un écran de sélection de profil avec :
- Un bandeau supérieur (environ 30% de la hauteur) en dégradé vert foncé, avec un bord inférieur légèrement arrondi/incurvé se fondant vers le fond blanc.
- Dans ce bandeau, centré : titre "Qui êtes-vous ? 🌍" blanc, gras, taille ~22px.
- Sous le titre : sous-titre blanc/vert très clair, taille ~13px : "Choisissez votre profil pour commencer".
- Sous le bandeau, sur fond blanc/gris très clair, deux grandes cartes empilées verticalement (marge ~20px entre elles, padding interne ~20px, radius ~20px, légère ombre) :
  1. **Carte "Citoyen"** : fond vert pâle (`#E9F8EF`). En haut à gauche, icône carrée arrondie verte pleine (`#2ECC71`) avec icône maison blanche outline. Titre "Citoyen" gras noir. Description grise : "J'ai des déchets à recycler et je veux gagner de l'argent". En bas à droite : lien "Choisir →" en vert gras.
  2. **Carte "Recycleur Pro"** : fond jaune/crème pâle (`#FDF3DD`). Icône carrée arrondie orange pleine avec icône camion/truck blanc outline. Titre "Recycleur Pro" gras noir. Description grise : "Je collecte et revends les déchets recyclables". En bas à droite : lien "Choisir →" en orange gras.
- Les deux cartes ont la même largeur, occupant toute la largeur disponible avec marges latérales ~20px.

---

## 6. Connexion

**Prompt :**
Crée un écran de connexion avec :
- Bandeau supérieur vert foncé dégradé (arrondi en bas, ~25% de la hauteur) contenant :
  - Petite icône recyclage blanche en haut, suivie du texte "RecyGo CI" en blanc (taille ~13px).
  - Titre "Bon retour ! 👋" blanc, gras, taille ~24px.
  - Sous-titre "Connectez-vous pour continuer" en vert très clair, taille ~13px.
- Sur fond blanc en dessous, un formulaire avec :
  - Label "E-MAIL OU TÉLÉPHONE" gris, majuscules, petit (~11px), letter-spacing.
  - Champ input arrondi (radius 12px), bordure grise fine, fond blanc/gris très pâle, placeholder gris clair "aya.kouassi@example.com".
  - Label "MOT DE PASSE".
  - Champ input avec icône cadenas à gauche (grise), placeholder en points masqués, icône "œil" à droite pour afficher/masquer le mot de passe.
  - Lien "Mot de passe oublié ?" aligné à droite sous le champ, vert, taille ~12px.
  - Bouton plein largeur vert (`#2ECC71`), pill, texte blanc gras "Se connecter", hauteur ~52px, marge au-dessus ~24px.
  - Séparateur horizontal avec le mot "ou" centré dessus, ligne grise fine des deux côtés.
  - Bouton secondaire plein largeur, fond blanc, bordure grise fine, icône Google à gauche, texte "Continuer avec Google" en noir/gris.
  - En bas de l'écran, centré : texte gris "Pas encore de compte ? " suivi du lien vert gras "S'inscrire".

---

## 7. Inscription (Créer un compte)

**Prompt :**
Crée un écran d'inscription avec :
- Bandeau supérieur vert foncé dégradé (arrondi en bas, ~20% de la hauteur) contenant :
  - Flèche retour blanche en haut à gauche.
  - Titre "Créer un compte" blanc, gras, taille ~22px.
  - Sous-titre "Rejoignez la communauté RecyGo CI" vert très clair, taille ~13px.
- Sur fond blanc en dessous, formulaire avec 4 champs, chacun avec label gris majuscule au-dessus et une icône à gauche du champ :
  1. Label "NOM COMPLET" — icône personne — placeholder "Aya Kouassi".
  2. Label "TÉLÉPHONE" — icône téléphone — placeholder "+225 07 XX XX XX XX".
  3. Label "E-MAIL" — icône enveloppe — placeholder "aya@example.com".
  4. Label "MOT DE PASSE" — icône cadenas — placeholder en points masqués (avec option icône œil).
- Tous les champs : input arrondi (radius 12px), bordure grise fine, fond blanc.
- Bouton plein largeur vert, pill, texte blanc gras "Créer mon compte", marge au-dessus ~24px.
- Sous le bouton, petit texte gris centré sur 2 lignes : "En créant un compte, vous acceptez nos **Conditions d'utilisation** et notre **Politique de confidentialité**" — les deux termes en gras/vert et cliquables.

---

## 8. Accueil Citoyen (Dashboard)

**Prompt :**
Crée un écran d'accueil (dashboard) pour le profil "Citoyen" avec :
- **En-tête vert foncé** (haut de l'écran, ~30% hauteur, pas de courbe prononcée) :
  - Ligne du haut : à gauche "Bonjour" (petit, vert clair) puis "Aya Kouassi" (blanc, gras, ~18px) ; à droite une icône cloche de notification (cercle blanc/translucide) et un avatar rond avec initiales "AK" sur fond vert clair.
  - Sous cette ligne, 3 mini-cartes statistiques côte à côte (fond blanc translucide/vert clair, radius 14px, padding réduit) :
    - Icône feuille + "CO2 évité" + valeur "42 kg"
    - Icône recyclage + "Recyclé" + valeur "20 kg"
    - Icône portefeuille/pièce + "Revenus" + valeur "3 092 F"
- **Corps blanc** en dessous, qui remonte légèrement sur l'en-tête vert (radius haut ~24px) :
  - Grande carte blanche avec ombre : icône carrée verte pleine avec caméra blanche à gauche, titre gras "Scanner un déchet", sous-titre gris "Identifiez et estimez la valeur de vos déchets", flèche verte à droite.
  - Rangée de 3 boutons d'accès rapide (icône + label, carte arrondie pastel) :
    - "Mes collectes" — fond bleu pâle, icône boîte bleue.
    - "Recycleurs proches" — fond violet pâle, icône pin violette.
    - "Portefeuille" — fond jaune pâle, icône portefeuille jaune/orange.
  - Section "Recycleurs à proximité" (titre gras) avec lien "Voir tout" vert aligné à droite.
  - Liste horizontale scrollable de cartes recycleur (radius 16px, ombre légère), chacune avec : avatar rond initiales colorées (ex: "IC" fond bleu, "FT" fond violet, "Ec" fond orange), nom gras, catégorie grise (ex: "Plastiques & Métal"), note étoile (ex: "4.9") et distance (ex: "0.8 km").
  - Section "Collectes récentes" (titre gras) avec lien "Historique" vert aligné à droite.
- **Barre de navigation inférieure** fixe, fond blanc, 5 items : Accueil (icône maison, actif en vert), Historique (icône horloge), bouton central flottant rond vert avec icône caméra (Scanner, surélevé au-dessus de la barre), Portefeuille (icône portefeuille), Profil (icône personne).

---

## 9. Profil Citoyen

**Prompt :**
Crée un écran de profil utilisateur avec :
- **En-tête vert foncé** (haut, ~35% hauteur) :
  - Titre centré "Profil" en blanc.
  - Grand avatar rond (fond blanc, ~72px) avec initiales "AK" en vert gras, centré.
  - Sous l'avatar : nom "Aya Kouassi" blanc gras, taille ~18px.
  - Email en dessous, vert clair/blanc translucide, taille ~13px : "aya.kouassi@example.com".
  - Petit badge pill semi-transparent : "Membre depuis mai 2025".
  - Rangée de 3 statistiques séparées par de fines lignes verticales, texte blanc : "5 Collectes", "20 kg Recyclé", "3 092 F Revenus" (chiffre en gras au-dessus du libellé).
- **Corps blanc** en dessous (radius haut arrondi) contenant une liste verticale de 6 lignes de menu, chacune avec : icône dans un carré arrondi coloré à gauche, libellé au centre, chevron ">" à droite, séparateur fin entre chaque ligne :
  1. "Mes informations" — icône personne, fond bleu pâle.
  2. "Notifications" — icône cloche, fond orange pâle.
  3. "Sécurité & confidentialité" — icône bouclier, fond vert pâle.
  4. "Centre d'aide" — icône point d'interrogation, fond violet pâle.
  5. "Paramètres" — icône engrenage, fond gris pâle.
  6. "Déconnexion" — icône logout, fond rouge très pâle, **texte en rouge** (`#EF4444`) au lieu de noir.
- **Barre de navigation inférieure** identique à l'écran d'accueil, avec l'onglet "Profil" actif (en vert) cette fois.

---

## 10. Historique (Citoyen)

**Prompt :**
Crée un écran d'historique des collectes avec :
- Fond général blanc/gris très pâle.
- En haut, titre "Historique" en noir, gras, taille ~22px, aligné à gauche (pas de flèche retour visible).
- Sous le titre, une rangée de 3 filtres en pills horizontaux :
  - "Tout" — pill pleine verte (`#2ECC71`), texte blanc gras (état actif/sélectionné).
  - "En cours" — pill contour gris clair, texte gris, fond blanc.
  - "Terminé" — pill contour gris clair, texte gris, fond blanc.
- Sous les filtres, une rangée de 2 cartes côte à côte (largeur ~48% chacune, radius ~16px) :
  - Carte de gauche, plus large : fond vert plein (`#2ECC71` ou dégradé vert), texte "Total gagné" en blanc/vert clair petit, puis "3 092 FCFA" en blanc, très gras, grande taille (~22px).
  - Carte de droite : fond blanc avec ombre légère, texte "Collectes" gris petit en haut, "5" en noir très gras grande taille, puis "20 kg recyclés" en gris petit en dessous.
- Sous les cartes, une liste verticale d'items de transaction (fond blanc, séparateur fin ou léger espace entre chaque, pas de carte individuelle bordée) :
  - Chaque ligne contient :
    - À gauche : icône ronde verte pâle (`#E9F8EF`) contenant un petit symbole de recyclage vert.
    - Au centre : titre du déchet en gras noir (ex: "Plastique PET", "Carton", "Métal (alu)", "Bouteilles verre", "E-déchets"), et en dessous une ligne grise petite avec date, poids et nom du recycleur séparés par des points médians (ex: "18 juil. 2026 · 3.5 kg · Ibrahim C.").
    - À droite, aligné verticalement : montant en vert gras (ex: "+612 F", "+600 F", "+480 F", "+250 F", "+1150 F"), et en dessous un badge/texte petit gris "Terminé".
  - Répéter ce schéma pour 5 items avec les valeurs exactes ci-dessus.
- Barre de navigation inférieure identique aux autres écrans, onglet "Historique" actif (en vert).

---

## 11. Portefeuille (Citoyen)

**Prompt :**
Crée un écran de portefeuille/wallet avec :
- **En-tête vert foncé dégradé** (haut, ~35% hauteur) :
  - Ligne du haut : "Portefeuille" en blanc gras à gauche ; à droite une icône "..." (menu options) dans un cercle blanc translucide.
  - Centré en dessous : texte "Solde disponible" en vert clair petit, puis "4 250" en blanc très gras très grande taille (~36px), avec "FCFA" en blanc plus petit juste à côté ou en dessous.
  - Sous le solde, une rangée de 2 boutons côte à côte :
    - Bouton gauche : fond blanc plein, pill, icône flèche sortante + texte "Retirer" en vert foncé gras.
    - Bouton droit : fond vert translucide/contour blanc, pill, icône graphique + texte "Statistiques" en blanc gras.
- **Corps blanc** en dessous (radius haut arrondi, remonte légèrement sur le header vert) :
  - Carte avec ombre légère : titre "Revenus — Juillet 2026" en gras noir à gauche avec une petite flèche déroulante à côté (sélecteur de période). En dessous, un graphique en barres verticales (dégradé vert, coins arrondis en haut des barres), une barre par semaine, hauteurs variables représentant les revenus. Sous les barres, labels courts "S1" à "S6" (ou similaire) en gris petit centrés sous chaque barre.
  - Section "Transactions récentes" en gras noir.
  - Liste verticale d'items de transaction (même style que l'écran Historique mais plus compact, sans badge de statut) :
    - Icône ronde verte pâle avec symbole recyclage à gauche.
    - Titre gras noir au centre (ex: "Plastique PET", "Carton", "Métal (alu)") avec date grise petite en dessous (ex: "18 juil. 2026").
    - Montant vert gras aligné à droite (ex: "+612 F", "+600 F", "+480 F").
- Barre de navigation inférieure identique aux autres écrans, onglet "Portefeuille" actif (en vert).

---

## 12. Résultat IA (après scan)

**Prompt :**
Crée un écran affichant le résultat de l'analyse IA d'un déchet scanné, avec :
- **En-tête vert foncé** (haut, ~15% hauteur) : flèche retour blanche à gauche, titre "Résultat IA" blanc gras centré/à côté de la flèche, et à droite un badge pill vert clair/blanc translucide "✓ 94% confiance" en petit texte.
- **Corps blanc** en dessous (radius haut arrondi) :
  - Grande carte blanche avec ombre légère contenant :
    - Centré en haut : icône carrée arrondie fond vert très pâle avec une icône de boîte/colis 3D verte.
    - En dessous, une ligne à deux colonnes : à gauche "Plastique PET" en gras noir grande taille avec sous-titre gris "Bouteilles & emballages" ; à droite, aligné, "300–600" en vert gras très grande taille avec sous-titre gris petit "FCFA estimés" en dessous.
    - Une ligne de séparation fine, puis 3 mini-colonnes de statistiques centrées : "Poids estimé" (label gris) / "2-3 kg" (valeur noire grasse) ; "Prix / kg" / "150-200 F" ; "Qualité" / "Bonne" (en vert gras).
  - Carte "Impact environnemental" : fond vert pâle, radius ~16px, titre "Impact environnemental" en gras avec petite icône feuille à gauche. À l'intérieur, 2 sous-cartes côte à côte fond blanc/vert clair : "CO2 évité" "2.4 kg" et "Énergie économisée" "4.8 kWh".
  - Bouton plein largeur vert, pill, icône camion/main à gauche, texte blanc gras "Demander une collecte".
  - Sous le bouton, lien texte centré gris/noir "Rescanner" (sans fond, style secondaire).
- Barre de navigation inférieure identique aux autres écrans, bouton central Scanner actif (icône caméra en vert, légèrement surélevée).

---

## 13. Nouvelle collecte (formulaire de demande)

**Prompt :**
Crée un écran de formulaire pour planifier une collecte, avec :
- **En-tête vert foncé** (haut, ~12% hauteur) : flèche retour blanche à gauche, titre "Nouvelle collecte" blanc gras.
- **Corps blanc** en dessous :
  - Carte résumé en haut : petite icône boîte à gauche, texte "Plastique PET · 2-3 kg" en gras noir, et en dessous "Estimation : 300-600 FCFA" en gris petit.
  - Label section "ADRESSE DE COLLECTE" en gris majuscule petit.
  - Carte avec icône de localisation verte à gauche, adresse en gras noir "Cocody Angré, Rue 27" avec sous-ligne grise "Abidjan, Côte d'Ivoire", et à droite un lien "Modifier" en vert.
  - Label section "DISPONIBILITÉ" en gris majuscule petit.
  - Grille 2x2 de boutons pill sélectionnables :
    - "Aujourd'hui" — état sélectionné/actif : fond vert très pâle, bordure verte, texte vert gras.
    - "Demain" — état non sélectionné : bordure grise fine, fond blanc, texte gris/noir.
    - "Dans 2 jours" — même style non sélectionné.
    - "Choisir une date" — même style non sélectionné (avec éventuellement une petite icône calendrier).
  - Label section "NOTES (OPTIONNEL)" en gris majuscule petit.
  - Zone de texte multiligne (textarea), bordure grise fine, radius ~12px, placeholder gris italique : "Ex : Appelez avant de venir, entrée par le portail noir".
  - Bouton plein largeur vert, pill, icône check/validation à gauche, texte blanc gras "Confirmer la demande".
- Barre de navigation inférieure identique, Scanner actif au centre.

---

## 14. Suivi de collecte (tracking en temps réel)

**Prompt :**
Crée un écran de suivi de collecte en temps réel, avec :
- **En-tête vert foncé** (haut, ~10% hauteur) : flèche retour blanche à gauche, titre "Suivi de collecte" blanc gras.
- **Corps blanc** en dessous :
  - Carte info recycleur : avatar rond avec initiales "IC" (fond bleu), nom en gras noir "Ibrahim Coulibaly", sous-ligne grise "Recycleur certifié" avec étoile et note "4.8" ; à droite un bouton rond vert plein avec icône téléphone blanche (appel).
  - Bloc "mini-carte" : zone rectangulaire fond gris/vert très clair simulant une carte, avec un marqueur bleu (icône camion/véhicule) à gauche relié par une ligne pointillée verte à un marqueur vert (icône domicile/destination) à droite. Sous la mini-carte : texte "En route · 12 min" en vert avec petite icône camion.
  - Titre de section "Progression" en gras noir.
  - Liste verticale en timeline (ligne verticale reliant les points) de 5 étapes, chacune avec une icône ronde à gauche, un titre, un sous-titre gris, et une heure alignée à droite :
    1. Icône check vert (complété) — "Demande envoyée" (gras noir) — "Votre demande a été soumise" (gris) — "09:41" (gris, à droite).
    2. Icône check vert (complété) — "Recycleur trouvé" (gras noir) — "Ibrahim Coulibaly accepte" (gris) — "09:45".
    3. Icône ronde verte pleine/pulsante (étape en cours) — "En route vers vous" (gras vert, mis en avant) — "Arrivée estimée dans 12 min" (gris) — "10:02".
    4. Icône ronde vide grise (à venir) — "Collecte effectuée" (gris, atténué) — "Déchets récupérés et pesés" (gris clair) — "--".
    5. Icône ronde vide grise (à venir) — "Paiement reçu" (gris, atténué) — "Montant versé sur votre portefeuille" (gris clair) — "--".
- Barre de navigation inférieure identique, Scanner actif au centre.

---

## 15. Notifications

**Prompt :**
Crée un écran de liste de notifications, avec :
- Fond blanc/gris très pâle, pas de bandeau vert (header simple).
- En haut : titre "Notifications" en noir gras, taille ~22px, aligné à gauche ; à droite, lien "Tout lire" en vert, taille ~13px.
- En dessous, une liste verticale de cartes de notification (fond blanc, radius ~14px, ombre très légère, espacement ~12px entre chaque) :
  1. **Carte 1** : icône ronde verte pâle avec check ✓ à gauche. Titre en vert gras : "Collecte terminée !". Sous-titre gris : "Ibrahim a collecté vos déchets. 812 FCFA crédités." Heure petite grise en bas : "Il y a 5 min". Un petit point vert plein en haut à droite de la carte (indicateur "non lu").
  2. **Carte 2** : icône ronde bleu pâle avec camion/truck bleu à gauche. Titre en bleu gras : "Recycleur en route". Sous-titre gris : "Ibrahim Coulibaly arrive dans 12 minutes." Heure : "Il y a 12 min". Point vert "non lu" en haut à droite.
  3. **Carte 3** : icône ronde jaune/orange pâle avec étoile à gauche. Titre en noir/gris foncé gras (pas de couleur vive) : "Notez votre expérience". Sous-titre gris : "Comment s'est passée votre collecte du 18 juil. ?" Heure : "Hier". Pas de point (notification déjà lue).
  4. **Carte 4** : icône ronde verte pâle avec symbole recyclage à gauche. Titre en vert gras : "Impact ce mois". Sous-titre gris : "Vous avez évité 42 kg de CO2 ce mois-ci. Bravo !" Heure : "Il y a 3 j". Pas de point (lue).
- Chaque carte suit le même gabarit : icône (40x40px environ) à gauche, bloc texte (titre + description + heure) au centre/droite, point de statut "non lu" optionnel en haut à droite de la carte.
- Barre de navigation inférieure identique aux autres écrans (aucun onglet spécifique n'est mis en avant puisque Notifications est accessible depuis le Profil, pas depuis la tab bar — garder les 5 icônes dans leur état par défaut ou l'état de l'écran précédent).

---

## Notes générales pour l'agent

- Respecter une hiérarchie typographique cohérente sur tous les écrans : titres 20-28px/gras, sous-titres 13-15px/gris, labels de formulaire 11px/majuscules/gris.
- Les boutons principaux sont toujours en vert plein largeur, forme pill, avec un léger effet d'ombre.
- Les montants sont en Francs CFA, formatés avec espace comme séparateur de milliers. Les maquettes utilisent tantôt le suffixe complet "FCFA" (soldes/totaux, ex: "3 092 FCFA", "4 250 FCFA") tantôt l'abréviation "F" (lignes de transaction, ex: "+612 F") — à harmoniser avec l'équipe produit ou reproduire tel quel selon le contexte (montant principal vs. ligne de détail).
- Prévoir les états interactifs (focus des inputs, pression des boutons, item actif de la tab bar) même s'ils ne sont pas visibles sur les captures statiques.
- Si le projet utilise Expo Router + React Native (comme pour un stack `businessOnline`-like), organiser les écrans en fichiers séparés dans une structure de dossiers cohérente (`app/(auth)/login.tsx`, `app/(onboarding)/...`, `app/(app)/home.tsx`, etc.) et réutiliser des composants Design System (Text, Button, Input, Card, Badge) plutôt que de dupliquer les styles.