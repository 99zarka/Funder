import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise

    const handleStorageChange = () => {
      const newToken = localStorage.getItem('access_token');
      setIsLoggedIn(!!newToken);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Funder</Link>
      <div className="navbar-links">
        <Link to="/projects">All Projects</Link>
        <Link to="/users">All Users</Link> {/* New link for all users page */}
        {isLoggedIn && <Link to="/create-project">Create Project</Link>}
        {isLoggedIn && <Link to="/my-projects">My Projects</Link>}
        {isLoggedIn && <Link to="/profile">Profile</Link>}
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {!isLoggedIn && <Link to="/activate">Activate</Link>}
        {isLoggedIn && <button onClick={handleLogout} className="navbar-logout-button">Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
