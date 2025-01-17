import React from 'react';
import { ChevronDown } from 'lucide-react';
import { TokenWithBalance } from '../types';
import { formatNumber } from '../lib/utils';

interface TokenSelectProps {
  tokens: TokenWithBalance[];
  selectedToken: string;
  onSelect: (currency: string) => void;
  label: string;
}

export function TokenSelect({ tokens, selectedToken, onSelect, label }: TokenSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedTokenData = tokens.find(t => t.currency === selectedToken);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-gray-800 rounded-lg p-3 text-left hover:bg-gray-700 transition-colors"
      >
        {selectedTokenData ? (
          <>
            <div className="flex items-center gap-2">
              <img
                src={selectedTokenData.icon}
                alt={selectedTokenData.currency}
                className="w-6 h-6"
              />
              <span className="font-medium">{selectedTokenData.currency}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </>
        ) : (
          <span>Select {label}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl max-h-60 overflow-auto z-10">
          {tokens.map((token, index) => (
            <button
              key={`${token.currency}-${token.date}-${index}`}
              type="button"
              onClick={() => {
                onSelect(token.currency);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src={token.icon} alt={token.currency} className="w-6 h-6" />
                <span>{token.currency}</span>
              </div>
              <span className="text-sm text-gray-400">
                Balance: {formatNumber(token.balance)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}