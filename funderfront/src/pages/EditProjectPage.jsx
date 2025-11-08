import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API_BASE_URL from '../config';
import { jwtDecode } from 'jwt-decode';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset, setError, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      let currentUserId = null;
      try {
        const decodedToken = jwtDecode(token);
        currentUserId = decodedToken.user_id;
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        navigate('/login'); // Redirect if token is invalid
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          // If project not found or other error during fetch, redirect to dashboard
          navigate('/projects');
          return;
        }
        const data = await response.json();

        // Check if the current user is the owner of the project
        // Assuming data.owner is directly the owner's ID (an integer)
        // currentUserId is a string, so convert it to an integer for comparison
        if (data.owner !== parseInt(currentUserId)) {
          navigate(`/projects/${id}`); // Redirect to project details if not owner
          return;
        }

        reset({
          title: data.title,
          details: data.details,
          totalTarget: data.total_target,
          startDate: data.start_time.split('T')[0],
          endDate: data.end_time.split('T')[0],
        });
      } catch (err) {
        setGeneralError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate, reset, setGeneralError]);

  const onSubmit = async (data) => {
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
          title: data.title,
          details: data.details,
          total_target: data.totalTarget,
          start_time: data.startDate,
          end_time: data.endDate,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.title) {
          setError("title", { type: "manual", message: result.title[0] });
        }
        if (result.details) {
          setError("details", { type: "manual", message: result.details[0] });
        }
        if (result.total_target) {
          setError("totalTarget", { type: "manual", message: result.total_target[0] });
        }
        if (result.start_time) {
          setError("startDate", { type: "manual", message: result.start_time[0] });
        }
        if (result.end_time) {
          setError("endDate", { type: "manual", message: result.end_time[0] });
        }
        if (result.non_field_errors) {
          setError("general", { type: "manual", message: result.non_field_errors[0] });
        } else if (result.detail) { // Handle the permission denied error specifically
          setError("general", { type: "manual", message: result.detail });
        }
        else {
          setError("general", { type: "manual", message: "An unexpected error occurred during project update." });
        }
        console.error('Error updating project:', result);
        return;
      }

      console.log('Project updated:', result);
      navigate('/my-projects');
    } catch (err) {
      setError("general", { type: "manual", message: "Network error or server unreachable." });
      console.error('Error updating project:', err);
    }
  };

  if (loading) {
    return <div>Loading project for editing...</div>;
  }

  if (generalError) {
    return <div>Error: {generalError}</div>;
  }

  return (
    <div>
      <h1>Edit Project</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.general && <p style={{ color: 'red' }}>{errors.general.message}</p>}
        <div>
          <label>Project Title:</label>
          <input type="text" {...register("title", { required: "Project Title is required" })} />
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        <div>
          <label>Details:</label>
          <textarea {...register("details", { required: "Details are required" })}></textarea>
          {errors.details && <p>{errors.details.message}</p>}
        </div>
        <div>
          <label>Total Target Amount:</label>
          <input type="number" {...register("totalTarget", { required: "Total Target Amount is required", min: { value: 1, message: "Amount must be at least 1" } })} />
          {errors.totalTarget && <p>{errors.totalTarget.message}</p>}
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" {...register("startDate", { required: "Start Date is required" })} />
          {errors.startDate && <p>{errors.startDate.message}</p>}
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            {...register("endDate", {
              required: "End Date is required",
              validate: (value) => {
                const startDate = new Date(watch('startDate'));
                const endDate = new Date(value);
                return endDate >= startDate || "End Date cannot be before Start Date";
              },
            })}
          />
          {errors.endDate && <p>{errors.endDate.message}</p>}
        </div>
        <button type="submit">Update Project</button>
      </form>
      <p>
        <Link to={`/projects/${id}`}>View Project Details</Link> | <Link to="/my-projects">Back to My Projects</Link>
      </p>
    </div>
  );
};

export default EditProjectPage;
