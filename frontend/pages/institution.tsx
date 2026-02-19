import { useState, useCallback, type ChangeEvent } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { Squares } from '../components/SquaresBackground';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { WalletButton } from '../components/WalletButton';
import { useWallet } from '../hooks/useWallet';
import { BulkCertificateSchema, Certificate } from '../utils/hash';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InstitutionDashboard() {
  const { account, connect } = useWallet();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [issuedLog, setIssuedLog] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCSVUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const data = results.data as Certificate[];
            const filtered = data.filter(
              (row) => Object.values(row).some((val) => val !== '')
            );
            const validated = BulkCertificateSchema.parse(filtered);
            setCertificates(validated);
            setError(null);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : 'Failed to parse CSV'
            );
          }
        },
        error: () => {
          setError('Failed to read CSV file');
        },
      });
    },
    []
  );

  const handleIssueAll = useCallback(async () => {
    if (!account) {
      await connect();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate issuing certificates
      // In production, this would call the smart contract
      const logs: string[] = [];

      for (const cert of certificates) {
        logs.push(
          `✓ Issued certificate to ${cert.student_address.slice(0, 8)}... | ${cert.degree_type} | ${cert.institution_name}`
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setIssuedLog(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue certificates');
    } finally {
      setIsLoading(false);
    }
  }, [account, certificates, connect]);

  return (
    <>
      <Head>
        <title>Institution Dashboard - SkillChain Pro</title>
        <meta name="description" content="Bulk issue blockchain certificates" />
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
              <span className="text-sm text-gray-400">Institution Dashboard</span>
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
              {/* Upload Section */}
              <GlassCard>
                <h2 className="text-2xl font-bold text-white mb-6">Bulk Certificate Upload</h2>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-8 text-center hover:border-blue-500/60 transition-colors">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-white font-semibold">Click to upload CSV</span>
                      <p className="text-gray-400 text-sm mt-2">
                        Format: student_address, aadhar_hash, degree_type, cgpa, skillset, certification_type, institution_name
                      </p>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {error && (
                    <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {certificates.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 text-sm">
                          {certificates.length} certificates ready to issue
                        </span>
                      </div>

                      {/* Preview Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-400 border-b border-white/10">
                              <th className="px-4 py-2">Student Address</th>
                              <th className="px-4 py-2">Degree</th>
                              <th className="px-4 py-2">Institution</th>
                              <th className="px-4 py-2">CGPA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {certificates.slice(0, 5).map((cert, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-white/5 hover:bg-white/5 transition"
                              >
                                <td className="px-4 py-2 text-gray-300 font-mono text-xs">
                                  {cert.student_address.slice(0, 12)}...
                                </td>
                                <td className="px-4 py-2 text-white">{cert.degree_type}</td>
                                <td className="px-4 py-2 text-white">{cert.institution_name}</td>
                                <td className="px-4 py-2 text-white">{cert.cgpa}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {certificates.length > 5 && (
                          <p className="text-gray-400 text-sm p-4 text-center">
                            ...and {certificates.length - 5} more
                          </p>
                        )}
                      </div>

                      <GradientButton
                        onClick={handleIssueAll}
                        disabled={isLoading || !account}
                        className="w-full"
                      >
                        {isLoading ? 'Issuing...' : account ? 'Issue All Certificates' : 'Connect Wallet to Issue'}
                      </GradientButton>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Transaction Log */}
              {issuedLog.length > 0 && (
                <GlassCard>
                  <h3 className="text-xl font-bold text-white mb-4">Issuance Log</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {issuedLog.map((log, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-mono"
                      >
                        {log}
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Verify Certificate History */}
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Certificate History</h3>
                <p className="text-gray-400 text-sm">
                  Issued certificates will appear here with verification status. Connect wallet to view your issued certificates on the Algorand blockchain.
                </p>
              </GlassCard>
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 px-6 sm:px-12 py-6 text-center text-gray-500 text-sm">
            <p>Built on Algorand Testnet | Bulk issuance powered by Beaker + PyTEAL</p>
          </footer>
        </div>
      </div>
    </>
  );
}
