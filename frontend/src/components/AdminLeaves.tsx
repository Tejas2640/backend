import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface LeaveRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
}

const AdminLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
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
        const response = await axios.get("http://localhost:5000/api/leaves/", { headers });
        setLeaveRequests(response.data);
      } catch (error: any) {
        console.error("Error fetching leave requests:", error);
        setError(error.response?.data?.message || "Failed to load leave requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (leaveId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `http://localhost:5000/api/leaves/${leaveId}`,
        { status: newStatus },
        { headers }
      );

      const response = await axios.get("http://localhost:5000/api/leaves/", { headers });
      setLeaveRequests(response.data);
    } catch (error: any) {
      console.error("Error updating leave status:", error);
      setError(error.response?.data?.message || "Failed to update leave status.");
    }
  };

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
      
      <div className="flex space-x-4 mb-6">
        <Link 
          to="/admin/attendance" 
          className="bg-white text-black p-2 rounded hover:bg-blue-200 transition"
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
      {loading && <p className="text-gray-600 mb-4">Loading leave requests...</p>}

      {leaveRequests.length === 0 ? (
        <p className="text-gray-600">No leave requests found.</p>
      ) : (
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
         <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveRequests.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.userId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(leave.startDate).toLocaleDateString()} - 
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {leave.status === "pending" && (
                      <div className="space-x-2">
                        <button 
                          onClick={() => handleStatusUpdate(leave._id, "approved")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(leave._id, "rejected")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

export default AdminLeaves;
