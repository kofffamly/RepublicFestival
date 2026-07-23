/**
 * Layout Stack pour l'espace Citoyen
 *
 * Gère la navigation entre les écrans réservés aux citoyens :
 * - new-request : Prise de photo et analyse IA
 *
 * TODO V2: Ajouter ici les autres écrans citoyens (historique, collectes, etc.)
 */

import { Stack } from 'expo-router';

export default function CitizenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new-request" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="tracking" />
    </Stack>
  );
}
