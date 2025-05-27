import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { jwtDecode } from 'jwt-decode';

function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { setIsLoggedIn, setUserEmail, setUserId, setUserRole } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed");
      setSuccess(false);
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", formData.email); 

      const decoded = jwtDecode(data.token);

      setIsLoggedIn(true);
      setUserEmail(decoded.email);
      setUserId(decoded.id);
      setUserRole(decoded.role);

      setSuccess(true);
      setError('');
      setFormData({ email: '', password: '' });

      navigate("/");
    }
    } catch (err) {
      console.error("Ошибка входа:", err);
      setError("Server error. Please try again later.");
      setSuccess(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign In</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={(e) => e.which === 32 && e.preventDefault()}
                placeholder="Email"
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Login successful!</div>}

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Signin;