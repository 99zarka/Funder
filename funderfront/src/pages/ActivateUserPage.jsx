import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';

const ActivateUserPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/activate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + " You can now log in.");
      } else {
        setError(data.error || 'Activation failed.');
      }
    } catch (err) {
      setError('Network error or server unreachable.');
      console.error('Activation error:', err);
    }
  };

  return (
    <div>
      <h1>Activate Your Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Activate</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message} <Link to="/login">Login here</Link>.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ActivateUserPage;