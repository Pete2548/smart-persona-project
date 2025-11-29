import html2pdf from 'html2pdf.js';

const PAGE_WIDTH = 595.28; // A4 width pt
const PAGE_MARGIN = 48;
const LINE_HEIGHT = 18;

// Removed unused ensureSpace

// Removed unused addSectionHeading, addParagraph, addList

export const generateCvPdf = async (profile, options = {}) => {
  if (typeof window === 'undefined') {
    throw new Error('PDF export ใช้ได้ในเบราว์เซอร์เท่านั้น');
  }
  const element = document.querySelector('.preview-stage'); // หรือ .resume-preview
  if (!element) throw new Error('ไม่พบ preview สำหรับ export');
  const opt = {
    margin: 0,
    filename: options.filename || `${profile.username || 'profile'}-cv.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };
  await html2pdf().set(opt).from(element).save();
  return opt.filename;
};
