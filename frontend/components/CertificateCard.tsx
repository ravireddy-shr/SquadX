import { motion } from 'framer-motion';
import { type FC } from 'react';
import { GlassCard } from './GlassCard';
import { Download, QrCode } from 'lucide-react';

interface CertificateCardProps {
  certificateId: string;
  degree: string;
  cgpa: string;
  institution: string;
  issueDate: string;
  status: 'active' | 'revoked';
  onDownloadPDF?: () => void;
  onShowQR?: () => void;
}

export const CertificateCard: FC<CertificateCardProps> = ({
  certificateId,
  degree,
  cgpa,
  institution,
  issueDate,
  status,
  onDownloadPDF,
  onShowQR,
}) => {
  const statusColor = status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{degree}</h3>
          <p className="text-sm text-gray-400">{institution}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400">Certificate ID</p>
          <p className="text-white font-mono text-xs truncate">{certificateId}</p>
        </div>
        <div>
          <p className="text-gray-400">CGPA</p>
          <p className="text-white">{cgpa}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10">
        <p className="text-xs text-gray-500 mb-3">Issued: {issueDate}</p>
        <div className="flex gap-2">
          {onDownloadPDF && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownloadPDF}
              className="flex-1 flex items-center gap-2 justify-center px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          )}
          {onShowQR && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowQR}
              className="flex-1 flex items-center gap-2 justify-center px-3 py-2 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-sm transition-colors"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </motion.button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
