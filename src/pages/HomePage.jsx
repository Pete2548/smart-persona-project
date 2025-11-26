import { Container, Row, Col, Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import connectingDots from "../img/connecting dot polygon.jpg";
import Image from "react-bootstrap/Image";
import shareIcon from "../img/share.png";
import aiIcon from "../img/ai.png";
import profile from "../img/profile.png";
import logo from "../img/logo.png";
import { getCurrentUser } from "../services/auth";
import LoginModal from "../components/LoginModal";

function HomePage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCreatePersona = () => {
    const user = getCurrentUser();
    if (user) {
      navigate('/dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleExploreDashboard = () => {
    const user = getCurrentUser();
    if (user) {
      navigate('/dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    navigate('/signup');
  };
  // สมมติ Header สูงประมาณ 56px (มาตรฐานของ Bootstrap Navbar)
  const heroRemainingHeight = "calc(100vh - 56px)";

  // 🚨 สไตล์ใหม่: สำหรับ Hero ทั้งหมด (รวมรูปเป็นพื้นหลัง)
  const fullHeroStyle = {
    // 1. จัดกึ่งกลางแนวตั้งและแนวนอนของเนื้อหาที่อยู่ข้างใน
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    // 2. ขยายเต็มพื้นที่ที่เหลือของหน้าจอ
    width: "100%",
    minHeight: heroRemainingHeight,

    // 3. ใส่รูปภาพเป็นพื้นหลังของ div นี้ทั้งหมด
    backgroundImage: `url(${connectingDots})`,
    backgroundSize: "cover",
    backgroundPosition: "center", // ให้ภาพอยู่ตรงกลาง
  };

  return (
    <>
      {/* 🚨 ส่วน Hero Section - ใช้สไตล์ใหม่ และนำโค้ดเนื้อหามาไว้ข้างในเลย */}
      <div style={fullHeroStyle}>
        <Container>
          {/* เนื้อหา Stack นี้จะถูกจัดกึ่งกลางของ div Hero ทั้งหมด */}
          {/* 🚨 เพิ่ม text-white และ text-light เพื่อให้อ่านออกบนพื้นหลังรูป */}
          <Stack gap={3} className="text-center">
            <Image
              src={logo}
              rounded
              style={{ width: "300px", height: "300px" }}
              className="mx-auto"
            />
            <h2 className="h4">Illuminate your true self with AI.</h2>
            <Stack direction="horizontal" gap={3} className="mx-auto">
              <Button variant="secondary" size="lg" onClick={handleCreatePersona}>
                Create Persona
              </Button>
              <Button variant="secondary" size="lg" onClick={handleExploreDashboard}>
                Explore Others
              </Button>
            </Stack>
          </Stack>
        </Container>
      </div>

      {/* ส่วน What is VERE ยังคงเดิม */}
      <div className="bg-light p-5 text-center">
        <Container>
          <h3 className="fw-bold">What is VERE</h3>
          <p className="lead text-muted mt-3">
            A Smart Persona Platform that reflects your true identity through
            data and design. Elegant. Intelligent. Authentically You.
          </p>

          <Row className="mt-5 pt-3">
            <Col md={4}>
              <Stack gap={2} className="align-items-center">
                <Image
                  src={aiIcon}
                  rounded
                  style={{ width: "60px", height: "60px" }}
                />
                <h5 className="fw-bold">AI Persona</h5>
              </Stack>
            </Col>
            <Col md={4}>
              <Stack gap={2} className="align-items-center">
                <Image
                  src={profile}
                  rounded
                  style={{ width: "60px", height: "60px" }}
                />
                <h5 className="fw-bold">Profile Design</h5>
              </Stack>
            </Col>
            <Col md={4}>
              <Stack gap={2} className="align-items-center">
                <Image
                  src={shareIcon}
                  rounded
                  style={{ width: "60px", height: "60px" }}
                />
                <h5 className="fw-bold">Smart Sharing</h5>
              </Stack>
            </Col>
          </Row>

          <Stack gap={3} className="text-center my-5 py-5">
            <h3 className="fw-bold">Ready to build your persona?</h3>
            <Button
              variant="secondary"
              size="lg"
              className="mx-auto"
              style={{ width: "200px" }}
              onClick={handleCreatePersona}
            >
              Start Now
            </Button>
          </Stack>
        </Container>
      </div>

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </>
  );
}

export default HomePage;
