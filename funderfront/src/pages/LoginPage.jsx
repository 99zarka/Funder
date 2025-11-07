import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must have at least 6 characters" } })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {errors.general && <p style={{ color: 'red' }}>{errors.general.message}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
