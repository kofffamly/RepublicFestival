import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="shared" />
          <Stack.Screen name="camera" />
          <Stack.Screen name="analyse" />
          <Stack.Screen name="argent" />
          <Stack.Screen name="explore" />
          <Stack.Screen name="pro" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
