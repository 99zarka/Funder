import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-5xl font-extrabold mb-4 text-indigo-600 dark:text-indigo-400 animate-fade-in-down">Welcome to Funder!</h1>
      <p className="text-xl mb-8 text-center max-w-2xl animate-fade-in">Your platform for crowdfunding amazing projects.</p>
      <div className="flex space-x-4 animate-fade-in-up">
        <Link to="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">Login</Link>
        <Link to="/register" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 ease-in-out transform hover:scale-105 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Register</Link>
      </div>
      <p className="mt-8 text-lg animate-fade-in">
        Or explore <Link to="/projects" className="text-indigo-600 dark:text-indigo-400 hover:underline">all projects</Link>.
      </p>
    </div>
  );
};

export default LandingPage;
