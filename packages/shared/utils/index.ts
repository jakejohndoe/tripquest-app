export const formatTokenAmount = (amount: number, decimals: number = 9): string => {
  return (amount / Math.pow(10, decimals)).toFixed(2);
};

export const shortenAddress = (address: string, chars: number = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const validateQuestCheckIn = (
  questId: string,
  stopId: string,
  userId: string,
  timestamp: Date
): boolean => {
  return !!(questId && stopId && userId && timestamp);
};