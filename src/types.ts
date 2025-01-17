export interface Token {
  currency: string;
  price: number;
  date: string;
}

export interface TokenWithBalance extends Token {
  balance: number;
  icon: string;
}

export type OrderType = 'market' | 'limit';
export type TradeType = 'buy' | 'sell' | 'swap';

export interface SwapFormData {
  fromToken: string;
  toToken: string;
  amount: string;
  orderType: OrderType;
  tradeType: TradeType;
  limitPrice?: string;
}