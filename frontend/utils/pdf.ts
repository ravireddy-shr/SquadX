import jsPDF from 'jspdf';

export interface CertificatePDFData {
  certificateId: string;
  studentName: string;
  degree: string;
  cgpa: string;
  institution: string;
  issueDate: string;
  skills: string[];
  explorerLink: string;
}

/**
 * Generate PDF certificate
 */
export function generateCertificatePDF(data: CertificatePDFData): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background
  pdf.setFillColor(11, 2, 22);
  pdf.rect(0, 0, 210, 297, 'F');

  // Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(37, 99, 235);
  pdf.text('SkillChain Pro', 105, 30, { align: 'center' });

  // Certificate Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Certificate of Achievement', 105, 50, { align: 'center' });

  // Border
  pdf.setDrawColor(13, 148, 136);
  pdf.rect(15, 60, 180, 170);

  // Content
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);

  let yPos = 75;
  const lineHeight = 10;

  pdf.text(`Student Name: ${data.studentName}`, 25, yPos);
  yPos += lineHeight;
  pdf.text(`Degree: ${data.degree}`, 25, yPos);
  yPos += lineHeight;
  pdf.text(`Institution: ${data.institution}`, 25, yPos);
  yPos += lineHeight;
  pdf.text(`CGPA/Percentage: ${data.cgpa}`, 25, yPos);
  yPos += lineHeight;
  pdf.text(`Issue Date: ${data.issueDate}`, 25, yPos);
  yPos += lineHeight + 5;

  // Skills
  pdf.setFont('helvetica', 'bold');
  pdf.text('Skills:', 25, yPos);
  yPos += lineHeight;
  pdf.setFont('helvetica', 'normal');
  const skillsText = data.skills.join(', ');
  const maxWidth = 160;

  const wrappedSkills = pdf.splitTextToSize(skillsText, maxWidth);
  wrappedSkills.forEach((line: string) => {
    pdf.text(line, 25, yPos);
    yPos += lineHeight;
  });

  yPos += 10;

  // Certificate ID (smaller text)
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Certificate ID: ${data.certificateId}`, 25, yPos);
  yPos += lineHeight;

  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Verified on Algorand Testnet`, 25, yPos);
  yPos += lineHeight;
  pdf.text(`Explorer: ${data.explorerLink}`, 25, yPos);

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This certificate is issued on the Algorand blockchain', 105, 280, { align: 'center' });

  // Save
  pdf.save(`Certificate_${data.certificateId}.pdf`);
}

/**
 * Download candidate report as PDF
 */
export function downloadCandidateReport(
  candidateData: {
    name: string;
    email: string;
    degree: string;
    institution: string;
    cgpa: string;
    skills: string[];
    matchScore: number;
  },
  fileName: string = 'candidate-report.pdf'
): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background
  pdf.setFillColor(11, 2, 22);
  pdf.rect(0, 0, 210, 297, 'F');

  // Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(37, 99, 235);
  pdf.text('Candidate Report', 105, 20, { align: 'center' });

  // Content
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(255, 255, 255);

  let yPos = 35;
  const lineHeight = 8;

  pdf.text(`Name: ${candidateData.name}`, 20, yPos);
  yPos += lineHeight;
  pdf.text(`Email: ${candidateData.email}`, 20, yPos);
  yPos += lineHeight;
  pdf.text(`Education: ${candidateData.degree} - ${candidateData.institution}`, 20, yPos);
  yPos += lineHeight;
  pdf.text(`CGPA: ${candidateData.cgpa}`, 20, yPos);
  yPos += lineHeight;
  pdf.text(`Skills Match Score: ${candidateData.matchScore.toFixed(1)}%`, 20, yPos);
  yPos += lineHeight + 5;

  // Skills
  pdf.setFont('helvetica', 'bold');
  pdf.text('Technical Skills:', 20, yPos);
  yPos += lineHeight;

  pdf.setFont('helvetica', 'normal');
  candidateData.skills.forEach((skill) => {
    pdf.text(`• ${skill}`, 25, yPos);
    yPos += lineHeight;
  });

  // Footer
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()} via SkillChain Pro`,
    105,
    290,
    { align: 'center' }
  );

  pdf.save(fileName);
}
