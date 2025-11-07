import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to Funder!</h1>
      <p>Your platform for crowdfunding amazing projects.</p>
      <p>
        <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to get started.
      </p>
      <p>
        Explore <Link to="/projects">all projects</Link>.
      </p>
    </div>
  );
};

export default LandingPage;
