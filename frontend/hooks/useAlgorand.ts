import { useState, useCallback } from 'react';
import { getAlgorandClient, isValidAlgorandAddress } from '../utils/algorand';

export function useAlgorand() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAccountInfo = useCallback(async (address: string) => {
    if (!isValidAlgorandAddress(address)) {
      setError('Invalid Algorand address');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const client = getAlgorandClient();
      const info = await client.accountInformation(address).do();
      return info;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get account info';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { getAccountInfo, loading, error, clearError };
}
