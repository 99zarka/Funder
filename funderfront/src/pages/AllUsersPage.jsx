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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">All Users</h1>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-2/3 lg:w-1/2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                    <Link to={`/profile/${user.id}`} className="hover:underline">{user.first_name} {user.last_name}</Link>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email: <span className="text-gray-800 dark:text-gray-200">{user.email}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mobile: <span className="text-gray-800 dark:text-gray-200">{user.mobile_phone}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projects Created: <span className="font-semibold">{user.projects ? user.projects.length : 0}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contributions Made: <span className="font-semibold">{user.contributions ? user.contributions.length : 0}</span></p>
                </div>
                <Link
                  to={`/profile/${user.id}`}
                  className="mt-4 inline-block bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold"
                >
                  View Profile
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-xl text-gray-600 dark:text-gray-400 col-span-full">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
