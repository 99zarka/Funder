import React from 'react';
import { useForm } from 'react-hook-form';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();

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
      // Redirect to login or show success message
    } catch (error) {
      console.error("Registration error:", error);
      // Show a generic error message if the fetch itself fails
    }
  };

  return (
    <div>
      <h1>Register</h1>
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
          <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must have at least 6 characters" } })} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default RegisterPage;
