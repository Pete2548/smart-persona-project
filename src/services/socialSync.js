const SOCIAL_PROVIDERS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'ดึงข้อมูลตำแหน่งงานล่าสุดและลิงก์พอร์ตโฟลิโอ',
    placeholder: 'janedoe',
    color: '#0a66c2'
  },
  {
    id: 'github',
    label: 'GitHub',
    description: 'เน้นผลงานด้านโค้ด โอเพนซอร์ส และสกิลเทคนิค',
    placeholder: 'octocat',
    color: '#24292f'
  },
  {
    id: 'behance',
    label: 'Behance',
    description: 'ผลงานออกแบบและแคมเปญเชิงสร้างสรรค์',
    placeholder: 'creative-studio',
    color: '#0057ff'
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    description: 'เหมาะกับสายคอนเทนต์และผู้สร้างคอมมูนิตี้',
    placeholder: '@brandvoice',
    color: '#000000'
  }
];

const MOCK_SOCIAL_DATA = {
  linkedin: {
    displayName: 'LinkedIn Import ({handle})',
    jobTitle: 'Product Marketing Lead',
    tagline: 'ขับเคลื่อนกลยุทธ์ GTM ด้วยข้อมูลลูกค้า',
    summary: 'สร้าง pipeline การเติบโตและพัฒนาทีม go-to-market สำหรับตลาดเอเชียแปซิฟิก เน้น insight ที่วัดผลได้.',
    experience: [
      {
        company: 'LinkedIn · Microsoft',
        position: 'Product Marketing Lead',
        location: 'Singapore',
        startDate: '2021-06',
        endDate: '',
        description: 'กำหนด narrative ให้กับ product launch ระดับภูมิภาค พร้อมสร้าง playbook ให้ทีมขายกว่า 6 ประเทศ.',
        bullets: [
          'โครงการ ABM เพิ่ม pipeline 38% ภายใน 2 ไตรมาส',
          'ปรับ positioning ร่วมกับทีมผลิตภัณฑ์ ทำให้ adoption rate เพิ่ม 24%'
        ]
      },
      {
        company: 'Grab',
        position: 'Regional Marketing Manager',
        location: 'Bangkok',
        startDate: '2018-04',
        endDate: '2021-05',
        description: 'ดูแลการสื่อสารผลิตภัณฑ์ ride-hailing และ subscription program.',
        bullets: [
          'เปิดตัว GrabUnlimited พร้อม partner ecosystem 30+ ราย',
          'ริเริ่ม content lab ที่ลดเวลาผลิตแคมเปญลง 40%'
        ]
      }
    ],
    education: [
      {
        school: 'Chulalongkorn University',
        degree: 'B.B.A. International Business',
        startDate: '2011',
        endDate: '2014',
        location: 'Bangkok'
      }
    ],
    skills: ['Go-to-market', 'Product Strategy', 'Stakeholder Alignment', 'Data Storytelling'],
    contact: {
      email: 'contact@{handle}.linkedinmail.com',
      phone: '+65 8000 1234',
      address: 'Singapore',
      links: [
        { service: 'linkedin', url: 'https://www.linkedin.com/in/{handle}' },
        { service: 'website', url: 'https://{handle}.studio' }
      ]
    }
  },
  github: {
    displayName: 'GitHub Sync ({handle})',
    jobTitle: 'Senior Full Stack Engineer',
    tagline: 'สร้างระบบ SaaS ที่ scale ได้ภายในทีมเล็ก',
    summary: 'เน้นผลิตภัณฑ์ที่เติบโตเร็ว ดูแลทั้งสถาปัตยกรรม cloud, DX และ developer tooling.',
    experience: [
      {
        company: 'Vere Labs',
        position: 'Senior Software Engineer',
        location: 'Remote',
        startDate: '2020-02',
        endDate: '',
        description: 'ออกแบบ micro-frontends และ build pipeline บน Vite + Turborepo.',
        bullets: [
          'ลดเวลา build ลงเหลือ 4 นาทีด้วย incremental deploy',
          'ย้าย service 6 ตัวไปสู่ event-driven architecture'
        ]
      },
      {
        company: 'SCG Digital',
        position: 'Software Engineer',
        location: 'Bangkok',
        startDate: '2016-08',
        endDate: '2020-01',
        description: 'พัฒนา platform ภายในสำหรับ asset tracking และ predictive maintenance.'
      }
    ],
    education: [
      {
        school: 'King Mongkut’s University of Technology Thonburi',
        degree: 'B.Eng. Computer Engineering',
        startDate: '2011',
        endDate: '2015',
        location: 'Bangkok'
      }
    ],
    skills: ['TypeScript', 'Node.js', 'React', 'Cloud Architecture', 'Testing'],
    contact: {
      email: '{handle}@users.noreply.github.com',
      phone: '',
      address: 'Remote',
      links: [
        { service: 'github', url: 'https://github.com/{handle}' },
        { service: 'website', url: 'https://{handle}.dev' }
      ]
    }
  },
  behance: {
    displayName: 'Behance Studio ({handle})',
    jobTitle: 'Creative Lead · Visual Designer',
    tagline: 'เล่าเรื่องแบรนด์ด้วย motion-first experience',
    summary: 'สร้าง visual system สำหรับแบรนด์เทคและไลฟ์สไตล์ เน้น workflow ร่วมกับผลิตภัณฑ์และการทดลองด้วย prototyping.',
    experience: [
      {
        company: 'Independent Studio',
        position: 'Creative Director',
        location: 'Bangkok / Remote',
        startDate: '2019-01',
        endDate: '',
        description: 'บริหารทีมดีไซน์ 5 คน คุมตั้งแต่ discovery ถึง handoff.'
      },
      {
        company: 'WPP Group',
        position: 'Senior Designer',
        location: 'Bangkok',
        startDate: '2015-06',
        endDate: '2018-12'
      }
    ],
    education: [
      {
        school: 'Parsons · The New School',
        degree: 'MFA Communication Design',
        startDate: '2013',
        endDate: '2015',
        location: 'New York'
      }
    ],
    skills: ['Art Direction', 'Motion Design', 'Brand Narrative', 'Figma', 'After Effects'],
    contact: {
      email: 'studio@{handle}.design',
      phone: '+66 8 1234 5678',
      address: 'Bangkok',
      links: [
        { service: 'behance', url: 'https://www.behance.net/{handle}' },
        { service: 'instagram', url: 'https://instagram.com/{handle}' }
      ]
    }
  },
  twitter: {
    displayName: 'Community Builder ({handle})',
    jobTitle: 'Head of Content & Community',
    tagline: 'ต่อยอดคอมมูนิตี้ให้กลายเป็นรายได้',
    summary: 'สร้างสรรค์ thread และ live session ที่ปั้นฐานผู้ติดตาม 0 → 120K ใน 10 เดือน พร้อมต่อยอดเป็น subscription club.',
    experience: [
      {
        company: 'Creator HQ',
        position: 'Head of Content',
        location: 'Remote',
        startDate: '2022-08',
        endDate: '',
        description: 'พัฒนา content system ที่ recycle ได้ 5 format.'
      },
      {
        company: 'Line Thailand',
        position: 'Content Strategist',
        location: 'Bangkok',
        startDate: '2018-02',
        endDate: '2022-07'
      }
    ],
    education: [
      {
        school: 'Thammasat University',
        degree: 'B.A. Journalism',
        startDate: '2010',
        endDate: '2013',
        location: 'Bangkok'
      }
    ],
    skills: ['Community Design', 'Content Strategy', 'Live Production', 'Partnerships'],
    contact: {
      email: 'hello@{handle}.club',
      phone: '',
      address: 'Remote',
      links: [
        { service: 'twitter', url: 'https://twitter.com/{handle}' },
        { service: 'custom', url: 'https://{handle}.newsletter' }
      ]
    }
  }
};

const normalizeHandle = (providerId, rawHandle) => {
  if (!rawHandle) return '';
  let value = rawHandle.trim();
  value = value.replace(/^https?:\/\//i, '');
  if (providerId === 'linkedin') {
    value = value.replace(/(www\.|\/?profile\/|\/?in\/)/i, '');
    value = value.replace(/linkedin\.com\//i, '');
  }
  if (providerId === 'twitter' && value.startsWith('@')) {
    value = value.substring(1);
  }
  return value.replace(/\s+/g, '-');
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchSocialProfile = async (providerId, rawHandle) => {
  const provider = SOCIAL_PROVIDERS.find(item => item.id === providerId);
  if (!provider) {
    throw new Error('ไม่พบผู้ให้บริการที่เลือก');
  }
  const handle = normalizeHandle(providerId, rawHandle) || 'talent';
  const mock = MOCK_SOCIAL_DATA[providerId];
  if (!mock) {
    throw new Error('ยังไม่รองรับการนำเข้าประเภทนี้');
  }
  await delay(600 + Math.random() * 600);
  const experience = (mock.experience || []).map((item, index) => ({
    id: item.id || `${providerId}-exp-${index}`,
    ...item
  }));
  const education = (mock.education || []).map((item, index) => ({
    id: item.id || `${providerId}-edu-${index}`,
    ...item
  }));
  const contact = {
    ...(mock.contact || {}),
    email: (mock.contact?.email || '').replace('{handle}', handle),
    links: (mock.contact?.links || []).map(link => ({
      ...link,
      url: link.url.replace('{handle}', handle)
    }))
  };
  return {
    ...mock,
    displayName: (mock.displayName || 'Social Profile').replace('{handle}', handle),
    tagline: (mock.tagline || '').replace('{handle}', handle),
    summary: (mock.summary || '').replace('{handle}', handle),
    jobTitle: mock.jobTitle || provider.label,
    contact,
    username: handle,
    provider: providerId,
    fetchedAt: new Date().toISOString(),
    experience,
    education
  };
};

export { SOCIAL_PROVIDERS };
