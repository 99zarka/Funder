import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Funder</Link>
      <div className="navbar-links">
        <Link to="/projects">All Projects</Link>
        <Link to="/create-project">Create Project</Link>
        <Link to="/my-projects">My Projects</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/activate">Activate</Link>
      </div>
    </nav>
  );
};

export default Navbar;
