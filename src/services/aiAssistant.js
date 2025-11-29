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

const normalizeDraft = (draft = {}, fallbackRole) => ({
  displayName: draft.displayName || fallbackRole,
  jobTitle: draft.jobTitle || fallbackRole,
  tagline: draft.tagline || draft.summary || '',
  summary: draft.summary || draft.tagline || '',
  skills: Array.isArray(draft.skills) ? draft.skills : [],
  experience: Array.isArray(draft.experience) ? draft.experience : [],
  featuredItems: Array.isArray(draft.featuredItems) ? draft.featuredItems : [],
  recentActivity: Array.isArray(draft.recentActivity) ? draft.recentActivity : []
});

const buildMockDraft = ({ role, tone, focus, location, existingSkills = [], username = '' }) => {
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
    recentActivity: buildRecentActivity(role),
    source: 'mock'
  };
};

const callCustomEndpoint = async (payload) => {
  const endpoint = import.meta?.env?.VITE_PROFILE_AI_ENDPOINT;
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`AI endpoint error: ${response.status}`);
  }

  const result = await response.json();
  return {
    ...normalizeDraft(result, payload.role),
    source: 'external'
  };
};

const callOpenAI = async (payload) => {
  const apiKey = import.meta?.env?.VITE_OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = import.meta?.env?.VITE_OPENAI_MODEL || 'gpt-4o-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that writes professional profile summaries. Respond using JSON with keys displayName, jobTitle, tagline, summary, skills (string array), experience (array of {company, position, description, startDate, endDate}), featuredItems (array with title/type/description/url) and recentActivity (array with type/title/description/timestamp). Keep responses concise.'
        },
        {
          role: 'user',
          content: `Role: ${payload.role}\nTone: ${payload.tone}\nFocus: ${payload.focus}\nLocation: ${payload.location || 'N/A'}\nExisting skills: ${(payload.existingSkills || []).join(', ')}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse OpenAI response', err);
    return null;
  }
  return {
    ...normalizeDraft(parsed, payload.role),
    source: 'openai'
  };
};

export const generateAIProfileDraft = async ({ role, tone = 'professional', focus = 'job_search', existingSkills = [], location = '', username = '' }) => {
  if (!role) {
    throw new Error('กรุณาระบุชื่อตำแหน่งที่ต้องการให้ AI ช่วยร่าง');
  }

  const payload = { role, tone, focus, existingSkills, location, username };

  try {
    const hosted = await callCustomEndpoint(payload);
    if (hosted) return hosted;
  } catch (err) {
    console.warn('Custom AI endpoint failed', err);
  }

  try {
    const openaiDraft = await callOpenAI(payload);
    if (openaiDraft) return openaiDraft;
  } catch (err) {
    console.warn('OpenAI generation failed, fallback to mock', err);
  }

  await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));
  return buildMockDraft(payload);
};

export { AI_TONES, AI_FOCUS_OPTIONS };