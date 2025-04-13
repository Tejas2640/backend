import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { toast } from 'react-toastify';

interface LoginProps {
  onLogin: (id: string) => void;
  onLogout: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AuthService.login({ email, password });
      localStorage.setItem('token', res.token);
      // Check user role and navigate accordingly
      if (res.user.role === 'admin') {
        toast.error('Admin not allowed')
      } else {
        onLogin(res.user.id);
        navigate('/home'); // Redirect to employee dashboard
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Login</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border border-gray-300 p-2 mb-4 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;