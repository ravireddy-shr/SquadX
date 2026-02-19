import { useState, useMemo } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Squares } from '../components/SquaresBackground';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { FilterSlider } from '../components/FilterSlider';
import { CandidateModal } from '../components/CandidateModal';
import { WalletButton } from '../components/WalletButton';
import { downloadCandidateReport } from '../utils/pdf';

import Link from 'next/link';

interface Candidate {
  id: string;
  name: string;
  email: string;
  degree: string;
  institution: string;
  cgpa: number;
  skills: string[];
  certType: string;
  issueDate: string;
}

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'CAND-001',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    degree: 'B.Tech Computer Science',
    institution: 'IIT Delhi',
    cgpa: 8.5,
    skills: ['Python', 'React', 'SQL', 'Machine Learning'],
    certType: 'degree',
    issueDate: 'Mar 2024',
  },
  {
    id: 'CAND-002',
    name: 'Priya Singh',
    email: 'priya@example.com',
    degree: 'MBA Finance',
    institution: 'IIM Bangalore',
    cgpa: 7.9,
    skills: ['Excel', 'PowerBI', 'Finance', 'Strategic Planning'],
    certType: 'degree',
    issueDate: 'Feb 2024',
  },
  {
    id: 'CAND-003',
    name: 'Amit Patel',
    email: 'amit@example.com',
    degree: 'B.Tech Information Technology',
    institution: 'NIIT',
    cgpa: 7.2,
    skills: ['Java', 'Spring Boot', 'Microservices'],
    certType: 'certification',
    issueDate: 'Jan 2024',
  },
  {
    id: 'CAND-004',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    degree: 'Diploma Web Development',
    institution: 'Coursera',
    cgpa: 8.8,
    skills: ['JavaScript', 'React', 'Node.js', 'CSS'],
    certType: 'coaching',
    issueDate: 'Apr 2024',
  },
];

export default function EmployerDashboard() {
  const [minCGPA, setMinCGPA] = useState(7.0);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [sortBy, setSortBy] = useState<'cgpa' | 'skills'>('cgpa');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const itemsPerPage = 10;

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((c) => {
      const cgpaMatch = c.cgpa >= minCGPA;
      const degreeMatch = !selectedDegree || c.degree.includes(selectedDegree);
      const institutionMatch = !selectedInstitution || c.institution === selectedInstitution;
      const skillsMatch =
        selectedSkills.length === 0 ||
        selectedSkills.some((s) => c.skills.some((cs) => cs.toLowerCase().includes(s.toLowerCase())));

      return cgpaMatch && degreeMatch && institutionMatch && skillsMatch;
    });
  }, [minCGPA, selectedDegree, selectedInstitution, selectedSkills]);

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    const sorted = [...filteredCandidates];
    if (sortBy === 'cgpa') {
      sorted.sort((a, b) => b.cgpa - a.cgpa);
    } else {
      sorted.sort((a, b) => b.skills.length - a.skills.length);
    }
    return sorted;
  }, [filteredCandidates, sortBy]);

  // Paginate
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCandidates.slice(start, start + itemsPerPage);
  }, [sortedCandidates, currentPage]);

  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);

  const handleAddSkill = () => {
    if (skillInput && !selectedSkills.includes(skillInput)) {
      setSelectedSkills([...selectedSkills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const allDegrees = Array.from(new Set(MOCK_CANDIDATES.map((c) => c.degree)));
  const allInstitutions = Array.from(new Set(MOCK_CANDIDATES.map((c) => c.institution)));

  return (
    <>
      <Head>
        <title>Employer Dashboard - SkillChain Pro</title>
        <meta name="description" content="Filter and discover verified talent" />
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
              <span className="text-sm text-gray-400">Employer Dashboard</span>
              <WalletButton />
            </div>
          </header>

          {/* Main Content */}
          <main className="px-6 sm:px-12 py-12 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <GlassCard className="lg:col-span-1 h-fit sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6">Filters</h3>

                <div className="space-y-6">
                  {/* CGPA Slider */}
                  <FilterSlider
                    label="Minimum CGPA"
                    min={0}
                    max={10}
                    step={0.1}
                    value={minCGPA}
                    onChange={setMinCGPA}
                  />

                  {/* Degree Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Degree Type
                    </label>
                    <select
                      value={selectedDegree || ''}
                      onChange={(e) => setSelectedDegree(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition"
                    >
                      <option value="">All Degrees</option>
                      {allDegrees.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree.split(' ')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Institution Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Institution
                    </label>
                    <select
                      value={selectedInstitution || ''}
                      onChange={(e) => setSelectedInstitution(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition"
                    >
                      <option value="">All Institutions</option>
                      {allInstitutions.map((inst) => (
                        <option key={inst} value={inst}>
                          {inst}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skills Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Required Skills
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="e.g. Python"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition text-sm"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm font-medium transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <div
                          key={skill}
                          className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-blue-200"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <GradientButton
                    variant="secondary"
                    onClick={() => {
                      setMinCGPA(7.0);
                      setSelectedDegree(null);
                      setSelectedInstitution(null);
                      setSelectedSkills([]);
                      setCurrentPage(1);
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </GradientButton>
                </div>
              </GlassCard>

              {/* Results Section */}
              <div className="lg:col-span-3">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {sortedCandidates.length} Candidates Found
                  </h2>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'cgpa' | 'skills')}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition text-sm"
                  >
                    <option value="cgpa">Sort by CGPA</option>
                    <option value="skills">Sort by Skills</option>
                  </select>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-4 mb-8">
                  {paginatedCandidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedCandidate(candidate)}
                      className="cursor-pointer"
                    >
                      <GlassCard className="hover:border-blue-500/30 transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-white">{candidate.name}</h4>
                            <p className="text-sm text-gray-400">{candidate.degree}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-teal-400">{candidate.cgpa}</p>
                            <p className="text-xs text-gray-500">CGPA</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">{candidate.institution}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {candidate.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                          <span className="text-xs text-gray-500">Click to view details</span>
                          <span className="text-xs text-gray-500">ID: {candidate.id}</span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </main>

          {/* Candidate Modal */}
          {selectedCandidate && (
            <CandidateModal
              isOpen={!!selectedCandidate}
              onClose={() => setSelectedCandidate(null)}
              candidateName={selectedCandidate.name}
              degree={selectedCandidate.degree}
              institution={selectedCandidate.institution}
              cgpa={selectedCandidate.cgpa.toString()}
              skills={selectedCandidate.skills}
              issueDate={selectedCandidate.issueDate}
              explorerLink={`https://testnet.algoexplorer.io/address/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY`}
              onDownloadReport={() => {
                downloadCandidateReport({
                  name: selectedCandidate.name,
                  email: selectedCandidate.email,
                  degree: selectedCandidate.degree,
                  institution: selectedCandidate.institution,
                  cgpa: selectedCandidate.cgpa.toString(),
                  skills: selectedCandidate.skills,
                  matchScore: 92.5,
                });
              }}
            />
          )}

          {/* Footer */}
          <footer className="border-t border-white/10 px-6 sm:px-12 py-6 text-center text-gray-500 text-sm">
            <p>Advanced on-chain filtering | Verified credentials only</p>
          </footer>
        </div>
      </div>
    </>
  );
}
