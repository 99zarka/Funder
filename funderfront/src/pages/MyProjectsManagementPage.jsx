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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">My Projects Management</h1>
        {myProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((project) => (
              <div key={project.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                    <Link to={`/projects/${project.id}`} className="hover:underline">{project.title}</Link>
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">{project.details}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Target: <span className="font-semibold">${project.total_target}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Raised: <span className="font-semibold text-green-600">${project.current_funding}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Dates: {project.start_time} to {project.end_time}</p>
                </div>
                <div className="flex flex-col space-y-2 mt-4">
                  <button
                    onClick={() => handleEditProject(project.id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 font-semibold"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/projects/${project.id}`}
                    className="w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600 dark:text-gray-400">You haven't created any projects yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyProjectsManagementPage;
