// components/users/UserManagement.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, UserCheck, Shield } from 'lucide-react';
import SearchBar from '../common/SearchBar';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@sajanshree.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15 10:30 AM'
    },
    {
      id: 2,
      name: 'Ramesh Kumar',
      email: 'ramesh@sajanshree.com',
      role: 'Order Manager',
      status: 'active',
      lastLogin: '2024-01-15 09:45 AM'
    },
    {
      id: 3,
      name: 'Priya Singh',
      email: 'priya@sajanshree.com',
      role: 'Inventory Manager',
      status: 'active',
      lastLogin: '2024-01-14 06:20 PM'
    },
    {
      id: 4,
      name: 'Suresh Patel',
      email: 'suresh@sajanshree.com',
      role: 'Production Staff',
      status: 'inactive',
      lastLogin: '2024-01-10 03:15 PM'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    if (role === 'Admin') return Shield;
    return UserCheck;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Link
          to="/users/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Link>
      </div>

      <SearchBar
        placeholder="Search users..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <div key={user.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <RoleIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                 <span className="text-sm text-gray-500">Role</span>
                 <span className="text-sm font-medium text-gray-900">{user.role}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-sm text-gray-500">Status</span>
                 <span className={`text-sm font-medium ${
                   user.status === 'active' ? 'text-green-600' : 'text-red-600'
                 }`}>
                   {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                 </span>
               </div>
               <div className="flex justify-between">
                 <span className="text-sm text-gray-500">Last Login</span>
                 <span className="text-sm text-gray-900">{user.lastLogin}</span>
               </div>
             </div>

             <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
               <Link
                 to={`/users/edit/${user.id}`}
                 className="text-blue-600 hover:text-blue-900"
               >
                 <Edit className="w-4 h-4" />
               </Link>
               <button className="text-red-600 hover:text-red-900">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
           </div>
         );
       })}
     </div>
   </div>
 );
};

export default UserManagement;