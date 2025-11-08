import React from 'react';
import { useForm } from 'react-hook-form';
import API_BASE_URL from '../config';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const RegisterPage = () => {
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();
  const navigate = useNavigate(); // Initialize useNavigate

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
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
        } else if (result.username) { // Assuming username is also returned if it's the cause of the unique constraint
          setError("email", { type: "manual", message: result.username[0] });
        } else if (result.non_field_errors) {
          setError("general", { type: "manual", message: result.non_field_errors[0] });
        } else {
          // Fallback for any other unhandled errors
          setError("general", { type: "manual", message: "An unexpected error occurred during registration." });
        }
        console.error("Registration error:", result);
        return;
      }

      console.log("Registration successful:", result);
      navigate('/activate', { state: { email: data.email } }); // Redirect to activate page with email
    } catch (error) {
      console.error("Registration error:", error);
      // Show a generic error message if the fetch itself fails
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">Register</h1>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password:</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) => value === password || "Passwords do not match",
              })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
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
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Login here</Link>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
