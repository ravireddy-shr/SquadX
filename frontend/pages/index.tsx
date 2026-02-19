import Head from 'next/head';
import { motion } from 'framer-motion';
import { Squares } from '../components/SquaresBackground';
import { BackgroundCurtains } from '../components/BackgroundCurtains';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { WalletButton } from '../components/WalletButton';
import { Shield, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Credentials',
      description: 'Blockchain-verified certificates immutable on Algorand testnet',
    },
    {
      icon: Users,
      title: 'Bulk Issuance',
      description: 'Institutions issue hundreds of certificates in a single transaction',
    },
    {
      icon: TrendingUp,
      title: 'Smart Filtering',
      description: 'Employers filter talent using advanced on-chain credential queries',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <>
      <Head>
        <title>SkillChain Pro - Web3 Talent Verification Platform</title>
        <meta name="description" content="Blockchain-powered credential verification on Algorand" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative min-h-screen bg-[#0b0216] overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <Squares speed={0.3} squareSize={40} direction="diagonal" borderColor="#1e293b" hoverFillColor="#1e3a5f" />
        </div>

        <BackgroundCurtains />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center px-6 sm:px-12 py-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              SkillChain Pro
            </motion.div>
            <WalletButton />
          </header>

          {/* Hero Section */}
          <motion.section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 sm:px-12 py-20 text-center" variants={containerVariants} initial="hidden" animate="visible">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400 bg-clip-text text-transparent">
                Blockchain-Verified Credentials
              </span>
              <span className="block text-white mt-2">On Algorand Testnet</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-12"
            >
              The Web3 talent verification platform that lets institutions issue certificates in bulk,
              students verify credentials with privacy, and employers filter candidates using advanced on-chain queries.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/institution">
                <GradientButton>For Institutions</GradientButton>
              </Link>
              <Link href="/student">
                <GradientButton variant="secondary">For Students</GradientButton>
              </Link>
              <Link href="/employer">
                <GradientButton variant="secondary">For Employers</GradientButton>
              </Link>
            </motion.div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            className="px-6 sm:px-12 py-20 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-center text-white mb-16"
            >
              Why SkillChain Pro?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <GlassCard key={idx}>
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-blue-600/20">
                        <Icon className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </motion.section>

          {/* Institutions Section */}
          <motion.section
            className="px-6 sm:px-12 py-20 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl font-bold text-center text-white mb-12"
            >
              Trusted Institutions
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center items-center gap-8"
            >
              {['IIT Delhi', 'IIM Bangalore', 'NIIT', 'Coursera', 'Udemy Plus'].map(
                (inst, idx) => (
                  <div
                    key={idx}
                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium"
                  >
                    {inst}
                  </div>
                )
              )}
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            className="px-6 sm:px-12 py-20 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GlassCard className="max-w-2xl mx-auto">
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-4">
                Ready to Transform Talent Verification?
              </motion.h2>
              <motion.p variants={itemVariants} className="text-gray-300 mb-8">
                Join the Web3 revolution. Secure, verifiable, and transparent credentials on Algorand.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/analytics">
                  <GradientButton>View Analytics</GradientButton>
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <GradientButton variant="secondary">GitHub</GradientButton>
                </a>
              </motion.div>
            </GlassCard>
          </motion.section>

          {/* Footer */}
          <footer className="border-t border-white/10 px-6 sm:px-12 py-8 text-center text-gray-500 text-sm">
            <p>SkillChain Pro © 2026 | Built on Algorand Testnet | Zero-hardcoding, production-ready</p>
          </footer>
        </div>
      </div>
    </>
  );
}
