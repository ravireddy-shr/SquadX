import { motion } from 'framer-motion';
import { type FC } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export const WalletButton: FC = () => {
  const { account, connect, disconnect, isConnecting } = useWallet();

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">
          {account.slice(0, 8)}...{account.slice(-8)}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={disconnect}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all disabled:opacity-50"
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </motion.button>
  );
};
