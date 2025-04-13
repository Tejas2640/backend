import  { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import { toast } from 'react-toastify';

interface Info {
  _id: string;
  user: string;
  name: string;
  email: string;
  position: string;
  role: string;
  department: string;
  salary: number;
  joiningDate: string;
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const AdminInfo = () => {
  const [infos, setInfos] = useState<Info[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('Admins only!');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.role === 'admin') {
        setIsAdmin(true);
        fetchInfos();
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Invalid token:', error);
      toast.error('Invalid token, please log in again.');
    }
  }, []);

  const fetchInfos = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching info:', error);
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/info/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deleted successfully!');
      fetchInfos();
    } catch (error) {
      console.error('Error deleting info:', error);
      toast.error('Failed to delete!');
    }
  };

  const handleIncrement = async (id: string, percentage: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/info/${id}/increment`,
        { percentage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Salary incremented by ${percentage}%`);
      fetchInfos();
    } catch (error) {
      console.error('Error incrementing salary:', error);
      toast.error('Failed to increment salary');
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-red-600 text-center font-semibold mt-10">
        Access Denied: Admins only
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 text-yellow-600 font-semibold">Loading...</div>;
  }

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Info Management</h1>

      <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Position</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Salary</th>
              <th className="p-2 border">Joining Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {infos.map((info) => (
              <tr key={info._id} className="text-center">
                <td className="p-2 border">{info.name}</td>
                <td className="p-2 border">{info.email}</td>
                <td className="p-2 border">{info.position}</td>
                <td className="p-2 border">{info.department}</td>
                <td className="p-2 border">{info.role}</td>
                <td className="p-2 border">₹{info.salary.toFixed(2)}</td>
                <td className="p-2 border">{new Date(info.joiningDate).toLocaleDateString()}</td>
                <td className="p-2 border space-y-1">
                  <button
                    onClick={() => handleDelete(info._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded w-full"
                  >
                    Delete
                  </button>
                  {[5, 10, 20, 40].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => handleIncrement(info._id, percent)}
                      className="bg-green-500 text-white px-2 py-1 rounded w-full mt-1"
                    >
                      +{percent}%
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInfo;
