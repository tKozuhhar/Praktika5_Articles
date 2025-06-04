import React, { useContext, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';

import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home';
import Articles from './components/Articles.js'
import ArticlePage from "./components/ArticlePage";
import { AuthContext } from './components/AuthContext';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, userEmail, setIsLoggedIn, setUserEmail, setUserId, setUserRole } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');

    setIsLoggedIn(false);
    setUserEmail('');
    setUserId(null);
    setUserRole('');

    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, [setIsLoggedIn, setUserEmail]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 col-lg-12">
          <div className="container-fluid">
            {/* навигационное меню (navbar) с использованием Bootstrap */}
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-center static-top">
              {/* кнопка для мобильного меню (гамбургер) */}
              <button
                className="navbar-toggler mx-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse text-center" id="navbarSupportedContent">
                <ul className="nav nav-tabs nav-fill navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">Home</NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/articles" className="nav-link">Articles</NavLink>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#Profile" role="button" data-bs-toggle="dropdown">
                      {isLoggedIn ? userEmail : "Profile"}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark">
                      {!isLoggedIn ? (
                        <>
                          <li><Link className="dropdown-item" to="/signup">Sign up</Link></li>
                          <li><Link className="dropdown-item" to="/signin">Sign in</Link></li>
                        </>
                      ) : (
                        <li><Link className="dropdown-item" to="/" onClick={handleLogout}>Log out</Link></li>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          {/* маршруты приложения */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
