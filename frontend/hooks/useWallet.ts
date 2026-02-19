import { useState, useCallback } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

const peraWallet = new PeraWalletConnect();

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      const accounts = await peraWallet.connect();
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      peraWallet.disconnect();
      setAccount(null);
      localStorage.removeItem('walletAddress');
    } catch (error) {
      console.error('Wallet disconnect failed:', error);
    }
  }, []);

  // Restore wallet connection on mount
  const [isInitialized, setIsInitialized] = useState(false);
  if (!isInitialized) {
    const savedAddress = typeof window !== 'undefined' ? localStorage.getItem('walletAddress') : null;
    if (savedAddress) {
      setAccount(savedAddress);
    }
    setIsInitialized(true);
  }

  return { account, connect, disconnect, isConnecting };
}
