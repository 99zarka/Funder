import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom'; // Import Link and useParams
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import API_BASE_URL from '../config';

const UserProfilePage = () => {
  const { id } = useParams(); // Get id from URL params
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // State to store current user's ID
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUserId(decodedToken.user_id); // Assuming user_id is in the token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const fetchUserProfile = async () => {
      const profileUrl = id ? `${API_BASE_URL}/users/profile/${id}/` : `${API_BASE_URL}/users/profile/`;
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(profileUrl, { headers });
        const data = await response.json();
        setUser(data);
        // Only reset form if it's the authenticated user's profile
        if (!id || parseInt(id) === currentUserId) {
          reset({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            mobilePhone: data.mobile_phone,
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [id, reset, currentUserId]); // Add id and currentUserId to dependency array

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <p className="text-xl">Loading user profile...</p>
      </div>
    );
  }

  // Determine if the current profile being viewed is the authenticated user's own profile
  const isOwnProfile = !id || (currentUserId && parseInt(id) === currentUserId);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">User Profile: {user.first_name} {user.last_name}</h1>

        {isOwnProfile && isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name:</label>
              <input
                type="text"
                {...register("firstName", { required: "First Name is required" })}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name:</label>
              <input
                type="text"
                {...register("lastName", { required: "Last Name is required" })}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email:</label>
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                readOnly
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Phone (Egyptian):</label>
              <input
                type="text"
                {...register("mobilePhone", {
                  required: "Mobile Phone is required",
                  pattern: {
                    value: /^01[0-2,5]{1}[0-9]{8}$/,
                    message: "Mobile phone number must be a valid Egyptian number (e.g., 01012345678)",
                  },
                })}
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.mobilePhone && <p className="text-red-500 text-sm mt-1">{errors.mobilePhone.message}</p>}
            </div>
            {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general.message}</p>}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition duration-300 font-semibold dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <p><strong className="text-gray-700 dark:text-gray-300">First Name:</strong> <span className="text-gray-900 dark:text-gray-100">{user.first_name}</span></p>
              <p><strong className="text-gray-700 dark:text-gray-300">Last Name:</strong> <span className="text-gray-900 dark:text-gray-100">{user.last_name}</span></p>
              <p><strong className="text-gray-700 dark:text-gray-300">Email:</strong> <span className="text-gray-900 dark:text-gray-100">{user.email}</span></p>
              <p><strong className="text-gray-700 dark:text-gray-300">Mobile Phone:</strong> <span className="text-gray-900 dark:text-gray-100">{user.mobile_phone}</span></p>
            </div>
            {isOwnProfile && (
              <div className="text-center mb-8">
                <button onClick={handleEditToggle} className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 font-semibold">
                  Edit Profile
                </button>
              </div>
            )}

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 border-b pb-2">My Created Projects</h2>
            {user.projects && user.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                      <Link to={`/projects/${project.id}`} className="hover:underline">{project.title}</Link>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-2">{project.details}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Target: <span className="font-semibold">${project.total_target}</span> | Raised: <span className="font-semibold text-green-600">${project.current_funding}</span></p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No projects created yet.</p>
            )}

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-8 mb-4 border-b pb-2">My Contributions</h2>
            {user.contributions && user.contributions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.contributions.map((contribution) => (
                  <div key={contribution.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                      Project: <Link to={`/projects/${contribution.project.id}`} className="hover:underline">{contribution.project.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Owner: <Link to={`/profile/${contribution.project.owner}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{contribution.project.owner_full_name}</Link></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount: <span className="font-semibold text-green-600">${contribution.amount}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date(contribution.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No contributions made yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
