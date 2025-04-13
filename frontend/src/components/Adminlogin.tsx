import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { toast } from 'react-toastify';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AuthService.login({ email, password });
      localStorage.setItem('token', res.token);

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        toast.error('Only admins are allowed to log in here.');
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className=" fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-200 px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-600"> Admin Login</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none text-gray-700 p-3 mb-5 w-full rounded transition-shadow"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none text-gray-700 p-3 mb-6 w-full rounded transition-shadow"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 w-full font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
