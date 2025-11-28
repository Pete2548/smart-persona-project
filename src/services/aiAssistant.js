const AI_TONES = [
  { id: 'professional', label: 'โทนมืออาชีพ' },
  { id: 'friendly', label: 'โทนเป็นกันเอง' },
  { id: 'bold', label: 'โทนมั่นใจ' }
];

const AI_FOCUS_OPTIONS = [
  { id: 'job_search', label: 'สมัครงานใหม่', helper: 'เน้นผลลัพธ์และความน่าเชื่อถือ' },
  { id: 'freelance', label: 'หาลูกค้า/ฟรีแลนซ์', helper: 'โชว์สกิลที่นำไปใช้งานได้ทันที' },
  { id: 'networking', label: 'สร้างคอนเนคชั่น', helper: 'เน้นบุคลิกและเรื่องราวที่ชวนคุย' }
];

const FOCUS_SKILLS = {
  job_search: ['Leadership', 'Strategic Planning', 'Data Literacy'],
  freelance: ['Client Discovery', 'Agile Delivery', 'Rapid Prototyping'],
  networking: ['Storytelling', 'Community Building', 'Empathy']
};

const toneDescription = {
  professional: 'เน้นโครงสร้างชัดเจนและชี้วัดผลลัพธ์',
  friendly: 'เล่าเรื่องแบบเข้าถึงง่าย มีรายละเอียดชีวิตการทำงาน',
  bold: 'โทนมั่นใจ ใช้ถ้อยคำที่ชัดและกล้าประกาศเป้าหมาย'
};

const buildSummary = ({ role, tone, focus, location }) => {
  const toneText = toneDescription[tone] || toneDescription.professional;
  const focusMessages = {
    job_search: 'พร้อมโยกย้ายทีมทันทีด้วย playbook ที่พิสูจน์แล้ว',
    freelance: 'เชี่ยวชาญการร่วมงานแบบ squad ขนาดเล็ก ส่งมอบงานได้ตั้งแต่สปรินต์แรก',
    networking: 'กำลังมองหาพาร์ทเนอร์และโอกาสร่วมสร้างคอมมูนิตี้'
  };
  return `${role} ที่ ${toneText} และ${focusMessages[focus] || ''}${location ? ` (ฐานอยู่ที่ ${location})` : ''}`.trim();
};

const buildExperienceBlocks = (role, focus) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const prevYear = currentYear - 2;
  const focusHighlights = {
    job_search: ['ลด cycle time ด้วย automation', 'สเกลทีมได้เต็มประสิทธิภาพ'],
    freelance: ['ออกแบบแพ็กเกจค่าบริการแบบ modular', 'ปิดงานรีเทนเนอร์ระยะยาว 5+ ราย'],
    networking: ['โฮสต์ community session รายเดือน', 'สร้าง loop feedback กับเพื่อนร่วมวิชาชีพ']
  };
  return [
    {
      id: `ai-exp-${Date.now()}`,
      company: 'Vere Studio',
      position: role,
      location: 'Remote / Hybrid',
      startDate: `${prevYear}-01`,
      endDate: '',
      description: `รับผิดชอบการนำเสนอคุณค่าหลักของทีม พร้อมโฟกัสที่ ${focusHighlights[focus]?.[0] || 'การเติบโตของลูกค้า'}.`,
      bullets: [
        focusHighlights[focus]?.[0] || 'ตั้งระบบวัดผลที่ทำให้ทีมตัดสินใจได้เร็วขึ้น',
        focusHighlights[focus]?.[1] || 'สร้าง workshop template ที่ทีมอื่นนำไปใช้ต่อได้'
      ]
    },
    {
      id: `ai-exp-${Date.now()}-prev`,
      company: 'Regional Squad',
      position: `Lead ${role}`,
      location: 'Bangkok / Singapore',
      startDate: `${prevYear - 3}-06`,
      endDate: `${prevYear - 1}-12`,
      description: 'โครงการปรับระบบการทำงานข้ามทีมและ mentorship สำหรับสมาชิกใหม่.'
    }
  ];
};

const buildFeatured = (role) => ([
  {
    id: `ai-feature-${Date.now()}`,
    title: `${role} Playbook` ,
    type: 'Project',
    description: 'สรุปวิธีทำงานตั้งแต่ discovery, prioritization, ไปจนถึง delivery.',
    url: 'https://verelabs.super.site/playbook'
  }
]);

const buildRecentActivity = (role) => ([
  {
    id: `ai-activity-${Date.now()}`,
    type: 'Article',
    title: `Lessons learned as a ${role}`,
    description: 'บันทึกแนวทางแก้ปัญหาระบบซับซ้อน',
    timestamp: new Date().toLocaleDateString()
  }
]);

export const generateAIProfileDraft = async ({ role, tone = 'professional', focus = 'job_search', existingSkills = [], location = '', username = '' }) => {
  if (!role) {
    throw new Error('กรุณาระบุชื่อตำแหน่งที่ต้องการให้ AI ช่วยร่าง');
  }
  await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));
  const handle = username || role.replace(/\s+/g, '').toLowerCase();
  const extraSkills = FOCUS_SKILLS[focus] || [];
  const draftSkills = Array.from(new Set([role.split(' ')[0], ...existingSkills, ...extraSkills])).filter(Boolean);
  return {
    displayName: handle ? handle.replace(/-/g, ' ') : role,
    jobTitle: role,
    tagline: buildSummary({ role, tone, focus, location }),
    summary: buildSummary({ role, tone, focus, location }),
    skills: draftSkills,
    experience: buildExperienceBlocks(role, focus),
    featuredItems: buildFeatured(role),
    recentActivity: buildRecentActivity(role)
  };
};

export { AI_TONES, AI_FOCUS_OPTIONS };