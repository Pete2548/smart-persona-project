import { jsPDF } from 'jspdf';

const PAGE_WIDTH = 595.28; // A4 width pt
const PAGE_MARGIN = 48;
const LINE_HEIGHT = 18;

const ensureSpace = (doc, cursor, needed = 0) => {
  if (cursor + needed <= doc.internal.pageSize.height - PAGE_MARGIN) {
    return cursor;
  }
  doc.addPage();
  return PAGE_MARGIN;
};

const addSectionHeading = (doc, text, cursor) => {
  cursor = ensureSpace(doc, cursor, 40);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(text, PAGE_MARGIN, cursor);
  doc.setDrawColor(230);
  doc.line(PAGE_MARGIN, cursor + 6, PAGE_WIDTH - PAGE_MARGIN, cursor + 6);
  return cursor + 24;
};

const addParagraph = (doc, text, cursor) => {
  if (!text) return cursor;
  const lines = doc.splitTextToSize(text, PAGE_WIDTH - PAGE_MARGIN * 2);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  lines.forEach(line => {
    cursor = ensureSpace(doc, cursor, LINE_HEIGHT);
    doc.text(line, PAGE_MARGIN, cursor);
    cursor += LINE_HEIGHT;
  });
  return cursor + 4;
};

const addList = (doc, items = [], cursor) => {
  items.forEach(item => {
    if (!item) return;
    cursor = ensureSpace(doc, cursor, LINE_HEIGHT);
    doc.text(`• ${item}`, PAGE_MARGIN + 12, cursor);
    cursor += LINE_HEIGHT;
  });
  return cursor;
};

export const generateCvPdf = async (profile, options = {}) => {
  if (typeof window === 'undefined') {
    throw new Error('PDF export ใช้ได้ในเบราว์เซอร์เท่านั้น');
  }
  if (!profile) {
    throw new Error('ไม่พบข้อมูลโปรไฟล์');
  }
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let cursor = PAGE_MARGIN;
  const filename = options.filename || `${profile.username || 'profile'}-cv.pdf`;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(profile.displayName || 'Professional Profile', PAGE_MARGIN, cursor);
  doc.setFontSize(14);
  doc.setFont('Helvetica', 'normal');
  cursor += 24;
  doc.text(profile.jobTitle || '', PAGE_MARGIN, cursor);
  cursor += 20;

  const contactLine = [profile.contact?.email, profile.contact?.phone, profile.contact?.address]
    .filter(Boolean)
    .join(' • ');
  if (contactLine) {
    doc.setFontSize(11);
    doc.text(contactLine, PAGE_MARGIN, cursor);
    cursor += 20;
  }

  cursor = addSectionHeading(doc, 'สรุปโดยย่อ', cursor);
  cursor = addParagraph(doc, profile.description || profile.tagline || '', cursor);

  cursor = addSectionHeading(doc, 'ทักษะเด่น', cursor);
  const skillsLine = (profile.skills || []).join(' · ');
  cursor = addParagraph(doc, skillsLine || 'ระบุทักษะเพิ่มเติมเพื่อเพิ่มจุดขาย', cursor);

  const experience = profile.experience || [];
  if (experience.length) {
    cursor = addSectionHeading(doc, 'ประสบการณ์ทำงาน', cursor);
    experience.forEach((item) => {
      cursor = ensureSpace(doc, cursor, 40);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(item.position || 'ตำแหน่ง', PAGE_MARGIN, cursor);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      const meta = [item.company, item.location, `${item.startDate || ''} - ${item.endDate || 'Present'}`]
        .filter(Boolean)
        .join(' • ');
      cursor += 16;
      doc.text(meta, PAGE_MARGIN, cursor);
      cursor += 14;
      cursor = addParagraph(doc, item.description || '', cursor);
      cursor = addList(doc, item.bullets || [], cursor);
      cursor += 6;
    });
  }

  const education = profile.education || [];
  if (education.length) {
    cursor = addSectionHeading(doc, 'การศึกษา', cursor);
    education.forEach(item => {
      cursor = ensureSpace(doc, cursor, 30);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(item.school || 'สถาบัน', PAGE_MARGIN, cursor);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      cursor += 16;
      const meta = [item.degree, item.location, `${item.startDate || ''} - ${item.endDate || ''}`]
        .filter(Boolean)
        .join(' • ');
      doc.text(meta, PAGE_MARGIN, cursor);
      cursor += 10;
    });
  }

  doc.save(filename);
  return filename;
};
