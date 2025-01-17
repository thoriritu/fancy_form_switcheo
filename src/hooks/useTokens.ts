import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Token, TokenWithBalance } from '../types';
import { getTokenIcon } from '../lib/utils';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';

async function fetchTokenPrices(): Promise<Token[]> {
  const { data } = await axios.get<Token[]>(PRICES_URL);
  return data;
}

// Simulated balances for demo purposes
const mockBalances: Record<string, number> = {
  'SWTH': 1000,
  'ETH': 5,
  'BTC': 0.5,
  'USDC': 5000,
};

export function useTokens() {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: async () => {
      const tokens = await fetchTokenPrices();
      return tokens
        .filter(token => token.price) // Only include tokens with prices
        .map(token => ({
          ...token,
          balance: mockBalances[token.currency] || 0,
          icon: getTokenIcon(token.currency),
        })) as TokenWithBalance[];
    },
  });
}