import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Shield, Users } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to pull user records directories from server repositories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, targetRole) => {
    try {
      await axios.put(`http://localhost:3000/auth/users/${userId}/role`, { role: targetRole });
      
      // Instantly update local react states array tracking arrays so display changes dynamically
      setUsers(users.map(user => user.id === userId ? { ...user, role: targetRole } : user));
      alert('Operational tier level status modified successfully!');
    } catch (err) {
      alert('Error updating user authority credentials.');
    }
  };

  if (loading) return <p className="text-center text-slate-500 py-10 font-medium">Verifying user registers logs...</p>;
  if (error) return <p className="text-center text-red-500 font-bold py-10">{error}</p>;

  return (
    <div className="w-full max-w-[1000px] mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#2563EB]" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Corporate Directory Management Control</h2>
        </div>
        <span className="bg-[#2563EB] text-white px-4 py-1 rounded-full font-bold text-xs">
          {users.length} Enrolled Accounts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="p-4">User ID</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Authority Clearance</th>
              <th className="p-4 text-right">Reassign Privileges</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} className={`border-b border-slate-100 text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                <td className="p-4 font-bold text-slate-400">#{user.id}</td>
                <td className="p-4 font-semibold text-slate-800">{user.name}</td>
                <td className="p-4 font-medium text-slate-600">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                    user.role === 'admin' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    user.role === 'technician' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="p-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none bg-white shadow-sm focus:border-blue-500 cursor-pointer"
                  >
                    <option value="user">Standard User</option>
                    <option value="technician">Operations Technician</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
