import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export const SOLANA_RPC_ENDPOINT = clusterApiUrl('devnet');
export const connection = new Connection(SOLANA_RPC_ENDPOINT);

export interface WalletAccount {
  address: string;
  publicKey: PublicKey;
}

export async function connectWallet(): Promise<WalletAccount | null> {
  try {
    const result = await transact(async (wallet) => {
      const authorizationResult = await wallet.authorize({
        cluster: 'devnet',
        identity: {
          name: 'TripQuest',
          uri: 'https://tripquest.ai',
          icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjOUI1OUI2Ii8+CjxwYXRoIGQ9Ik0zNSAzNUw1MCA1MEw2NSAzNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTUwIDUwTDUwIDcwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=',
        },
      });

      if (!authorizationResult.accounts || authorizationResult.accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const firstAccount = authorizationResult.accounts[0];
      const publicKey = new PublicKey(firstAccount.address);

      return {
        address: firstAccount.address,
        publicKey,
      };
    });

    return result;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
}

export async function disconnectWallet(): Promise<void> {
  try {
    await transact(async (wallet) => {
      await wallet.deauthorize({ auth_token: '' });
    });
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
  }
}

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}