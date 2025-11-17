// 1. เราจะเปลี่ยนไปใช้ Dropdown พื้นฐาน (ไม่ใช่ NavDropdown)
import { Navbar, Container, Nav, Dropdown, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function VereHeader() {
  return (
    // Layout 3 ส่วน (flex: 1) ยังคงอยู่เหมือนเดิม เพื่อ "ล็อค" โลโก้ไว้
    <Navbar bg="light" expand={false} className="shadow">
      <Container fluid className="d-flex justify-content-between align-items-center">

        {/* ===== ส่วนที่ 1: ซ้าย (เมนู Pop-up ลอย) ===== */}
        <div style={{ flex: '1 1 0' }}>
          
          {/* 2. เปลี่ยนมาใช้ <Dropdown> ธรรมดา */}
          <Dropdown>
            {/* 3. เราสร้างปุ่ม Toggle เองให้เป็นแค่ไอคอน */}
            <Dropdown.Toggle 
              as={Nav.Link} // ทำให้หน้าตาเหมือนลิงก์ (ไม่มีพื้นหลัง)
              className="p-0" // เอา padding ออก
              id="main-menu-toggle"
            >
              <i className="bi bi-list fs-4"></i>
            </Dropdown.Toggle>

            {/* 4. Dropdown.Menu นี้จะ "ลอยทับ" หน้า HomePage ครับ */}
            <Dropdown.Menu>
              <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
              <Dropdown.Item href="/about">About</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </div>

        {/* ===== ส่วนที่ 2: กลาง (1/3) (ล็อคไว้) ===== */}
        <div style={{ flex: '1 1 0' }} className="text-center">
          <Navbar.Brand href="/" className="fw-bold fs-4 m-0">
            VERE
          </Navbar.Brand>
        </div>

        {/* ===== ส่วนที่ 3: ขวา (เมนู Pop-up ลอย) ===== */}
        <div style={{ flex: '1 1 0' }} className="d-flex justify-content-end">

          {/* 5. เราเปลี่ยนฝั่งขวาเป็น <Dropdown> ด้วย เพื่อให้ลอยทับเหมือนกัน */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              as={Nav.Link} 
              className="p-0" 
              id="profile-menu-toggle"
            >
              <i className="bi bi-person fs-4"></i>
            </Dropdown.Toggle>

            {/* 6. เมนู Login นี้ก็จะ "ลอยทับ" เช่นกัน */}
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/create-account" className='text-center '>
               <Button className='btn-secondary fw-bold'>Create Account</Button>
              </Dropdown.Item>
              <Dropdown.Divider />
              
              <div className="p-3" style={{ minWidth: '250px' }}>
                <p className="fw-bold text-center mb-2">Login</p>
                <Form>
                  <Form.Group className="mb-2">
                    <Form.Control type="text" placeholder="Your Username" size="sm" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control type="password" placeholder="Password" size="sm" />
                  </Form.Group>
                  <Button variant="secondary" type="submit" className="w-100 btn-sm">
                    Login
                  </Button>
                </Form>
              </div>
            </Dropdown.Menu>
          </Dropdown>

        </div>
        
      </Container>
    </Navbar>
  );
}

export default VereHeader;