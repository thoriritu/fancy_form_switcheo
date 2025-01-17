import React from 'react';
import { ArrowDownUp, Loader2 } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTokens } from './hooks/useTokens';
import { TokenSelect } from './components/TokenSelect';
import { OrderType, SwapFormData, TradeType } from './types';
import { cn, formatNumber } from './lib/utils';

const queryClient = new QueryClient();

function SwapForm() {
  const { data: tokens, isLoading } = useTokens();
  const [formData, setFormData] = React.useState<SwapFormData>({
    fromToken: '',
    toToken: '',
    amount: '',
    orderType: 'market',
    tradeType: 'swap',
    limitPrice: '',
  });
  const [isSwapping, setIsSwapping] = React.useState(false);

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSwapping(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSwapping(false);
    // Reset form
    setFormData({
      fromToken: '',
      toToken: '',
      amount: '',
      orderType: 'market',
      tradeType: 'swap',
      limitPrice: '',
    });
  };

  const switchTokens = () => {
    setFormData(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
    }));
  };

  if (isLoading || !tokens) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const fromToken = tokens.find(t => t.currency === formData.fromToken);
  const toToken = tokens.find(t => t.currency === formData.toToken);
  const exchangeRate = fromToken && toToken ? toToken.price / fromToken.price : null;
  const estimatedOutput = exchangeRate && formData.amount ? 
    Number(formData.amount) * (formData.orderType === 'limit' && formData.limitPrice 
      ? Number(formData.limitPrice) 
      : exchangeRate) 
    : null;

  return (
    <form onSubmit={handleSwap} className="w-full max-w-md space-y-4">
      <div className="flex gap-2 p-1 bg-gray-800 rounded-lg mb-6">
        {(['swap', 'buy', 'sell'] as TradeType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, tradeType: type }))}
            className={cn(
              "flex-1 py-2 px-4 rounded-md font-medium capitalize transition-colors",
              formData.tradeType === type ? "bg-blue-600" : "hover:bg-gray-700"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex gap-2 p-1 bg-gray-800 rounded-lg mb-6">
        {(['market', 'limit'] as OrderType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, orderType: type }))}
            className={cn(
              "flex-1 py-2 px-4 rounded-md font-medium capitalize transition-colors",
              formData.orderType === type ? "bg-blue-600" : "hover:bg-gray-700"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {formData.tradeType === 'buy' ? 'Pay With' : 'From'}
        </label>
        <TokenSelect
          tokens={tokens}
          selectedToken={formData.fromToken}
          onSelect={currency => setFormData(prev => ({ ...prev, fromToken: currency }))}
          label="token"
        />
        <input
          type="number"
          value={formData.amount}
          onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="0.0"
          className="w-full bg-gray-800 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fromToken && (
          <p className="text-sm text-gray-400">
            Balance: {formatNumber(fromToken.balance)} {fromToken.currency}
          </p>
        )}
      </div>

      {formData.tradeType === 'swap' && (
        <button
          type="button"
          onClick={switchTokens}
          className="mx-auto block p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <ArrowDownUp className="w-4 h-4" />
        </button>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {formData.tradeType === 'buy' ? 'Buy' : formData.tradeType === 'sell' ? 'Sell' : 'To'}
        </label>
        <TokenSelect
          tokens={tokens}
          selectedToken={formData.toToken}
          onSelect={currency => setFormData(prev => ({ ...prev, toToken: currency }))}
          label="token"
        />
        
        {formData.orderType === 'limit' && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Limit Price
            </label>
            <input
              type="number"
              value={formData.limitPrice}
              onChange={e => setFormData(prev => ({ ...prev, limitPrice: e.target.value }))}
              placeholder={`Price in ${formData.toToken}`}
              className="w-full bg-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {estimatedOutput && (
          <div className="bg-gray-800 rounded-lg p-3 mt-2">
            <p className="text-lg">{formatNumber(estimatedOutput)}</p>
            <p className="text-sm text-gray-400">
              1 {formData.fromToken} = {formatNumber(formData.orderType === 'limit' && formData.limitPrice 
                ? Number(formData.limitPrice) 
                : exchangeRate!)} {formData.toToken}
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!formData.fromToken || !formData.toToken || !formData.amount || isSwapping || 
          (formData.orderType === 'limit' && !formData.limitPrice)}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-medium transition-colors",
          "bg-blue-600 hover:bg-blue-700",
          "disabled:bg-gray-600 disabled:cursor-not-allowed"
        )}
      >
        {isSwapping ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {formData.tradeType === 'buy' ? 'Buying...' : 
             formData.tradeType === 'sell' ? 'Selling...' : 
             'Swapping...'}
          </span>
        ) : (
          formData.tradeType === 'buy' ? 'Buy' : 
          formData.tradeType === 'sell' ? 'Sell' : 
          'Swap'
        )}
      </button>
    </form>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700">
            <h1 className="text-2xl font-bold mb-6">Trade Tokens</h1>
            <SwapForm />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;