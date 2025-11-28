// Professional Profile Manager - Separate from Personal/Vtree/Resume profiles
// This manages LinkedIn-style professional profiles

const STORAGE_KEY = 'professional_profiles';
const ACTIVE_PROFILE_KEY = 'active_professional_profile';

// Initialize professional profiles in localStorage
export const initProfessionalProfiles = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all professional profiles
export const getAllProfessionalProfiles = () => {
  initProfessionalProfiles();
  const profiles = localStorage.getItem(STORAGE_KEY);
  return profiles ? JSON.parse(profiles) : [];
};

// Get professional profile by ID
export const getProfessionalProfileById = (id) => {
  const profiles = getAllProfessionalProfiles();
  return profiles.find(p => p.id === id);
};

// Get professional profile by username
export const getProfessionalProfileByUsername = (username) => {
  const profiles = getAllProfessionalProfiles();
  return profiles.find(p => p.username === username);
};

// Get current user's professional profile
export const getCurrentUserProfessionalProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!currentUser.username) return null;
  
  return getProfessionalProfileByUsername(currentUser.username);
};

// Create a new professional profile
export const createProfessionalProfile = (username) => {
  const profiles = getAllProfessionalProfiles();
  
  // Check if user already has a professional profile
  const existing = profiles.find(p => p.username === username);
  if (existing) return existing;

  const newProfile = {
    id: Date.now().toString(),
    username: username,
    createdAt: new Date().toISOString(),
    data: {
      displayName: username,
      jobTitle: '',
      location: '',
      avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
      coverImage: '',
      coverColor: '#0a66c2', // LinkedIn blue
      about: '',
      experienceYears: 0,
      skills: [],
      experience: [],
      education: [],
      isPublic: true
    }
  };

  profiles.push(newProfile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return newProfile;
};

// Update professional profile
export const updateProfessionalProfile = (id, updates) => {
  const profiles = getAllProfessionalProfiles();
  const index = profiles.findIndex(p => p.id === id);
  
  if (index === -1) return null;

  profiles[index] = {
    ...profiles[index],
    data: {
      ...profiles[index].data,
      ...updates
    },
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return profiles[index];
};

// Delete professional profile
export const deleteProfessionalProfile = (id) => {
  const profiles = getAllProfessionalProfiles();
  const filtered = profiles.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Get all public professional profiles
export const getPublicProfessionalProfiles = () => {
  const profiles = getAllProfessionalProfiles();
  return profiles.filter(p => p.data.isPublic === true);
};

// Search professional profiles
export const searchProfessionalProfiles = (query = '', filters = {}) => {
  let profiles = getPublicProfessionalProfiles();

  // Text search
  if (query.trim()) {
    const searchLower = query.toLowerCase();
    profiles = profiles.filter(p => {
      const data = p.data;
      return (
        data.displayName?.toLowerCase().includes(searchLower) ||
        data.jobTitle?.toLowerCase().includes(searchLower) ||
        data.location?.toLowerCase().includes(searchLower) ||
        data.skills?.some(skill => skill.toLowerCase().includes(searchLower))
      );
    });
  }

  // Filter by skill
  if (filters.skill) {
    profiles = profiles.filter(p => 
      p.data.skills?.some(s => s.toLowerCase() === filters.skill.toLowerCase())
    );
  }

  // Filter by location
  if (filters.location) {
    profiles = profiles.filter(p => 
      p.data.location?.toLowerCase() === filters.location.toLowerCase()
    );
  }

  // Filter by experience level
  if (filters.experienceLevel) {
    profiles = profiles.filter(p => {
      const years = p.data.experienceYears || 0;
      switch(filters.experienceLevel) {
        case 'junior':
          return years < 3;
        case 'mid':
          return years >= 3 && years <= 7;
        case 'senior':
          return years > 7;
        default:
          return true;
      }
    });
  }

  return profiles;
};

// Get all unique skills from all profiles
export const getAllSkills = () => {
  const profiles = getAllProfessionalProfiles();
  const skillsSet = new Set();
  
  profiles.forEach(profile => {
    if (profile.data.skills) {
      profile.data.skills.forEach(skill => skillsSet.add(skill));
    }
  });
  
  return Array.from(skillsSet).sort();
};

// Get all unique locations from all profiles
export const getAllLocations = () => {
  const profiles = getAllProfessionalProfiles();
  const locationsSet = new Set();
  
  profiles.forEach(profile => {
    if (profile.data.location) {
      locationsSet.add(profile.data.location);
    }
  });
  
  return Array.from(locationsSet).sort();
};

// Add experience to profile
export const addExperience = (profileId, experience) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const experiences = profile.data.experience || [];
  experiences.unshift({
    id: Date.now().toString(),
    ...experience,
    createdAt: new Date().toISOString()
  });

  return updateProfessionalProfile(profileId, { experience: experiences });
};

// Update experience
export const updateExperience = (profileId, experienceId, updates) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const experiences = profile.data.experience || [];
  const index = experiences.findIndex(e => e.id === experienceId);
  if (index === -1) return null;

  experiences[index] = { ...experiences[index], ...updates };
  return updateProfessionalProfile(profileId, { experience: experiences });
};

// Delete experience
export const deleteExperience = (profileId, experienceId) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const experiences = (profile.data.experience || []).filter(e => e.id !== experienceId);
  return updateProfessionalProfile(profileId, { experience: experiences });
};

// Add education to profile
export const addEducation = (profileId, education) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const educationList = profile.data.education || [];
  educationList.unshift({
    id: Date.now().toString(),
    ...education,
    createdAt: new Date().toISOString()
  });

  return updateProfessionalProfile(profileId, { education: educationList });
};

// Update education
export const updateEducation = (profileId, educationId, updates) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const educationList = profile.data.education || [];
  const index = educationList.findIndex(e => e.id === educationId);
  if (index === -1) return null;

  educationList[index] = { ...educationList[index], ...updates };
  return updateProfessionalProfile(profileId, { education: educationList });
};

// Delete education
export const deleteEducation = (profileId, educationId) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const educationList = (profile.data.education || []).filter(e => e.id !== educationId);
  return updateProfessionalProfile(profileId, { education: educationList });
};

// Add skill to profile
export const addSkill = (profileId, skill) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const skills = profile.data.skills || [];
  if (!skills.includes(skill)) {
    skills.push(skill);
    return updateProfessionalProfile(profileId, { skills });
  }
  return profile;
};

// Remove skill from profile
export const removeSkill = (profileId, skill) => {
  const profile = getProfessionalProfileById(profileId);
  if (!profile) return null;

  const skills = (profile.data.skills || []).filter(s => s !== skill);
  return updateProfessionalProfile(profileId, { skills });
};

// Set active professional profile
export const setActiveProfessionalProfile = (profileId) => {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
};

// Get active professional profile
export const getActiveProfessionalProfile = () => {
  const profileId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (profileId) {
    return getProfessionalProfileById(profileId);
  }
  return null;
};
