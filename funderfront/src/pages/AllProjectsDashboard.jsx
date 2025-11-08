import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import API_BASE_URL from '../config';

const AllProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDateChange = async (e) => {
    const date = e.target.value;
    setFilterDate(date);
    if (date) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/search/?date=${date}`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error searching projects by date:', error);
      }
    } else {
      // If date filter is cleared, refetch all projects
      const response = await fetch(`${API_BASE_URL}/projects/`);
      const data = await response.json();
      setProjects(data);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-600 dark:text-indigo-400">All Projects Dashboard</h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-1/2 lg:w-1/3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
        />
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDateChange}
          className="w-full sm:w-auto p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">{project.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{project.details}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Owner: <Link to={`/profile/${project.owner}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{project.owner_full_name}</Link></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Funds Raised: <span className="font-semibold text-green-600">${project.current_funding}</span> / <span className="font-semibold">${project.total_target}</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Dates: {project.start_time} to {project.end_time}</p>
              </div>
              <Link to={`/projects/${project.id}`} className="mt-4 inline-block bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300">View Details</Link>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-gray-600 dark:text-gray-400 col-span-full">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default AllProjectsDashboard;
