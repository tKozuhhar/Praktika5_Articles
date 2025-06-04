import React, { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) { // проверяем, совпадают ли пароли
    setError("Passwords do not match");
    return;
  }

    try {
        const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: formData.email,
            password: formData.password,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Registration failed");
            setSuccess(false);
        } else {
            setSuccess(true);
            setError("");
            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
            });
        }
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            setError("Server error. Please try again later.");
            setSuccess(false);
        }
    };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>

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
                        minLength={8} // минимальная длина пароля — 8 символов
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
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
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                    />
                </div>
            </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Registration successful!</div>}

          <button type="submit" className="custom-register-btn btn w-100 text-white">Register</button>

        </form>
      </div>
    </div>
  );
}

export default Signup;
