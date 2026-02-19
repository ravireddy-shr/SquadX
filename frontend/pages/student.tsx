import { useState, useCallback } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import { Squares } from '../components/SquaresBackground';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { WalletButton } from '../components/WalletButton';
import { CertificateCard } from '../components/CertificateCard';
import { useWallet } from '../hooks/useWallet';
import { hashAadhar, AadharSchema } from '../utils/hash';
import { generateCertificatePDF } from '../utils/pdf';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface Certificate {
  id: string;
  degree: string;
  cgpa: string;
  institution: string;
  issueDate: string;
  status: 'active' | 'revoked';
}

export default function StudentDashboard() {
  const { account } = useWallet();
  const [aadhar, setAadhar] = useState('');
  const [aadharHash, setAadharHash] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState('');
  const [showAadhar, setShowAadhar] = useState(false);

  const handleVerify = useCallback(async () => {
    setError(null);

    try {
      // Validate Aadhar
      AadharSchema.parse(aadhar);

      setLoading(true);

      // Hash Aadhar (client-side only)
      const hash = await hashAadhar(aadhar);
      setAadharHash(hash);

      // Simulate fetching certificates from blockchain
      // In production, this would query the smart contract
      const mockCerts: Certificate[] = [
        {
          id: 'CERT-001-2024',
          degree: 'B.Tech Computer Science',
          cgpa: '8.5',
          institution: 'IIT Delhi',
          issueDate: 'Mar 15, 2024',
          status: 'active',
        },
      ];

      setCertificates(mockCerts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [aadhar]);

  const handleDownloadPDF = useCallback((cert: Certificate) => {
    generateCertificatePDF({
      certificateId: cert.id,
      studentName: account || 'Student Name',
      degree: cert.degree,
      cgpa: cert.cgpa,
      institution: cert.institution,
      issueDate: cert.issueDate,
      skills: ['Python', 'React', 'SQL'],
      explorerLink: `https://testnet.algoexplorer.io/address/${account || ''}`,
    });
  }, [account]);

  return (
    <>
      <Head>
        <title>Student Dashboard - SkillChain Pro</title>
        <meta name="description" content="Verify and manage your blockchain credentials" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative min-h-screen bg-[#0b0216] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="#1e293b"
            hoverFillColor="#1e3a5f"
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center px-6 sm:px-12 py-6 border-b border-white/10">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent cursor-pointer">
                SkillChain Pro
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Student Dashboard</span>
              <WalletButton />
            </div>
          </header>

          {/* Main Content */}
          <main className="px-6 sm:px-12 py-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Aadhar Verification Section */}
              <GlassCard>
                <h2 className="text-2xl font-bold text-white mb-6">Verify Your Credentials</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Aadhar Number
                    </label>
                    <div className="relative">
                      <input
                        type={showAadhar ? 'text' : 'password'}
                        value={aadhar}
                        onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        placeholder="12-digit Aadhar"
                        maxLength={12}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                      />
                      <button
                        onClick={() => setShowAadhar(!showAadhar)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showAadhar ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your Aadhar is hashed locally using SHA-256 and never sent to any server.
                    </p>
                  </div>

                  {error && (
                    <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {aadharHash && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-sm text-gray-400">Aadhar Hash (SHA-256)</p>
                      <p className="text-xs text-green-300 font-mono break-all">{aadharHash}</p>
                    </div>
                  )}

                  <GradientButton
                    onClick={handleVerify}
                    disabled={aadhar.length < 12 || loading}
                    className="w-full"
                  >
                    {loading ? 'Verifying...' : 'Verify Credentials'}
                  </GradientButton>
                </div>
              </GlassCard>

              {/* Certificates Section */}
              {certificates.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Your Certificates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert) => (
                      <CertificateCard
                        key={cert.id}
                        certificateId={cert.id}
                        degree={cert.degree}
                        cgpa={cert.cgpa}
                        institution={cert.institution}
                        issueDate={cert.issueDate}
                        status={cert.status}
                        onDownloadPDF={() => handleDownloadPDF(cert)}
                        onShowQR={() => {
                          setSelectedCertId(cert.id);
                          setShowQRModal(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!certificates.length && aadharHash && (
                <GlassCard>
                  <p className="text-gray-400 text-center">
                    No active certificates found for this Aadhar hash. Contact your institution if you believe this is an error.
                  </p>
                </GlassCard>
              )}
            </motion.div>
          </main>

          {/* QR Code Modal */}
          {showQRModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-8 shadow-2xl"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-6">Certificate QR Code</h3>
                  <div className="bg-white p-4 rounded-lg inline-block mb-6">
                    <QRCode value={selectedCertId} size={200} level="H" includeMargin={true} />
                  </div>
                  <p className="text-sm text-gray-400 mb-6">{selectedCertId}</p>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="px-6 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Footer */}
          <footer className="border-t border-white/10 px-6 sm:px-12 py-6 text-center text-gray-500 text-sm">
            <p>Privacy-first verification | SHA-256 hashing on client-side only</p>
          </footer>
        </div>
      </div>
    </>
  );
}
