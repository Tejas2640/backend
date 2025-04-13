import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

const AddInfo = () => {
  const [formData, setFormData] = useState({
    user: '',
    name: '',
    email: '',
    position: '',
    role: '',
    department: '',
    salary: 10000,
    joiningDate: '',
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/info', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        user: '',
        name: '',
        email: '',
        position: '',
        role: '',
        department: '',
        salary: 10000,
        joiningDate: '',
      });
      toast.success('Info added successfully!');
    } catch (error) {
      console.error('Error adding info:', error);
      toast.error('Failed to add info!');
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
        Access Denied. Admins only.
      </div>
    );
  }

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-200 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Employee Info</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
        <input type="text" name="user" value={formData.user} onChange={handleChange} placeholder="User ID" className="border p-2 rounded" required />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
        <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" className="border p-2 rounded" required />
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" className="border p-2 rounded" required />
        <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="border p-2 rounded" required />
        <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" className="border p-2 rounded" required />
        <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="border p-2 rounded" required />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Info
        </button>
      </form>

      <ToastContainer position="bottom-left" autoClose={1000} />
    </div>
  );
};

export default AddInfo;
