import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Squares } from '../components/SquaresBackground';
import { GradientButton } from '../components/GradientButton';
import { AlertCircle } from 'lucide-react';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | SkillChain Pro</title>
      </Head>

      <div className="relative min-h-screen bg-[#0b0216] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="#1e293b"
            hoverFillColor="#1e3a5f"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6"
        >
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-blue-400" />
          </div>

          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-2xl text-gray-300 mb-2">Page Not Found</p>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Navigate back to the main site.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <GradientButton>Back to Home</GradientButton>
            </Link>
            <Link href="/analytics">
              <GradientButton variant="secondary">View Analytics</GradientButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
