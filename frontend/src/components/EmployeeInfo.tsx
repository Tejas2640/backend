import { useEffect, useState } from 'react';

import axios from 'axios';

interface Info {
  name: string;
  email: string;
  position: string;
  role: string;
  department: string;
  salary: number;
  joiningDate: string;
}

const EmployeeInfo = () => {
    
    const [info, setInfo] = useState<Info | null>(null);
  const token = localStorage.getItem('token');

  const fetchMyInfo = async () => {
    try {
      const { data } = await axios.get('https://eams-2-7uip.onrender.com/api/info/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfo(data);
    } catch (error) {
      console.error('Error fetching info:', error);
    }
  };

  useEffect(() => {
    fetchMyInfo();
  }, []);

  if (!info) return <div className="p-4">Loading your information...</div>;

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Information</h1>
      <div className="space-y-3">
        <div><strong>Name:</strong> {info.name}</div>
        <div><strong>Email:</strong> {info.email}</div>
        <div><strong>Position:</strong> {info.position}</div>
        <div><strong>Role:</strong> {info.role}</div>
        <div><strong>Department:</strong> {info.department}</div>
        <div><strong>Salary:</strong>  ₹{info.salary.toFixed(2)}</div>
        <div><strong>Joining Date:</strong> {new Date(info.joiningDate).toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
