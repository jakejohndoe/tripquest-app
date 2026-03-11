import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'TripQuest' }} />
      <Stack.Screen name="connect-wallet" options={{ title: 'Connect Wallet' }} />
    </Stack>
  );
}