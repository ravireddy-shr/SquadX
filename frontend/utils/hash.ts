import { z } from 'zod';

/**
 * Hash Aadhar using SHA-256 client-side only
 * Never transmits raw Aadhar
 */
export async function hashAadhar(aadhar: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(aadhar.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validation Schemas using Zod
 */

export const AadharSchema = z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits');

export const CertificateSchema = z.object({
  student_address: z.string().min(1, 'Student address required'),
  aadhar_hash: z.string().length(64, 'Invalid hash length'),
  degree_type: z.string().min(1, 'Degree type required'),
  cgpa: z.string().min(1, 'CGPA required'),
  skillset: z.string().min(1, 'Skillset required'),
  certification_type: z.string().min(1, 'Certification type required'),
  institution_name: z.string().min(1, 'Institution name required'),
});

export const BulkCertificateSchema = z.array(CertificateSchema);

export type Certificate = z.infer<typeof CertificateSchema>;
export type BulkCertificate = z.infer<typeof BulkCertificateSchema>;
