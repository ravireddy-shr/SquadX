import { motion } from 'framer-motion';
import { type FC } from 'react';
import { GlassCard } from './GlassCard';
import { X } from 'lucide-react';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  degree: string;
  institution: string;
  cgpa: string;
  skills: string[];
  issueDate: string;
  explorerLink?: string;
  onDownloadReport?: () => void;
}

export const CandidateModal: FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  degree,
  institution,
  cgpa,
  skills,
  issueDate,
  explorerLink,
  onDownloadReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl"
      >
        <GlassCard className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{candidateName}</h2>
              <p className="text-gray-400">{institution}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Degree</p>
                <p className="text-white font-semibold">{degree}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">CGPA</p>
                <p className="text-white font-semibold">{cgpa}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Issued: {issueDate}</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              {explorerLink && (
                <a
                  href={explorerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-center text-sm font-medium transition-colors"
                >
                  View on Explorer
                </a>
              )}
              {onDownloadReport && (
                <button
                  onClick={onDownloadReport}
                  className="flex-1 px-4 py-2 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-sm font-medium transition-colors"
                >
                  Download Report
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
