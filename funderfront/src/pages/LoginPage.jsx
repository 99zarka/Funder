import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const LoginPage = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.non_field_errors) {
          setError("general", { type: "manual", message: result.non_field_errors[0] });
        } else if (result.email) {
          setError("email", { type: "manual", message: result.email[0] });
        } else if (result.password) {
          setError("password", { type: "manual", message: result.password[0] });
        } else {
          setError("general", { type: "manual", message: "An unexpected error occurred during login." });
        }
        console.error("Login error:", result);
        return;
      }

      console.log("Login successful:", result);
      localStorage.setItem('access_token', result.access);
      localStorage.setItem('refresh_token', result.refresh);
      navigate('/profile');
    } catch (error) {
      console.error("Login error:", error);
      setError("general", { type: "manual", message: "Network error or server unreachable." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email:</label>
            <input
              type="email"
              {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password:</label>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must have at least 6 characters" } })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general.message}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">Register here</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
