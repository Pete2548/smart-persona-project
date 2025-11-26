// 1. เราจะเปลี่ยนไปใช้ Dropdown พื้นฐาน (ไม่ใช่ NavDropdown)
import React, { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Dropdown, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login, getCurrentUser, logout } from '../services/auth'
import LoginModal from './LoginModal'

function VereHeader() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [current, setCurrent] = useState(getCurrentUser())
  const [showLoginModal, setShowLoginModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setCurrent(getCurrentUser())
    // If user just registered, pre-fill login fields
    try {
      const raw = localStorage.getItem('lastRegistered')
      if (raw) {
        const obj = JSON.parse(raw)
        if (obj) {
          if (obj.identifier) setIdentifier(obj.identifier)
          if (obj.password) setPassword(obj.password)
        }
        localStorage.removeItem('lastRegistered')
      }
    } catch (e) {}
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const res = login(identifier, password)
    if (!res.ok) {
      alert(res.message || 'Login failed')
      return
    }
    // navigate to dashboard
    navigate('/dashboard')
    // update state
    setCurrent({ username: res.user.username, email: res.user.email })
  }

  const handleLogout = () => {
    logout()
    setCurrent(null)
    navigate('/')
  }

  const handleDashboardClick = (e) => {
    e.preventDefault()
    const user = getCurrentUser()
    if (!user) {
      setShowLoginModal(true)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
    {/* Layout 3 ส่วน (flex: 1) ยังคงอยู่เหมือนเดิม เพื่อ "ล็อค" โลโก้ไว้ */}
    <Navbar bg="light" expand={false} className="shadow">
      <Container fluid className="d-flex justify-content-between align-items-center">

        {/* left menu */}
        <div style={{ flex: '1 1 0' }}>
          <Dropdown>
            <Dropdown.Toggle as={Nav.Link} className="p-0" id="main-menu-toggle">
              <i className="bi bi-list fs-4"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleDashboardClick}>Dashboard</Dropdown.Item>
              <Dropdown.Item href="/about">About</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* center */}
        <div style={{ flex: '1 1 0' }} className="text-center">
          <Navbar.Brand href="/" className="fw-bold fs-4 m-0">VERE</Navbar.Brand>
        </div>

        {/* right */}
        <div style={{ flex: '1 1 0' }} className="d-flex justify-content-end">
          <Dropdown align="end">
            <Dropdown.Toggle as={Nav.Link} className="p-0" id="profile-menu-toggle">
              <i className="bi bi-person fs-4"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {!current && (
                <>
                  <Dropdown.Item as={Link} to="/create-account" className='text-center '>
                    <Button className='btn-secondary fw-bold'>Create Account</Button>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <div className="p-3" style={{ minWidth: '250px' }}>
                    <p className="fw-bold text-center mb-2">Login</p>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-2">
                        <Form.Control value={identifier} onChange={e=>setIdentifier(e.target.value)} type="text" placeholder="Username or email" size="sm" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" size="sm" />
                      </Form.Group>
                      <Button variant="secondary" type="submit" className="w-100 btn-sm">Login</Button>
                    </Form>
                  </div>
                </>
              )}

              {current && (
                <div className="p-2" style={{ minWidth: '200px' }}>
                  <div className="mb-2 text-center">Signed in as <strong>{current.username}</strong></div>
                  <div className="d-grid">
                    <Button variant="secondary" size="sm" onClick={handleLogout}>Logout</Button>
                  </div>
                </div>
              )}

            </Dropdown.Menu>
          </Dropdown>
        </div>

      </Container>
    </Navbar>
    {showLoginModal && (
      <LoginModal 
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false)
          navigate('/signup')
        }}
      />
    )}
    </>
  )
}

export default VereHeader;