export interface User {
  id: string;
  walletAddress: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  questType: QuestType[];
  difficulty: DifficultyLevel;
  transportMode: TransportMode;
}

export enum QuestType {
  CITY = 'city',
  NATURE = 'nature',
  CULTURAL = 'cultural',
  FOOD = 'food',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum TransportMode {
  WALKING = 'walking',
  BIKING = 'biking',
  DRIVING = 'driving',
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  city: string;
  stops: QuestStop[];
  rewardAmount: number;
  badgeNftUri?: string;
  createdAt: Date;
}

export interface QuestStop {
  id: string;
  questId: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  qrCodePayload: string;
  orderIndex: number;
}

export interface CheckIn {
  id: string;
  userId: string;
  questId: string;
  stopId: string;
  timestamp: Date;
  verified: boolean;
}

export interface Badge {
  id: string;
  questId: string;
  userId: string;
  nftMintAddress: string;
  ipfsUri: string;
  mintedAt: Date;
}