import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
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
        } else {
          setError("general", { type: "manual", message: "An unexpected error occurred during project creation." });
        }
        console.error('Error creating project:', result);
        return;
      }

      console.log('Project created:', result);
      navigate('/my-projects');
    } catch (error) {
      console.error('Error creating project:', error);
      setError("general", { type: "manual", message: "Network error or server unreachable." });
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        {errors.general && <p style={{ color: 'red' }}>{errors.general.message}</p>}
        <button type="submit">Create Project</button>
      </form>
      <p>
        <Link to="/my-projects">View My Projects</Link> or <Link to="/projects">View All Projects</Link>.
      </p>
    </div>
  );
};

export default CreateProjectPage;
