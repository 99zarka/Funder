import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/all/`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>All Users</h1>
      <div>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div>
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h2><Link to={`/profile/${user.id}`}>{user.first_name} {user.last_name}</Link></h2>
                <p>Email: {user.email}</p>
                <p>Mobile: {user.mobile_phone}</p>
                <p>Projects Created: {user.projects ? user.projects.length : 0}</p>
                <p>Contributions Made: {user.contributions ? user.contributions.length : 0}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
