export const VIEW_MODES = [
  {
    id: 'standard',
    label: 'Professional',
    description: 'CV-style layout best for recruiters',
    icon: 'bi-briefcase-fill',
    badge: 'ATS Ready'
  },
  {
    id: 'showcase',
    label: 'Showcase',
    description: 'Hero cover with highlight cards',
    icon: 'bi-stars',
    badge: 'Spotlight'
  },
  {
    id: 'minimal',
    label: 'Link Hub',
    description: 'Compact link-in-bio inspired view',
    icon: 'bi-link-45deg',
    badge: 'Multi-link'
  }
];

export const VIEW_MODE_LABELS = VIEW_MODES.reduce((acc, mode) => {
  acc[mode.id] = mode.label;
  return acc;
}, {});

export const PROFILE_PRESETS = [
  {
    id: 'job_application',
    title: 'Job Application',
    description: 'เน้นผลงาน วัดผล และความพร้อมเข้าร่วมทีม',
    icon: 'bi-briefcase-fill',
    color: '#1d4ed8',
    badge: 'ATS Ready',
    viewMode: 'standard',
    defaultTagline: 'พร้อมร่วมทีมและขับเคลื่อนผลลัพธ์ทันที',
    defaultDescription: 'ผสมผสานประสบการณ์ข้ามสายงาน เน้นการวิเคราะห์และลงมือทำจริงเพื่อให้ทีมโตอย่างยั่งยืน'
  },
  {
    id: 'creator_showcase',
    title: 'Creator Showcase',
    description: 'โชว์ผลงานครีเอทีฟหรือพอร์ตโฟลิโอแบบ hero card',
    icon: 'bi-stars',
    color: '#f97316',
    badge: 'Spotlight',
    viewMode: 'showcase',
    defaultTagline: 'สร้างแบรนด์และแคมเปญที่แฟนรัก',
    defaultDescription: 'โฟกัสการเล่าเรื่องผ่านภาพ วิดีโอ และงานครีเอทีฟที่สื่อสารตัวตนและแบรนด์ได้ชัดเจน'
  },
  {
    id: 'link_hub',
    title: 'Link Hub',
    description: 'เหมาะกับ creators ที่ต้องรวมหลายลิงก์ในหน้าเดียว',
    icon: 'bi-link-45deg',
    color: '#0f172a',
    badge: 'Multi-link',
    viewMode: 'minimal',
    defaultTagline: 'รวมลิงก์ที่ต้องการแชร์ไว้ในที่เดียว',
    defaultDescription: 'ให้แฟนหรือเพื่อนร่วมงานเลือกปลายทางเองได้ ไม่ว่าจะเป็นร้านค้า คอร์ส หรือ community'
  }
];

export const VIEW_MODE_LAYOUT_MAP = {
  standard: 'linkedin',
  showcase: 'showcase',
  minimal: 'linkhub'
};

export const getPresetById = (id) => PROFILE_PRESETS.find((preset) => preset.id === id) || null;
