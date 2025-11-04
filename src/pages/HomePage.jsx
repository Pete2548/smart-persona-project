import { Container, Row, Col, Button, Stack } from "react-bootstrap";

function HomePage() {
  // สมมติ Header สูงประมาณ 56px (มาตรฐานของ Bootstrap Navbar)
  const heroRemainingHeight = 'calc(100vh - 56px)'; 
  
  // 🚨 สไตล์ใหม่: สำหรับ Hero ทั้งหมด (รวมรูปเป็นพื้นหลัง)
  const fullHeroStyle = {
    // 1. จัดกึ่งกลางแนวตั้งและแนวนอนของเนื้อหาที่อยู่ข้างใน
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    
    // 2. ขยายเต็มพื้นที่ที่เหลือของหน้าจอ
    width: '100%', 
    minHeight: heroRemainingHeight, 
    
    // 3. ใส่รูปภาพเป็นพื้นหลังของ div นี้ทั้งหมด
    backgroundImage: `url('/src/img/connecting dot polygon.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center', // ให้ภาพอยู่ตรงกลาง
  };
    
  return (
    <>
      {/* 🚨 ส่วน Hero Section - ใช้สไตล์ใหม่ และนำโค้ดเนื้อหามาไว้ข้างในเลย */}
      <div style={fullHeroStyle}>
        
        <Container>
          {/* เนื้อหา Stack นี้จะถูกจัดกึ่งกลางของ div Hero ทั้งหมด */}
          {/* 🚨 เพิ่ม text-white และ text-light เพื่อให้อ่านออกบนพื้นหลังรูป */}
          <Stack gap={3} className="text-center"> 
            <h1 className="display-1 fw-bold ">V</h1>
            <h2 className="h4">
              Illuminate your true self with AI.
            </h2>
            <Stack direction="horizontal" gap={3} className="mx-auto">
              <Button variant="secondary" size="lg">
                Create Persona
              </Button>
              <Button variant="secondary" size="lg">
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
                <i className="bi bi-robot fs-1"></i>
                <h5 className="fw-bold">AI Persona</h5>
              </Stack>
            </Col>
            <Col md={4}>
              <Stack gap={2} className="align-items-center">
                <i className="bi bi-palette fs-1"></i>
                <h5 className="fw-bold">Profile Design</h5>
              </Stack>
            </Col>
            <Col md={4}>
              <Stack gap={2} className="align-items-center">
                <i className="bi bi-share fs-1"></i>
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
            >
              Start Now
            </Button>
          </Stack>
        </Container>
      </div>
    </>
  );
}

export default HomePage;