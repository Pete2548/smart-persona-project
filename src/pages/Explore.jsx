import { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import LoginModal from '../components/LoginModal';

function Explore() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [demoProfiles] = useState([
    {
      username: 'johndoe',
      displayName: 'John Doe',
      description: 'Creative Designer & Developer',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6c5ce7&color=fff&size=200',
      bgColor: '#1a1a2e',
      nameColor: '#ffffff',
      blockColor: '#16213e'
    },
    {
      username: 'janesmth',
      displayName: 'Jane Smith',
      description: 'Digital Artist & Illustrator',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ff6b6b&color=fff&size=200',
      bgColor: '#ffe5e5',
      nameColor: '#c44569',
      blockColor: '#ffffff'
    },
    {
      username: 'alexchen',
      displayName: 'Alex Chen',
      description: 'Software Engineer',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=4834d4&color=fff&size=200',
      bgColor: '#0f0f0f',
      nameColor: '#a29bfe',
      blockColor: '#2d3436'
    },
    {
      username: 'sarahlee',
      displayName: 'Sarah Lee',
      description: 'Content Creator & Photographer',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=f39c12&color=fff&size=200',
      bgColor: '#fff9e6',
      nameColor: '#f39c12',
      blockColor: '#ffffff'
    }
  ]);

  const handleProfileClick = (profile) => {
    const user = getCurrentUser();
    if (!user) {
      setShowLoginModal(true);
    } else {
      navigate(`/u/${profile.username}`);
    }
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    navigate('/signup');
  };

  return (
    <>
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Explore Personas</h2>
          <p className="text-muted">Discover amazing profiles from our community</p>
        </div>

        <Row className="g-4">
          {demoProfiles.map((profile, index) => (
            <Col key={index} md={6} lg={3}>
              <Card 
                className="h-100 shadow-sm border-0" 
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
                <div 
                  style={{
                    height: '120px',
                    background: profile.bgColor,
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                  }}
                />
                <Card.Body className="text-center" style={{ marginTop: '-60px' }}>
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      border: '4px solid white',
                      marginBottom: '12px',
                      objectFit: 'cover'
                    }}
                  />
                  <h5 className="fw-bold mb-2" style={{ color: profile.nameColor }}>
                    {profile.displayName}
                  </h5>
                  <p className="text-muted small mb-2">@{profile.username}</p>
                  <p className="text-muted" style={{ fontSize: '14px' }}>
                    {profile.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5 p-4 bg-light rounded">
          <h5 className="fw-bold mb-3">Want to create your own persona?</h5>
          <p className="text-muted mb-3">
            Login or create an account to customize your profile and unlock all features
          </p>
          <Button 
            variant="dark" 
            size="lg"
            onClick={() => setShowLoginModal(true)}
          >
            Get Started
          </Button>
        </div>
      </Container>

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </>
  );
}

export default Explore;
