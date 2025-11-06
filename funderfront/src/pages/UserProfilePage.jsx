import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobilePhone: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token'); // Assuming token is stored in localStorage
      if (!token) {
        // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
        setFormData({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          mobilePhone: data.mobile_phone,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          mobile_phone: formData.mobilePhone,
        }),
      });
      const data = await response.json();
      setUser(data);
      setIsEditing(false);
      console.log('Updated User Data:', data);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Mobile Phone (Egyptian):</label>
            <input type="text" name="mobilePhone" value={formData.mobilePhone} onChange={handleChange} pattern="^01[0-2,5]{1}[0-9]{8}$" title="Please enter a valid Egyptian phone number (e.g., 01012345678)" required />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>First Name:</strong> {user.first_name}</p>
          <p><strong>Last Name:</strong> {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile Phone:</strong> {user.mobile_phone}</p>
          <button onClick={handleEditToggle}>Edit Profile</button>

          <h2>My Created Projects</h2>
          {user.projects && user.projects.length > 0 ? (
            <ul>
              {user.projects.map((project) => (
                <li key={project.id}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p>Target: ${project.total_target} | Raised: ${project.current_funds}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects created yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
