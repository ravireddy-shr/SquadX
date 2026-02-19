import { useState, type ReactNode } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Squares } from '../components/SquaresBackground';
import { BackgroundCurtains } from '../components/BackgroundCurtains';
import { GlassCard } from '../components/GlassCard';
import { WalletButton } from '../components/WalletButton';
import { TrendingUp, Users, Award, Building } from 'lucide-react';
import Link from 'next/link';

interface StatCard {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

const degreeData = [
  { name: 'B.Tech', value: 45 },
  { name: 'MBA', value: 25 },
  { name: 'Diploma', value: 20 },
  { name: 'Certification', value: 10 },
];

const skillsData = [
  { name: 'Python', count: 38 },
  { name: 'React', count: 32 },
  { name: 'Finance', count: 25 },
  { name: 'SQL', count: 34 },
  { name: 'Machine Learning', count: 22 },
  { name: 'Excel', count: 28 },
];

const issuanceData = [
  { month: 'Jan', certificates: 120 },
  { month: 'Feb', certificates: 150 },
  { month: 'Mar', certificates: 180 },
  { month: 'Apr', certificates: 210 },
  { month: 'May', certificates: 245 },
  { month: 'Jun', certificates: 310 },
];

const COLORS = ['#2563EB', '#0D9488', '#8B5CF6', '#EC4899'];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const stats: StatCard[] = [
    {
      label: 'Total Certificates',
      value: '1,215',
      icon: <Award className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-400',
    },
    {
      label: 'Active',
      value: '1,189',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-600 to-green-400',
    },
    {
      label: 'Revoked',
      value: '26',
      icon: <Users className="w-6 h-6" />,
      color: 'from-red-600 to-red-400',
    },
    {
      label: 'Institutions',
      value: '12',
      icon: <Building className="w-6 h-6" />,
      color: 'from-teal-600 to-teal-400',
    },
  ];

  return (
    <>
      <Head>
        <title>Analytics Dashboard - SkillChain Pro</title>
        <meta name="description" content="Platform analytics and insights" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="relative min-h-screen bg-[#0b0216] overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <Squares
            speed={0.3}
            squareSize={40}
            direction="diagonal"
            borderColor="#1e293b"
            hoverFillColor="#1e3a5f"
          />
        </div>

        <BackgroundCurtains />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center px-6 sm:px-12 py-6 border-b border-white/10">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent cursor-pointer">
                SkillChain Pro
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Analytics</span>
              <WalletButton />
            </div>
          </header>

          {/* Main Content */}
          <main className="px-6 sm:px-12 py-12 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Time Range Selector */}
              <div className="flex gap-3">
                {(['7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      timeRange === range
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    Last {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                  <GlassCard key={idx}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                        {stat.icon}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Degree Distribution */}
                <GlassCard>
                  <h3 className="text-lg font-bold text-white mb-6">Degree Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={degreeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {degreeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a0b2e',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </GlassCard>

                {/* Skills Frequency */}
                <GlassCard>
                  <h3 className="text-lg font-bold text-white mb-6">Top Skills</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a0b2e',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="count" fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>

              {/* Issuance Over Time */}
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-6">Certificate Issuance Trend</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={issuanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a0b2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="certificates"
                      stroke="#0D9488"
                      strokeWidth={3}
                      dot={{ fill: '#2563EB', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Key Insights */}
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-4">Key Insights</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">
                      <strong>Python</strong> is the most sought-after skill, appearing in 38 certificates (31% of total)
                    </p>
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">
                      <strong>B.Tech graduates</strong> represent 45% of active certificates, with average CGPA of 8.2
                    </p>
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">
                      Issuance rate growing <strong>~40% monthly</strong>, with 310 certificates issued in June
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 px-6 sm:px-12 py-6 text-center text-gray-500 text-sm">
            <p>Real-time analytics from Algorand blockchain | Updated every 24 hours</p>
          </footer>
        </div>
      </div>
    </>
  );
}
