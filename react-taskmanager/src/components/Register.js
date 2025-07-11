// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';
import registerBg from '../assets/registerbg.jpg';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    address: "",
    role: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert("User registered: " + result.name);
        navigate("/login", { state: { email: result.email, password: result.password } });
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error while submitting form");
    }
  };

  return (
    <div className="form-wrapper" style={{
      backgroundImage: `url(${registerBg})`,
      backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center', minHeight: '100vh'
    }}>
      <div className="signup-card">
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          </div>
          <div className="mb-3 text-dark">
            Gender:
            <input type="radio" name="gender" value="male" onChange={handleChange} className="ms-2 me-1" required /> Male
            <input type="radio" name="gender" value="female" onChange={handleChange} className="ms-3 me-1" /> Female
          </div>
          <div className="mb-3">
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
          </div>
          <div className="mb-3">
            <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows="3" required></textarea>
          </div>
          <div className="mb-3 text-dark">
            Role:
            
            <input type="radio" name="role" value="USER" onChange={handleChange} className="ms-3 me-1" /> User
          </div>
          <div className="mb-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary">Sign Up</button>
            <button type="reset" className="btn btn-danger">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
