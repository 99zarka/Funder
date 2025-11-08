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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">Create New Project</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title:</label>
            <input
              type="text"
              {...register("title", { required: "Project Title is required" })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Details:</label>
            <textarea
              {...register("details", { required: "Details are required" })}
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            ></textarea>
            {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Target Amount:</label>
            <input
              type="number"
              {...register("totalTarget", { required: "Total Target Amount is required", min: { value: 1, message: "Amount must be at least 1" } })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.totalTarget && <p className="text-red-500 text-sm mt-1">{errors.totalTarget.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date:</label>
            <input
              type="date"
              {...register("startDate", { required: "Start Date is required" })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date:</label>
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
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general.message}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Create Project
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          <Link to="/my-projects" className="text-indigo-600 dark:text-indigo-400 hover:underline">View My Projects</Link> or <Link to="/projects" className="text-indigo-600 dark:text-indigo-400 hover:underline">View All Projects</Link>.
        </p>
      </div>
    </div>
  );
};

export default CreateProjectPage;
