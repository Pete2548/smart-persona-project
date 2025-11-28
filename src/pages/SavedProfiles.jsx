import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import { getAllProfessionalProfiles } from '../services/professionalProfileManager';
import { getSavedProfiles, unsaveProfile } from '../services/savedProfiles';
import Sidebar from '../components/Sidebar';
import LoginModal from '../components/LoginModal';

function SavedProfiles() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    loadSavedProfiles();
  }, []);

  const loadSavedProfiles = () => {
    const savedIds = getSavedProfiles();
    const allProfiles = getAllProfessionalProfiles();
    
    // Get profiles that match saved IDs
    const profiles = allProfiles.filter(p => savedIds.includes(p.id));
    setSavedProfiles(profiles);
  };

  const handleUnsave = (profileId) => {
    unsaveProfile(profileId);
    setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const handleProfileClick = (profile) => {
    const username = profile.data?.username;
    if (username) {
      navigate(`/u/${username}`);
    }
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    navigate('/signup');
  };

  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <Container>
            <div className="mb-4">
              <h2 className="fw-bold mb-2">{t('saved_profiles_title')}</h2>
              <p className="text-muted">
                {t('saved_profiles')} ({savedProfiles.length})
              </p>
            </div>

            {savedProfiles.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-heart display-1 text-muted"></i>
                <h5 className="mt-3 text-muted">{t('no_saved_profiles')}</h5>
                <p className="text-muted mb-4">
                  {t('start_saving')}
                </p>
                <Button variant="dark" onClick={() => navigate('/explore')}>
                  <i className="bi bi-search me-2"></i>
                  {t('explore_people_btn')}
                </Button>
              </div>
            ) : (
              <Row className="g-4">
                {savedProfiles.map((profile) => {
                  const data = profile.data || {};
                  const skills = data.skills || [];
                  const topSkills = skills.slice(0, 3);

                  return (
                    <Col key={profile.id} md={6} lg={4}>
                      <Card 
                        className="h-100 shadow-sm border-0 position-relative" 
                        style={{ 
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                        }}
                        onClick={() => handleProfileClick(profile)}
                      >
                        {/* Remove Button */}
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute"
                          style={{
                            top: '10px',
                            right: '10px',
                            zIndex: 10,
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnsave(profile.id);
                          }}
                        >
                          <i className="bi bi-heart-fill"></i>
                        </Button>
                        
                        <div 
                          style={{
                            height: '100px',
                            background: data.bgColor || '#6c5ce7',
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px'
                          }}
                        />
                        <Card.Body className="text-center" style={{ marginTop: '-50px' }}>
                          <img
                            src={data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.displayName || 'User')}&background=random&color=fff&size=200`}
                            alt={data.displayName}
                            style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              border: '4px solid white',
                              marginBottom: '12px',
                              objectFit: 'cover'
                            }}
                          />
                          
                          <h5 className="fw-bold mb-1" style={{ fontSize: '18px' }}>
                            {data.displayName || t('anonymous')}
                          </h5>
                          
                          {data.jobTitle && (
                            <p className="text-primary mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                              {data.jobTitle}
                            </p>
                          )}

                          {data.location && (
                            <p className="text-muted small mb-2">
                              <i className="bi bi-geo-alt me-1"></i>
                              {data.location}
                            </p>
                          )}

                          {data.experienceYears > 0 && (
                            <p className="text-muted small mb-3">
                              <i className="bi bi-briefcase me-1"></i>
                              {data.experienceYears} {data.experienceYears === 1 ? 'year' : 'years'} experience
                            </p>
                          )}

                          {/* Top Skills */}
                          {topSkills.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 justify-content-center mb-3">
                              {topSkills.map((skill, idx) => (
                                <Badge 
                                  key={idx} 
                                  bg="light" 
                                  text="dark" 
                                  className="px-2 py-1"
                                  style={{ fontSize: '11px', fontWeight: '500' }}
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {skills.length > 3 && (
                                <Badge 
                                  bg="secondary" 
                                  className="px-2 py-1"
                                  style={{ fontSize: '11px' }}
                                >
                                  +{skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <Button variant="dark" size="sm" className="w-100">
                            {t('view_profile')}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Container>
        </main>
      </div>

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </div>
  );
}

export default SavedProfiles;
