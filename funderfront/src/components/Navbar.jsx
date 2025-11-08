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
    <nav className="bg-indigo-600 dark:bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">Funder</Link>
        <div className="flex space-x-4">
          <Link to="/projects" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">All Projects</Link>
          <Link to="/users" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">All Users</Link>
          {isLoggedIn && <Link to="/create-project" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">Create Project</Link>}
          {isLoggedIn && <Link to="/my-projects" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">My Projects</Link>}
          {isLoggedIn && <Link to="/profile" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">Profile</Link>}
          {!isLoggedIn && <Link to="/login" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">Login</Link>}
          {!isLoggedIn && <Link to="/register" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">Register</Link>}
          {!isLoggedIn && <Link to="/activate" className="text-white hover:text-gray-200 dark:hover:text-gray-300 transition duration-300">Activate</Link>}
          {isLoggedIn && (
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
