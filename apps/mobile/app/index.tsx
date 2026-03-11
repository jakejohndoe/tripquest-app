import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <StatusBar style="auto" />
      <Text className="text-3xl font-bold mb-8">TripQuest</Text>
      <Text className="text-lg text-gray-600 mb-8">AI-powered travel adventures</Text>
      <Pressable
        onPress={() => router.push('/connect-wallet')}
        className="bg-purple-600 px-8 py-3 rounded-full active:opacity-80"
      >
        <Text className="text-white font-semibold text-lg">Get Started</Text>
      </Pressable>
    </View>
  );
}