import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { getProfessionalProfileByUsername } from '../services/professionalProfileManager';
import { createReport } from '../services/reportService';
import { getProfileAnalytics, recordProfileView } from '../services/profileAnalytics';
import { getCurrentUser } from '../services/auth';
import './publicProfile.css';

const APP_LINK_OPTIONS = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'bi-linkedin', color: '#0a66c2', iconColor: '#ffffff' },
  { id: 'facebook', label: 'Facebook', icon: 'bi-facebook', color: '#1778f2', iconColor: '#ffffff' },
  { id: 'instagram', label: 'Instagram', icon: 'bi-instagram', color: '#d62976', iconColor: '#ffffff' },
  { id: 'tiktok', label: 'TikTok', icon: 'bi-tiktok', color: '#000000', iconColor: '#ffffff' },
  { id: 'line', label: 'LINE', icon: 'bi-chat-dots-fill', color: '#06c755', iconColor: '#ffffff' },
  { id: 'youtube', label: 'YouTube', icon: 'bi-youtube', color: '#ff0000', iconColor: '#ffffff' },
  { id: 'telegram', label: 'Telegram', icon: 'bi-telegram', color: '#229ed9', iconColor: '#ffffff' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'bi-whatsapp', color: '#25d366', iconColor: '#ffffff' },
  { id: 'github', label: 'GitHub', icon: 'bi-github', color: '#24292e', iconColor: '#ffffff' },
  { id: 'website', label: 'Website', icon: 'bi-globe', color: '#0f172a', iconColor: '#ffffff' },
  { id: 'custom', label: 'Link', icon: 'bi-link-45deg', color: '#475569', iconColor: '#ffffff' }
];

const APP_LINK_MAP = APP_LINK_OPTIONS.reduce((acc, option) => {
  acc[option.id] = option;
  return acc;
}, {});

const normalizeContactLinks = (links = []) => {
  return (links || [])
    .map(link => ({ ...link, url: link.url?.trim() }))
    .filter(link => Boolean(link.url));
};

const ProfessionalProfileView = () => {
  const { username } = useParams();
  const [profileRecord, setProfileRecord] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, ready, private, notfound
  const [contactCopied, setContactCopied] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    const record = getProfessionalProfileByUsername(username);
    if (!record) {
      setStatus('notfound');
      return;
    }

    setProfileRecord(record);
    if (record.data?.isPublic === false) {
      setStatus('private');
      return;
    }

    setStatus('ready');
    const analyticsData = getProfileAnalytics(record.id);
    setAnalytics(analyticsData);

    try {
      const viewer = getCurrentUser()?.username || 'anonymous';
      recordProfileView(record.id, viewer);
    } catch (err) {
      console.warn('Failed to record profile view', err);
    }
  }, [username]);

  const profile = useMemo(() => {
    if (!profileRecord) return null;
    return { ...profileRecord.data, username: profileRecord.username };
  }, [profileRecord]);
  const contactLinks = useMemo(() => normalizeContactLinks(profile?.contact?.links || []), [profile]);
  const primaryLocation = profile?.contact?.address || profile?.location || '';
  const vheartLikes = profile?.vheartLikes ?? profile?.followers ?? 0;
  const vheartCount = (analytics?.uniqueViewers || 0) + vheartLikes;
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const skills = profile?.skills || [];
  const featuredItems = profile?.featuredItems || profile?.featured || [];
  const recentActivity = profile?.recentActivity || profile?.activity || [];
  const hasContactDetails = Boolean(profile?.contact?.email || profile?.contact?.phone || contactLinks.length > 0);
  const contactSummary = useMemo(() => {
    if (!profile) return '';
    const lines = [];
    if (profile.contact?.email) lines.push(`Email: ${profile.contact.email}`);
    if (profile.contact?.phone) lines.push(`Phone: ${profile.contact.phone}`);
    if (profile.contact?.address) lines.push(`Location: ${profile.contact.address}`);
    if (contactLinks.length > 0) {
      contactLinks.forEach(link => {
        const label = APP_LINK_MAP[link.service]?.label || 'Link';
        lines.push(`${label}: ${link.url}`);
      });
    }
    return lines.join('\n');
  }, [profile, contactLinks]);

  const handleMessage = () => {
    if (profile?.contact?.email) {
      window.location.href = `mailto:${profile.contact.email}`;
      return;
    }
    if (profile?.contact?.phone) {
      window.location.href = `tel:${profile.contact.phone}`;
    }
  };

  const handleCopyContact = () => {
    if (!contactSummary) return;
    const fallback = () => window.prompt('Contact details', contactSummary);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(contactSummary)
        .then(() => setContactCopied(true))
        .catch(fallback);
    } else {
      fallback();
    }
    setTimeout(() => setContactCopied(false), 2000);
  };

  const handleReportSubmit = () => {
    if (!profile) return;
    createReport({
      targetUser: profile.username,
      reporter: getCurrentUser()?.username || 'Anonymous',
      reason: reportReason,
      details: reportDetails,
      profileType: 'professional'
    });
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportDetails('');
      setReportReason('Inappropriate Content');
    }, 2000);
  };

  if (status === 'loading') {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <i className="bi bi-person-x display-3 text-muted"></i>
          <p className="mt-3 text-muted">This professional profile could not be found.</p>
        </div>
      </div>
    );
  }

  if (status === 'private') {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <i className="bi bi-lock display-3 text-muted"></i>
          <p className="mt-3 text-muted">This profile is private.</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="public-profile-page" style={{ minHeight: '100vh', padding: '32px 0' }}>
      <Container className="linkedin-profile">
        <Card className="profile-header-card border-0 shadow-sm mb-4">
          <div className="cover-photo" style={{ height: 220, backgroundColor: profile.coverColor || '#0a66c2' }}>
            {profile.bgImage && (
              <img
                src={profile.bgImage}
                alt="Cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <Card.Body className="profile-header-body">
            <div className="d-flex flex-column align-items-center text-center">
              <div className="profile-photo-container">
                {profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="profile-photo"
                  />
                )}
              </div>
              <div className="flex-grow-1">
                <h2 className="profile-name mb-1">{profile.displayName || profile.username}</h2>
                {profile.jobTitle && (
                  <p className="profile-headline mb-2">{profile.jobTitle}</p>
                )}
                {profile.tagline && (
                  <p className="profile-tagline text-muted mb-2">{profile.tagline}</p>
                )}
                <div className="profile-meta text-muted small">
                  {primaryLocation && (
                    <span className="me-3">
                      <i className="bi bi-geo-alt me-1"></i>
                      {primaryLocation}
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

                <div className="profile-action-bar mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleMessage}
                    disabled={!profile.contact?.email && !profile.contact?.phone}
                  >
                    <i className="bi bi-chat-dots me-1"></i>
                    Message
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleCopyContact}
                    disabled={!contactSummary}
                  >
                    <i className="bi bi-person-lines-fill me-1"></i>
                    {contactCopied ? 'Contact copied!' : 'Save contact'}
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => setShowReportModal(true)}
                  >
                    <i className="bi bi-flag me-1"></i>
                    Report
                  </Button>
                </div>

                <div className="profile-vheart mt-3">
                  <div className="vheart-icon" aria-label="Vheart">
                    <i className="bi bi-heart-fill vheart-heart" aria-hidden="true"></i>
                    <span className="vheart-count">{vheartCount}</span>
                  </div>
                  <span className="vheart-label">Vheart</span>
                </div>

                {hasContactDetails && (
                  <div className="profile-contact-grid mt-3" id="public-contact-card">
                    {profile.contact?.email && (
                      <div className="contact-field">
                        <small className="text-muted">Email</small>
                        <div className="contact-value">{profile.contact.email}</div>
                      </div>
                    )}
                    {profile.contact?.phone && (
                      <div className="contact-field">
                        <small className="text-muted">Phone</small>
                        <div className="contact-value">{profile.contact.phone}</div>
                      </div>
                    )}
                    {contactLinks.length > 0 && (
                      <div className="contact-field">
                        <div className="profile-app-links">
                          {contactLinks.map((link, index) => {
                            const config = APP_LINK_MAP[link.service] || APP_LINK_MAP.custom;
                            return (
                              <button
                                type="button"
                                key={link.id || `${config.id}-${index}`}
                                className="app-link-pill"
                                style={{ backgroundColor: config.color, color: config.iconColor || '#ffffff' }}
                                onClick={() => window.open(link.url, '_blank', 'noopener')}
                                title={config.label}
                                aria-label={`${config.label} link`}
                              >
                                <i className={`bi ${config.icon}`}></i>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {analytics && (
              <div className="analytics-bar mt-4 pt-3 border-top">
                <Row className="text-center">
                  <Col xs={3}>
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.uniqueViewers}</div>
                      <div className="analytics-label">Unique Visitors</div>
                    </div>
                  </Col>
                  <Col xs={3}>
                    <div className="analytics-item">
                      <div className="analytics-value">{analytics.last7DaysViews}</div>
                      <div className="analytics-label">Last 7 Days</div>
                    </div>
                  </Col>
                  <Col xs={3}>
                    <div className="analytics-item">
                      <div className="analytics-value">{skills.length}</div>
                      <div className="analytics-label">Skills</div>
                    </div>
                  </Col>
                  <Col xs={3}>
                    <div className="analytics-item">
                      <div className="analytics-value">{experience.length}</div>
                      <div className="analytics-label">Experience</div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="section-card border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Highlights</h5>
            </div>
            {featuredItems.length === 0 ? (
              <div className="empty-state text-center py-4">
                <i className="bi bi-bookmark-star display-4 text-muted"></i>
                <p className="text-muted mt-2">No highlights to show yet.</p>
              </div>
            ) : (
              <div className="highlights-grid">
                {featuredItems.map((item, index) => (
                  <div key={item.id || index} className="highlight-card">
                    {item.cover && (
                      <div className="highlight-cover" style={{ backgroundImage: `url(${item.cover})` }} />
                    )}
                    <div className="highlight-meta">
                      <div className="highlight-label text-uppercase small text-muted">{item.type || 'Featured'}</div>
                      <h6 className="highlight-title mb-1">{item.title || 'Untitled highlight'}</h6>
                      {item.description && (
                        <p className="text-muted small mb-2">{item.description}</p>
                      )}
                      {item.url && (
                        <Button variant="link" size="sm" className="p-0" onClick={() => window.open(item.url, '_blank')}>
                          View
                          <i className="bi bi-box-arrow-up-right ms-1"></i>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="section-card border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Activity</h5>
            </div>
            {recentActivity.length === 0 ? (
              <div className="empty-state text-center py-4">
                <i className="bi bi-activity display-4 text-muted"></i>
                <p className="text-muted mt-2">No recent updates.</p>
              </div>
            ) : (
              <div className="activity-timeline">
                {recentActivity.map((item, index) => (
                  <div key={item.id || index} className="activity-item position-relative">
                    <div className="activity-badge">
                      <i className="bi bi-dot"></i>
                      {item.type || 'Update'}
                    </div>
                    <div className="activity-content">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="activity-title mb-1">{item.title || item.summary || 'New activity'}</h6>
                        {item.timestamp && (
                          <span className="activity-meta text-muted small">{item.timestamp}</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-muted small mb-0">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        {profile.description && (
          <Card className="section-card border-0 shadow-sm mb-3">
            <Card.Body>
              <h5 className="section-title mb-3">About</h5>
              <div>{profile.description}</div>
            </Card.Body>
          </Card>
        )}

        <Card className="section-card border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Experience</h5>
            </div>
            {experience.length === 0 ? (
              <div className="empty-state text-center py-4">
                <i className="bi bi-briefcase display-4 text-muted"></i>
                <p className="text-muted mt-2">No experience added yet.</p>
              </div>
            ) : (
              <div className="experience-list">
                {experience.map((exp, index) => (
                  <div key={exp.id || index} className="experience-item">
                    <div className="d-flex gap-3">
                      <div className="experience-icon">
                        <i className="bi bi-building"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{exp.position || 'Role'}</h6>
                        <div className="text-muted small mb-1">
                          {exp.company} {exp.location ? `• ${exp.location}` : ''}
                        </div>
                        <div className="text-muted small mb-2">
                          {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                        </div>
                        {exp.description && (
                          <p className="text-muted small mb-0">{exp.description}</p>
                        )}
                        {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                          <ul className="mt-2 mb-0 text-muted small">
                            {exp.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex}>{bullet}</li>
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

        <Card className="section-card border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Education</h5>
            </div>
            {education.length === 0 ? (
              <div className="empty-state text-center py-4">
                <i className="bi bi-mortarboard display-4 text-muted"></i>
                <p className="text-muted mt-2">No education entries yet.</p>
              </div>
            ) : (
              <div className="education-list">
                {education.map((edu, index) => (
                  <div key={edu.id || index} className="education-item">
                    <div className="d-flex gap-3">
                      <div className="education-icon">
                        <i className="bi bi-award"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{edu.degree || 'Education'}</h6>
                        <div className="text-muted small mb-1">
                          {edu.school} {edu.location ? `• ${edu.location}` : ''}
                        </div>
                        <div className="text-muted small mb-2">
                          {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                        </div>
                        {edu.coursework && (
                          <p className="text-muted small mb-0">{edu.coursework}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        <Card className="section-card border-0 shadow-sm mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="section-title mb-0">Skills</h5>
            </div>
            {skills.length === 0 ? (
              <div className="empty-state text-center py-4">
                <i className="bi bi-lightning display-4 text-muted"></i>
                <p className="text-muted mt-2">No skills listed yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} bg="light" text="dark" className="px-3 py-2 border rounded-pill">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Report Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportSubmitted ? (
            <div className="text-center text-success py-4">
              <i className="bi bi-check-circle display-4 mb-3"></i>
              <p>Report submitted successfully. Thank you.</p>
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Reason</Form.Label>
                <Form.Select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option>Inappropriate Content</option>
                  <option>Harassment</option>
                  <option>Spam / Fake Profile</option>
                  <option>Intellectual Property Violation</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Details (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Please provide more details..."
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        {!reportSubmitted && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReportSubmit}>
              Submit Report
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default ProfessionalProfileView;
