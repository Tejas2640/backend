import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.register({ name, email, password, role });
      toast.success("Registration successful!");
      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin-login');
      } else if (role === 'hr') {
        navigate('/admin-login');
      } else {
        navigate('/login'); // Redirect to employee list or home page
        
      }
    } catch (error) {
      console.error('Registration failed', error);
      toast.error("User already exists. Please check your credentials and try again.");
    }
  };

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Register</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded text-black"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded text-black"
        />
        <div className="mb-4">
          <label className="block mb-2 text-black">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded text-black"
          >
            <option value="employee" className="text-black">Employee</option>
            <option value="hr" className="text-black">HR</option>
            <option value="admin" className="text-black">Admin</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
};

export default Register;
