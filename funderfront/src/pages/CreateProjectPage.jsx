import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import API_BASE_URL from '../config';

const CreateProjectPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    totalTarget: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Redirect to login or show error
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          details: formData.details,
          total_target: formData.totalTarget,
          start_time: formData.startDate,
          end_time: formData.endDate,
        }),
      });
      const data = await response.json();
      console.log('Project created:', data);
      navigate('/my-projects'); // Redirect to my projects after creation
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Details:</label>
          <textarea name="details" value={formData.details} onChange={handleChange} required></textarea>
        </div>
        <div>
          <label>Total Target Amount:</label>
          <input type="number" name="totalTarget" value={formData.totalTarget} onChange={handleChange} required min="1" />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProjectPage;
