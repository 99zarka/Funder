import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const MyProjectsManagementPage = () => {
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    const fetchMyProjects = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // Redirect to login or show error
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/projects/user_projects/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setMyProjects(data);
      } catch (error) {
        console.error('Error fetching user projects:', error);
      }
    };

    fetchMyProjects();
  }, []);

  const handleEditProject = (projectId) => {
    console.log(`Editing project with ID: ${projectId}`);
    // Implement navigation to an edit project page or open a modal
  };

  const handleDeleteProject = async (projectId) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMyProjects(myProjects.filter(project => project.id !== projectId));
      console.log(`Project ${projectId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
    }
  };

  return (
    <div>
      <h1>My Projects Management</h1>
      {myProjects.length > 0 ? (
        myProjects.map((project) => (
          <div key={project.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h2>{project.title}</h2>
            <p>{project.details}</p>
            <p>Target: ${project.total_target} | Raised: ${project.current_funds}</p>
            <p>Dates: {project.start_time} to {project.end_time}</p>
            <button onClick={() => handleEditProject(project.id)}>Edit</button>
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
            <a href={`/projects/${project.id}`}>View Details</a>
          </div>
        ))
      ) : (
        <p>You haven't created any projects yet.</p>
      )}
    </div>
  );
};

export default MyProjectsManagementPage;
