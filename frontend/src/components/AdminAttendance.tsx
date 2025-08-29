import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface AttendanceRecord {
  _id: string;
  userId: {
    _id: string;
    name: string;
  } | null;
  date: string;
  clockIn?: string;
  clockOut?: string;
}

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("https://eams-2-7uip.onrender.com/api/attendance", { headers });
        setAttendanceData(response.data);
      } catch (error: any) {
        console.error("Error fetching attendance data:", error);
        toast.error(error.response?.data?.message || "Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
      <div className="flex space-x-4 mb-6">
        <Link 
          to="/admin/attendance" 
          className="bg-white text-black p-2 rounded hover:bg-blue-200"
        >
          Attendance
        </Link>
        <Link 
          to="/admin/leaves"
          className="bg-white text-black p-2 rounded hover:bg-blue-200 transition"
        >
          Leave Requests
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Loading attendance data...</p>}

      {attendanceData.length === 0 ? (
        <p className="text-gray-600">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.userId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    record.clockIn ? 'text-gray-500' : 'text-red-500'
                  }`}>
                    {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : "Not clocked in"}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    record.clockOut ? 'text-gray-500' : 'text-red-500'
                  }`}>
                    {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : "Not clocked out"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
