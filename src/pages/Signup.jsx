import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from 'react';
import '../App.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    birthDate: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Your Account</h1>
      <h5 className="signup-subtitle">YOUR PERSONAL INFORMATION</h5>
      <p className="mandatory-text">(*) All fields mandatory</p>

      <Form className="signup-form" onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                name="username"
                placeholder="*Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Control
                type="date"
                name="birthDate"
                placeholder="mm/dd/yyyy"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                name="firstName"
                placeholder="*First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                name="lastName"
                placeholder="*Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Control
                type="email"
                name="email"
                placeholder="*Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Control
                type="password"
                name="password"
                placeholder="*Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button 
            variant="dark"
            type="submit"
            className="create-button"
          >
            Create Account
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
