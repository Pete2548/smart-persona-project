import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Sidebar
      "professional_profile": "Professional Profile",
      "dashboard": "Dashboard",
      "explore_people": "Explore People",
      "saved_profiles": "Saved Profiles",
      "my_links": "My Links",
      "customize": "Customize",
      "themes": "Themes",
      "links": "Links",
      "view_profile": "View Profile",
      "share_your_profile": "Share Your Profile",
      "settings": "Settings",
      "logout": "Logout",
      
      // Header
      "home": "Home",
      "explore": "Explore",
      "pricing": "Pricing",
      "login": "Login",
      "get_started": "Get Started",
      "create_account": "Create Account",
      "signed_in_as": "Signed in as",
      
      // Dashboard
      "welcome_back": "Welcome back",
      "total_views": "Total Views",
      "unique_visitors": "Unique Visitors",
      "views_today": "Views Today",
      "last_7_days": "Last 7 Days",
      "last_30_days": "Last 30 Days",
      "profile_analytics": "Profile Analytics",
      "quick_actions": "Quick Actions",
      "create_new_profile": "Create New Profile",
      "recent_activity": "Recent Activity",
      
      // My Profile
      "edit_profile": "Edit Profile",
      "view_public_profile": "View Public Profile",
      "share": "Share",
      "about": "About",
      "experience": "Experience",
      "education": "Education",
      "skills": "Skills",
      "add_experience": "Add Experience",
      "add_education": "Add Education",
      "add_skills": "Add Skills",
      "no_experience": "No experience added yet",
      "no_education": "No education added yet",
      "no_skills": "No skills added yet",
      "add_your_first_experience": "Add Your First Experience",
      "add_your_first_education": "Add Your First Education",
      "add_your_first_skill": "Add Your First Skill",
      "present": "Present",
      "show_more": "Show more",
      "show_less": "Show less",
      
      // Explore
      "discover_talented": "Discover talented professionals from our community",
      "search_placeholder": "Search by name, job title, skills, location...",
      "filter_by_skill": "Skills",
      "filter_by_location": "Location",
      "experience_level": "Experience Level",
      "sort_by": "Sort By",
      "all_skills": "All Skills",
      "all_locations": "All Locations",
      "junior": "Junior (0-2 years)",
      "mid": "Mid (3-7 years)",
      "senior": "Senior (8+ years)",
      "recent": "Most Recent",
      "name_az": "Name (A-Z)",
      "most_experienced": "Most Experienced",
      "clear_filters": "Clear Filters",
      "showing_results": "Showing",
      "of": "of",
      "profiles": "profiles",
      "years_exp": "years exp",
      "no_profiles_found": "No profiles found",
      "try_different_filters": "Try adjusting your filters",
      
      // Saved Profiles
      "saved_profiles_title": "Saved Profiles",
      "no_saved_profiles": "No saved profiles yet",
      "start_saving": "Start exploring and save profiles you like",
      "explore_people_btn": "Explore People",
      "remove": "Remove",
      "unsave": "Unsave",
      
      // Edit Professional Profile
      "edit_professional_profile": "Edit Professional Profile",
      "manage_linkedin_profile": "Manage your LinkedIn-style professional profile",
      "basic_information": "Basic Information",
      "display_name": "Display Name",
      "job_title": "Job Title",
      "location": "Location",
      "cover_color": "Cover Color",
      "avatar_url": "Avatar URL",
      "make_public": "Make profile public (visible in Explore People)",
      "save_basic_info": "Save Basic Info",
      "profile_updated": "Profile updated successfully!",
      
      // Experience
      "add_new_experience": "Add Experience",
      "edit_experience": "Edit Experience",
      "position": "Position",
      "company": "Company",
      "start_date": "Start Date",
      "end_date": "End Date",
      "description": "Description",
      "key_achievements": "Key Achievements (one per line)",
      "delete_experience": "Are you sure you want to delete this experience?",
      
      // Education
      "add_new_education": "Add Education",
      "edit_education": "Edit Education",
      "degree": "Degree",
      "school": "School",
      "coursework": "Relevant Coursework (optional)",
      "delete_education": "Are you sure you want to delete this education?",
      
      // Skills
      "add_skill": "Add a skill",
      "skill_placeholder": "Add a skill (e.g. React, JavaScript)",
      
      // Themes
      "choose_theme": "Choose Your Theme",
      "personal": "Personal",
      "vtree": "Vtree",
      "resume": "Resume",
      "apply": "Apply",
      "preview": "Preview",
      
      // My Profiles
      "my_profiles": "My Profiles",
      "create_new": "Create New",
      "personal_profile": "Personal Profile",
      "vtree_profile": "Vtree Profile",
      "resume_profile": "Resume Profile",
      "active": "Active",
      "set_active": "Set Active",
      "edit": "Edit",
      "delete": "Delete",
      "confirm_delete": "Are you sure you want to delete this profile?",
      
      // Common
      "save": "Save",
      "cancel": "Cancel",
      "add": "Add",
      "delete": "Delete",
      "close": "Close",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "confirm": "Confirm",
      "back": "Back",
      "next": "Next",
      "finish": "Finish",
      "upload": "Upload",
      "browse": "Browse",
      "optional": "Optional",
      "required": "Required"
    }
  },
  th: {
    translation: {
      // Sidebar
      "professional_profile": "โปรไฟล์มืออาชีพ",
      "dashboard": "แดชบอร์ด",
      "explore_people": "ค้นหาคน",
      "saved_profiles": "โปรไฟล์ที่บันทึก",
      "my_links": "ลิงก์ของฉัน",
      "customize": "ปรับแต่ง",
      "themes": "ธีม",
      "links": "ลิงก์",
      "view_profile": "ดูโปรไฟล์",
      "share_your_profile": "แชร์โปรไฟล์ของคุณ",
      "settings": "ตั้งค่า",
      "logout": "ออกจากระบบ",
      
      // Header
      "home": "หน้าแรก",
      "explore": "สำรวจ",
      "pricing": "ราคา",
      "login": "เข้าสู่ระบบ",
      "get_started": "เริ่มต้นใช้งาน",
      "create_account": "สร้างบัญชี",
      "signed_in_as": "ลงชื่อเข้าใช้เป็น",
      
      // Dashboard
      "welcome_back": "ยินดีต้อนรับกลับมา",
      "total_views": "ยอดดูทั้งหมด",
      "unique_visitors": "ผู้เยี่ยมชมไม่ซ้ำ",
      "views_today": "ยอดดูวันนี้",
      "last_7_days": "7 วันที่แล้ว",
      "last_30_days": "30 วันที่แล้ว",
      "profile_analytics": "สถิติโปรไฟล์",
      "quick_actions": "การกระทำด่วน",
      "create_new_profile": "สร้างโปรไฟล์ใหม่",
      "recent_activity": "กิจกรรมล่าสุด",
      
      // My Profile
      "edit_profile": "แก้ไขโปรไฟล์",
      "view_public_profile": "ดูโปรไฟล์สาธารณะ",
      "share": "แชร์",
      "about": "เกี่ยวกับ",
      "experience": "ประสบการณ์",
      "education": "การศึกษา",
      "skills": "ทักษะ",
      "add_experience": "เพิ่มประสบการณ์",
      "add_education": "เพิ่มการศึกษา",
      "add_skills": "เพิ่มทักษะ",
      "no_experience": "ยังไม่มีประสบการณ์",
      "no_education": "ยังไม่มีข้อมูลการศึกษา",
      "no_skills": "ยังไม่มีทักษะ",
      "add_your_first_experience": "เพิ่มประสบการณ์แรก",
      "add_your_first_education": "เพิ่มการศึกษาแรก",
      "add_your_first_skill": "เพิ่มทักษะแรก",
      "present": "ปัจจุบัน",
      "show_more": "แสดงเพิ่มเติม",
      "show_less": "แสดงน้อยลง",
      
      // Explore
      "discover_talented": "ค้นพบผู้เชี่ยวชาญจากชุมชนของเรา",
      "search_placeholder": "ค้นหาจากชื่อ, ตำแหน่งงาน, ทักษะ, สถานที่...",
      "filter_by_skill": "ทักษะ",
      "filter_by_location": "สถานที่",
      "experience_level": "ระดับประสบการณ์",
      "sort_by": "เรียงตาม",
      "all_skills": "ทักษะทั้งหมด",
      "all_locations": "สถานที่ทั้งหมด",
      "junior": "จูเนียร์ (0-2 ปี)",
      "mid": "มิดเดิล (3-7 ปี)",
      "senior": "ซีเนียร์ (8+ ปี)",
      "recent": "ล่าสุด",
      "name_az": "ชื่อ (ก-ฮ)",
      "most_experienced": "ประสบการณ์มากสุด",
      "clear_filters": "ล้างตัวกรอง",
      "showing_results": "แสดง",
      "of": "จาก",
      "profiles": "โปรไฟล์",
      "years_exp": "ปีประสบการณ์",
      "no_profiles_found": "ไม่พบโปรไฟล์",
      "try_different_filters": "ลองปรับตัวกรองใหม่",
      
      // Saved Profiles
      "saved_profiles_title": "โปรไฟล์ที่บันทึก",
      "no_saved_profiles": "ยังไม่มีโปรไฟล์ที่บันทึก",
      "start_saving": "เริ่มสำรวจและบันทึกโปรไฟล์ที่คุณชอบ",
      "explore_people_btn": "ค้นหาคน",
      "remove": "ลบ",
      "unsave": "ยกเลิกการบันทึก",
      
      // Edit Professional Profile
      "edit_professional_profile": "แก้ไขโปรไฟล์มืออาชีพ",
      "manage_linkedin_profile": "จัดการโปรไฟล์มืออาชีพแบบ LinkedIn",
      "basic_information": "ข้อมูลพื้นฐาน",
      "display_name": "ชื่อที่แสดง",
      "job_title": "ตำแหน่งงาน",
      "location": "สถานที่",
      "cover_color": "สีปก",
      "avatar_url": "URL รูปโปรไฟล์",
      "make_public": "เปิดเผยโปรไฟล์ (แสดงในหน้าค้นหาคน)",
      "save_basic_info": "บันทึกข้อมูลพื้นฐาน",
      "profile_updated": "อัปเดตโปรไฟล์เรียบร้อยแล้ว!",
      
      // Experience
      "add_new_experience": "เพิ่มประสบการณ์",
      "edit_experience": "แก้ไขประสบการณ์",
      "position": "ตำแหน่ง",
      "company": "บริษัท",
      "start_date": "วันที่เริ่มต้น",
      "end_date": "วันที่สิ้นสุด",
      "description": "คำอธิบาย",
      "key_achievements": "ผลงานสำคัญ (หนึ่งบรรทัดต่อข้อ)",
      "delete_experience": "คุณแน่ใจหรือไม่ว่าต้องการลบประสบการณ์นี้?",
      
      // Education
      "add_new_education": "เพิ่มการศึกษา",
      "edit_education": "แก้ไขการศึกษา",
      "degree": "วุฒิการศึกษา",
      "school": "สถาบัน",
      "coursework": "วิชาที่เกี่ยวข้อง (ไม่บังคับ)",
      "delete_education": "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลการศึกษานี้?",
      
      // Skills
      "add_skill": "เพิ่มทักษะ",
      "skill_placeholder": "เพิ่มทักษะ (เช่น React, JavaScript)",
      
      // Themes
      "choose_theme": "เลือกธีมของคุณ",
      "personal": "Personal",
      "vtree": "Vtree",
      "resume": "Resume",
      "apply": "นำไปใช้",
      "preview": "ดูตัวอย่าง",
      
      // My Profiles
      "my_profiles": "โปรไฟล์ของฉัน",
      "create_new": "สร้างใหม่",
      "personal_profile": "โปรไฟล์ส่วนตัว",
      "vtree_profile": "โปรไฟล์ Vtree",
      "resume_profile": "โปรไฟล์ Resume",
      "active": "ใช้งาน",
      "set_active": "ตั้งเป็นหลัก",
      "edit": "แก้ไข",
      "delete": "ลบ",
      "confirm_delete": "คุณแน่ใจหรือไม่ว่าต้องการลบโปรไฟล์นี้?",
      
      // Common
      "save": "บันทึก",
      "cancel": "ยกเลิก",
      "add": "เพิ่ม",
      "delete": "ลบ",
      "close": "ปิด",
      "loading": "กำลังโหลด...",
      "error": "ข้อผิดพลาด",
      "success": "สำเร็จ",
      "confirm": "ยืนยัน",
      "back": "ย้อนกลับ",
      "next": "ถัดไป",
      "finish": "เสร็จสิ้น",
      "upload": "อัปโหลด",
      "browse": "เรียกดู",
      "optional": "ไม่บังคับ",
      "required": "จำเป็น"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
