import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../config';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}/`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleContributionChange = (e) => {
    setContributionAmount(e.target.value);
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login or show error
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/contribute/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: contributionAmount,
        }),
      });
      const data = await response.json();
      console.log('Contribution successful:', data);
      // Update project funds or show success message
      setProject((prevProject) => ({
        ...prevProject,
        current_funds: prevProject.current_funds + parseFloat(contributionAmount),
      }));
      setContributionAmount('');
    } catch (error) {
      console.error('Error contributing to project:', error);
    }
  };

  if (!project) {
    return <div>Loading project details...</div>;
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p><strong>Details:</strong> {project.details}</p>
      <p><strong>Owner:</strong> {project.owner}</p>
      <p><strong>Target:</strong> ${project.total_target}</p>
      <p><strong>Funds Raised:</strong> ${project.current_funds}</p>
      <p><strong>Start Date:</strong> {project.start_time}</p>
      <p><strong>End Date:</strong> {project.end_time}</p>

      <h2>Contribute to this Project</h2>
      <form onSubmit={handleContribute}>
        <input
          type="number"
          placeholder="Amount"
          value={contributionAmount}
          onChange={handleContributionChange}
          min="1"
          required
        />
        <button type="submit">Contribute</button>
      </form>
    </div>
  );
};

export default ProjectDetailsPage;
