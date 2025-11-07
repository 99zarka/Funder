import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import API_BASE_URL from '../config';

const MyProjectsManagementPage = () => {
  const [myProjects, setMyProjects] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchMyProjects = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found, redirecting to login.');
        navigate('/login'); // Redirect to login if no token
        return;
      }

      console.log('Fetching user projects with token:', token);
      try {
        const response = await fetch(`${API_BASE_URL}/projects/my-projects/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API response not OK:', response.status, errorText);
          throw new Error(`Failed to fetch user projects: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Fetched user projects data:', data);
        setMyProjects(data);
      } catch (error) {
        console.error('Error fetching user projects:', error);
        // Optionally set an error state to display to the user
      }
    };

    fetchMyProjects();
  }, [navigate]); // Add navigate to dependency array to ensure effect re-runs if navigate changes (though it's stable)

  const handleEditProject = (projectId) => {
    navigate(`/edit-project/${projectId}`);
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
            <h2><Link to={`/projects/${project.id}`}>{project.title}</Link></h2>
            <p>{project.details}</p>
            <p>Target: ${project.total_target} | Raised: ${project.current_funds}</p>
            <p>Dates: {project.start_time} to {project.end_time}</p>
            <button onClick={() => handleEditProject(project.id)}>Edit</button>
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
            <Link to={`/projects/${project.id}`}>View Details</Link>
          </div>
        ))
      ) : (
        <p>You haven't created any projects yet.</p>
      )}
    </div>
  );
};

export default MyProjectsManagementPage;
