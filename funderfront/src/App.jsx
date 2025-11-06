import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import CreateProjectPage from './pages/CreateProjectPage';
import AllProjectsDashboard from './pages/AllProjectsDashboard';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import MyProjectsManagementPage from './pages/MyProjectsManagementPage';
import Navbar from './components/Navbar';
import ActivateUserPage from './pages/ActivateUserPage';

function App() {
  console.log("App component rendered");
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activate" element={<ActivateUserPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/projects" element={<AllProjectsDashboard />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/my-projects" element={<MyProjectsManagementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
