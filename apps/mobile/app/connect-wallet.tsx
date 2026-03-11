import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { connectWallet, disconnectWallet, shortenAddress, WalletAccount } from '../lib/wallet';

export default function ConnectWalletScreen() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [wallet, setWallet] = useState<WalletAccount | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const account = await connectWallet();
      if (account) {
        setWallet(account);
        Alert.alert(
          'Wallet Connected',
          `Connected to ${shortenAddress(account.address)}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Connection Failed', 'Could not connect to wallet. Please try again.', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setWallet(null);
      Alert.alert('Wallet Disconnected', 'Your wallet has been disconnected.', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white px-6">
      <StatusBar style="auto" />

      <View className="flex-1 justify-center">
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-6">
            <View className="w-16 h-16 bg-purple-600 rounded-full" />
          </View>

          <Text className="text-3xl font-bold text-gray-900 mb-3">Connect Your Wallet</Text>
          <Text className="text-lg text-gray-600 text-center">
            Connect your Phantom wallet to start earning TRIPQ tokens on your travel quests
          </Text>
        </View>

        <View className="space-y-4">
          {!wallet ? (
            <Pressable
              onPress={handleConnect}
              disabled={isConnecting}
              className={`bg-purple-600 py-4 px-6 rounded-2xl flex-row justify-center items-center ${
                isConnecting ? 'opacity-50' : 'active:opacity-80'
              }`}
            >
              {isConnecting ? (
                <>
                  <ActivityIndicator color="white" size="small" className="mr-2" />
                  <Text className="text-white font-semibold text-lg">Connecting...</Text>
                </>
              ) : (
                <Text className="text-white font-semibold text-lg">Connect Phantom Wallet</Text>
              )}
            </Pressable>
          ) : (
            <>
              <View className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <Text className="text-green-800 font-medium text-center mb-1">
                  Wallet Connected
                </Text>
                <Text className="text-green-600 text-center font-mono">
                  {shortenAddress(wallet.address, 6)}
                </Text>
              </View>

              <Pressable
                onPress={handleDisconnect}
                className="bg-red-50 border border-red-200 py-4 px-6 rounded-2xl active:opacity-80"
              >
                <Text className="text-red-600 font-semibold text-lg text-center">
                  Disconnect Wallet
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Alert.alert(
                    'Ready to Quest!',
                    'Your wallet is connected. Next features coming soon!',
                    [{ text: 'OK' }]
                  );
                }}
                className="bg-purple-600 py-4 px-6 rounded-2xl active:opacity-80"
              >
                <Text className="text-white font-semibold text-lg text-center">
                  Start Your Quest
                </Text>
              </Pressable>
            </>
          )}
        </View>

        <View className="mt-12">
          <Text className="text-sm text-gray-500 text-center">
            We use the Solana Mobile Wallet Adapter to securely connect to your wallet.
            Your private keys never leave your device.
          </Text>
        </View>
      </View>

      <View className="pb-8">
        <Pressable
          onPress={() => router.back()}
          className="py-3 px-6 active:opacity-80"
        >
          <Text className="text-purple-600 font-medium text-center">Back</Text>
        </Pressable>
      </View>
    </View>
  );
}