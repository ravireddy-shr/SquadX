import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';

const peraWallet = new PeraWalletConnect();

export interface AlgorandAccount {
  address: string;
  name: string;
}

export async function connectWallet(): Promise<string[] | null> {
  try {
    const accounts = await peraWallet.connect();
    return accounts;
  } catch (error) {
    console.error('Wallet connection failed:', error);
    return null;
  }
}

export function disconnectWallet(): void {
  peraWallet.disconnect();
}

export function getSignedTransactions() {
  return peraWallet.signTransaction;
}

/**
 * Get Algorand client configured for testnet
 */
export function getAlgorandClient() {
  const token = process.env.NEXT_PUBLIC_ALGOD_TOKEN || '';
  const server = process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
  
  return new algosdk.Algodv2(token, server, 443);
}

/**
 * Get account information from blockchain
 */
export async function getAccountInfo(address: string) {
  try {
    const client = getAlgorandClient();
    const accountInfo = await client.accountInformation(address).do();
    return accountInfo;
  } catch (error) {
    console.error('Failed to get account info:', error);
    return null;
  }
}

/**
 * Validate Algorand address format
 */
export function isValidAlgorandAddress(address: string): boolean {
  if (!address || address.length !== 58) return false;
  try {
    algosdk.decodeAddress(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get explorer link for Algorand testnet
 */
export function getExplorerLink(
  address: string,
  type: 'account' | 'transaction' = 'account'
): string {
  const baseUrl = 'https://testnet.algoexplorer.io';
  if (type === 'account') {
    return `${baseUrl}/address/${address}`;
  }
  return `${baseUrl}/tx/${address}`;
}
