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
        const response = await fetch(`${API_BASE_URL}/projects/search_by_date/?date=${date}`);
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
    <div>
      <h1>All Projects Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDateChange}
        />
      </div>
      <div>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h2>{project.title}</h2>
              <p>{project.details}</p>
              <p>Owner: <Link to={`/profile/${project.owner}`}>{project.owner_full_name}</Link></p> {/* Display owner's full name */}
              <p>Funds Raised: ${project.current_funds} / ${project.total_target}</p>
              <p>Dates: {project.start_time} to {project.end_time}</p>
              <Link to={`/projects/${project.id}`}>View Details</Link>
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default AllProjectsDashboard;
