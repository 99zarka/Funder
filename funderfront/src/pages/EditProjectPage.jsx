import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    totalTarget: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setFormData({
          title: data.title,
          details: data.details,
          totalTarget: data.total_target,
          startDate: data.start_time.split('T')[0], // Assuming ISO format
          endDate: data.end_time.split('T')[0],     // Assuming ISO format
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
        method: 'PUT',
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
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      const data = await response.json();
      console.log('Project updated:', data);
      navigate('/my-projects'); // Redirect to my projects after update
    } catch (err) {
      setError(err.message);
      console.error('Error updating project:', err);
    }
  };

  if (loading) {
    return <div>Loading project for editing...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Edit Project</h1>
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
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
};

export default EditProjectPage;
