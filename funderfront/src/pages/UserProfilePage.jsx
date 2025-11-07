import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API_BASE_URL from '../config';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
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
        reset({
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
  }, [reset]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data) => {
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
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          mobile_phone: data.mobilePhone,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.mobile_phone) {
          setError("mobilePhone", { type: "manual", message: result.mobile_phone[0] });
        }
        if (result.email) {
          setError("email", { type: "manual", message: result.email[0] });
        } else if (result.non_field_errors) {
          setError("general", { type: "manual", message: result.non_field_errors[0] });
        } else {
          setError("general", { type: "manual", message: "An unexpected error occurred during profile update." });
        }
        console.error('Error updating user profile:', result);
        return;
      }

      setUser(result);
      setIsEditing(false);
      console.log('Updated User Data:', result);
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError("general", { type: "manual", message: "Network error or server unreachable." });
    }
  };

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>First Name:</label>
            <input type="text" {...register("firstName", { required: "First Name is required" })} />
            {errors.firstName && <p>{errors.firstName.message}</p>}
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" {...register("lastName", { required: "Last Name is required" })} />
            {errors.lastName && <p>{errors.lastName.message}</p>}
          </div>
          <div>
            <label>Email:</label>
            <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })} readOnly />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div>
            <label>Mobile Phone (Egyptian):</label>
            <input
              type="text"
              {...register("mobilePhone", {
                required: "Mobile Phone is required",
                pattern: {
                  value: /^01[0-2,5]{1}[0-9]{8}$/,
                  message: "Mobile phone number must be a valid Egyptian number (e.g., 01012345678)",
                },
              })}
            />
            {errors.mobilePhone && <p>{errors.mobilePhone.message}</p>}
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
                  <p>{project.details}</p>
                  <p>Target: ${project.total_target} | Raised: ${project.current_funding}</p>
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
