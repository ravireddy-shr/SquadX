// Shared constants for frontend application

export const ALGORAND_CONFIG = {
  TESTNET_API: 'https://testnet-api.algonode.cloud',
  EXPLORER: 'https://testnet.algoexplorer.io',
  NETWORK: 'testnet',
} as const;

export const CERTIFICATE_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  PENDING: 'pending',
} as const;

export const CERTIFICATION_TYPES = {
  DEGREE: 'degree',
  CERTIFICATION: 'certification',
  COACHING: 'coaching',
} as const;

export const DEGREE_TYPES = [
  'B.Tech',
  'B.E',
  'M.Tech',
  'MBA',
  'M.A',
  'M.S',
  'B.Sc',
  'M.Sc',
  'B.Com',
  'B.A',
  'Diploma',
  'Certification',
] as const;

export const COMMON_SKILLS = [
  'Python',
  'React',
  'JavaScript',
  'TypeScript',
  'Java',
  'SQL',
  'Node.js',
  'Next.js',
  'Firebase',
  'MongoDB',
  'Docker',
  'AWS',
  'Vue.js',
  'Machine Learning',
  'Data Science',
  'Excel',
  'PowerBI',
  'Finance',
  'Strategic Planning',
  'Web Development',
] as const;

export const PAGINATION = {
  CANDIDATES_PER_PAGE: 10,
  CERTIFICATES_PER_PAGE: 10,
  MAX_RESULTS: 1000,
} as const;

export const VALIDATION = {
  MIN_AADHAR_DIGITS: 12,
  MAX_AADHAR_DIGITS: 12,
  MIN_CGPA: 0,
  MAX_CGPA: 10,
  AADHAR_PATTERN: /^\d{12}$/,
} as const;

export const UI_DELAYS = {
  SHORT: 300,
  MEDIUM: 500,
  LONG: 1000,
} as const;
