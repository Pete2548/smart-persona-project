import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import { getCurrentUserProfessionalProfile, createProfessionalProfile } from '../services/professionalProfileManager';
import { getProfileAnalytics } from '../services/profileAnalytics';
import Sidebar from '../components/Sidebar';
import LoginModal from '../components/LoginModal';
import './myprofile.css';

function MyProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [showFullAbout, setShowFullAbout] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Get or create professional profile for current user
    let professionalProfile = getCurrentUserProfessionalProfile();
    if (!professionalProfile) {
      professionalProfile = createProfessionalProfile(currentUser.username);
    }

    if (professionalProfile) {
      setProfile(professionalProfile.data);
      
      // Get analytics
      const analyticsData = getProfileAnalytics(professionalProfile.id);
      setAnalytics(analyticsData);
    }
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    navigate('/signup');
  };

  if (!profile) {
    return (
      <div className="dashboard-shell p-4">
        <div className="dashboard-card d-flex">
          <Sidebar />
          <main className="dashboard-main p-4">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
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

  const experience = profile.experience || [];
  const education = profile.education || [];
  const skills = profile.skills || [];

  return (
    <div className="dashboard-shell p-4">
      <div className="dashboard-card d-flex">
        <Sidebar />

        <main className="dashboard-main p-4">
          <Container className="linkedin-profile">
            {/* Header Card */}
            <Card className="profile-header-card border-0 shadow-sm mb-3">
              {/* Cover Photo */}
              <div 
                className="cover-photo"
                style={{
                  height: '200px',
                  background: profile.bgColor || profile.bgImage 
                    ? `url(${profile.bgImage}) center/cover` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundColor: profile.bgColor || '#667eea'
                }}
              />

              <Card.Body className="profile-header-body">
                <div className="d-flex align-items-start">
                  {/* Profile Photo */}
                  <div className="profile-photo-container">
                    <img
                      src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || 'User')}&background=0D47A1&color=fff&size=200`}
                      alt={profile.displayName}
                      className="profile-photo"
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-grow-1 ms-3">
                    <h2 className="profile-name mb-1">{profile.displayName || 'Your Name'}</h2>
                    
                    {profile.jobTitle && (
                      <p className="profile-headline mb-2">{profile.jobTitle}</p>
                    )}

                    <div className="profile-meta text-muted small">
                      {profile.location && (
                        <span className="me-3">
                          <i className="bi bi-geo-alt me-1"></i>
                          {profile.location}
                        </span>
                      )}
                      {analytics && (
                        <span className="me-3">
                          <i className="bi bi-eye me-1"></i>
                          {analytics.totalViews} profile views
                        </span>
                      )}
                      {profile.username && (
                        <span>
                          <i className="bi bi-link-45deg me-1"></i>
                          vere.me/{profile.username}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 d-flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => navigate('/edit-professional-profile')}
                      >
                        <i className="bi bi-pencil me-1"></i>
                        {t('edit_profile')}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => window.open(`/u/${profile.username}`, '_blank')}
                      >
                        <i className="bi bi-eye me-1"></i>
                        {t('view_public_profile')}
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <i className="bi bi-share me-1"></i>
                        {t('share')}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Analytics Summary */}
                {analytics && (
                  <div className="analytics-bar mt-3 pt-3 border-top">
                    <Row className="text-center">
                      <Col xs={3}>
                        <div className="analytics-item">
                          <div className="analytics-value">{analytics.uniqueViewers}</div>
                          <div className="analytics-label">{t('unique_visitors')}</div>
                        </div>
                      </Col>
                      <Col xs={3}>
                        <div className="analytics-item">
                          <div className="analytics-value">{analytics.last7DaysViews}</div>
                          <div className="analytics-label">{t('last_7_days')}</div>
                        </div>
                      </Col>
                      <Col xs={3}>
                        <div className="analytics-item">
                          <div className="analytics-value">{skills.length}</div>
                          <div className="analytics-label">{t('skills')}</div>
                        </div>
                      </Col>
                      <Col xs={3}>
                        <div className="analytics-item">
                          <div className="analytics-value">{experience.length}</div>
                          <div className="analytics-label">{t('experience')}</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* About Section */}
            {profile.description && (
              <Card className="section-card border-0 shadow-sm mb-3">
                <Card.Body>
                  <h5 className="section-title mb-3">{t('about')}</h5>
                  <div className={`about-text ${showFullAbout ? 'expanded' : 'collapsed'}`}>
                    {profile.description}
                  </div>
                  {profile.description.length > 200 && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 mt-2"
                      onClick={() => setShowFullAbout(!showFullAbout)}
                    >
                      {showFullAbout ? t('show_less') : t('show_more')}
                      <i className={`bi bi-chevron-${showFullAbout ? 'up' : 'down'} ms-1`}></i>
                    </Button>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Experience Section */}
            <Card className="section-card border-0 shadow-sm mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="section-title mb-0">{t('experience')}</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/edit-professional-profile')}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    {t('add_experience')}
                  </Button>
                </div>

                {experience.length === 0 ? (
                  <div className="empty-state text-center py-4">
                    <i className="bi bi-briefcase display-4 text-muted"></i>
                    <p className="text-muted mt-2">{t('no_experience')}</p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate('/edit-professional-profile')}
                    >
                      {t('add_your_first_experience')}
                    </Button>
                  </div>
                ) : (
                  <div className="experience-list">
                    {experience.map((exp, index) => (
                      <div key={index} className="experience-item">
                        <div className="d-flex gap-3">
                          <div className="experience-icon">
                            <i className="bi bi-building"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="experience-position mb-1">{exp.position}</h6>
                            <div className="experience-company mb-1">{exp.company}</div>
                            <div className="experience-meta text-muted small mb-2">
                              {exp.startDate} - {exp.endDate || 'Present'}
                              {exp.location && ` • ${exp.location}`}
                            </div>
                            {exp.description && (
                              <p className="experience-description small">{exp.description}</p>
                            )}
                            {exp.bullets && exp.bullets.length > 0 && (
                              <ul className="experience-bullets small">
                                {exp.bullets.map((bullet, idx) => (
                                  <li key={idx}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Education Section */}
            <Card className="section-card border-0 shadow-sm mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="section-title mb-0">{t('education')}</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/edit-professional-profile')}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    {t('add_education')}
                  </Button>
                </div>

                {education.length === 0 ? (
                  <div className="empty-state text-center py-4">
                    <i className="bi bi-mortarboard display-4 text-muted"></i>
                    <p className="text-muted mt-2">{t('no_education')}</p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate('/edit-professional-profile')}
                    >
                      {t('add_your_first_education')}
                    </Button>
                  </div>
                ) : (
                  <div className="education-list">
                    {education.map((edu, index) => (
                      <div key={index} className="education-item">
                        <div className="d-flex gap-3">
                          <div className="education-icon">
                            <i className="bi bi-mortarboard"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="education-school mb-1">{edu.school}</h6>
                            <div className="education-degree mb-1">{edu.degree}</div>
                            <div className="education-meta text-muted small mb-2">
                              {edu.startDate} - {edu.endDate}
                              {edu.location && ` • ${edu.location}`}
                            </div>
                            {edu.coursework && (
                              <p className="education-coursework small text-muted">
                                Coursework: {edu.coursework}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Skills Section */}
            <Card className="section-card border-0 shadow-sm mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="section-title mb-0">{t('skills')}</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/edit-professional-profile')}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    {t('add_skills')}
                  </Button>
                </div>

                {skills.length === 0 ? (
                  <div className="empty-state text-center py-4">
                    <i className="bi bi-star display-4 text-muted"></i>
                    <p className="text-muted mt-2">{t('no_skills')}</p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate('/edit-professional-profile')}
                    >
                      {t('add_your_first_skill')}
                    </Button>
                  </div>
                ) : (
                  <div className="skills-grid">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={index}
                        bg="light"
                        text="dark"
                        className="skill-badge"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
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

export default MyProfile;
