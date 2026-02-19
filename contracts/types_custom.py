"""
Shared types and constants for SkillChain Pro
"""
from enum import Enum
from typing import Literal

# Certificate Types
class CertificationType(str, Enum):
    DEGREE = 'degree'
    CERTIFICATION = 'certification'
    COACHING = 'coaching'

# Certificate Status
class CertificateStatus(str, Enum):
    ACTIVE = 'active'
    REVOKED = 'revoked'
    PENDING = 'pending'

# Degree Types
DEGREE_TYPES = [
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
]

# Skill Categories
SKILL_CATEGORIES = {
    'programming': ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'Go', 'Rust'],
    'web': ['React', 'Next.js', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Node.js'],
    'data': ['SQL', 'MongoDB', 'PostgreSQL', 'Data Science', 'Machine Learning', 'Statistics'],
    'blockchain': ['Solidity', 'Web3', 'Smart Contracts', 'Algorand', 'Ethereum'],
    'cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'],
    'finance': ['Excel', 'Finance', 'PowerBI', 'Accounting', 'Strategic Planning'],
}

# CGPA Range
MIN_CGPA = 0.0
MAX_CGPA = 10.0

# Limits
MAX_SKILLSET_LENGTH = 500  # characters
MAX_INSTITUTIONS = 100
CERTIFICATES_PER_PAGE = 10
CANDIDATES_PER_PAGE = 10
MAX_BULK_UPLOAD = 1000  # maximum certificates per upload
