import { Stack } from 'expo-router';

export default function ProLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="demandes" />
    </Stack>
  );
}

