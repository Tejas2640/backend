import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AttendanceRecord {
  _id: string;
  userId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  employeeName?: string;
}

interface LeaveRequest {
  _id: string;
  userId: string;
  type: string;
  reason: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

const Admin = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const attendanceResponse = await axios.get("http://localhost:5000/api/attendance?populate=user", { headers });
        const attendanceWithNames = attendanceResponse.data.map((record: any) => ({
          _id: record._id,
          userId: record.userId,
          date: record.date,
          clockIn: record.clockIn,
          clockOut: record.clockOut,
          employeeName: record.user?.name || `User ${record.userId}`
        }));
        setAttendanceData(attendanceWithNames);

        const leaveResponse = await axios.get("http://localhost:5000/api/leaves", { headers });
        setLeaveRequests(leaveResponse.data);

      } catch (error: any) {
        console.error("❌ Error fetching data:", error);
        toast.error(error.response?.data?.message || "Failed to load data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-200 px-4 py-8">
      <h2 className="text-4xl font-bold text-blue-800 mb-8">Admin Dashboard</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Attendance Records</h3>
        {attendanceData.length === 0 ? (
          <p className="text-gray-600">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 rounded">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-blue-800">Employee Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-blue-800">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-blue-800">Clock In</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-blue-800">Clock Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{record.employeeName}</td>
                    <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : "—"}</td>
                    <td className="px-4 py-2">{record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leave Requests */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Leave Requests</h3>
        {leaveRequests.length === 0 ? (
          <p className="text-gray-600">No leave requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveRequests.map((leave) => (
              <div key={leave._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition">
                <p className="font-semibold text-gray-700">{leave.type}</p>
                <p className="text-gray-600 text-sm mt-1">{leave.reason}</p>
                {leave.startDate && leave.endDate && (
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                )}
                <p className={`text-sm mt-1 font-medium ${
                  leave.status === "approved"
                    ? "text-green-600"
                    : leave.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>
                  Status: {leave.status || "Pending"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
