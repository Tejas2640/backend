import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AttendanceRecord {
  _id: string;
  userId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
}

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [latestRecordId, setLatestRecordId] = useState<string | null>(null);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser._id || storedUser.id;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        if (!userId) {
          setError("User ID not found, please log in again.");
          return;
        }

        const response = await axios.get(
          `https://eams-2-7uip.onrender.com/api/attendance/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("📥 Fetching attendance response:", response.data);
        setAttendanceData(response.data);

        const today = new Date().toISOString().split("T")[0];
        const todayRecord = response.data.find(
          (record: AttendanceRecord) => record.date.split("T")[0] === today && record.clockIn
        );

        if (todayRecord) {
          setIsClockedIn(true);
          setLatestRecordId(todayRecord._id);
        }
      } catch (error: any) {
        console.error("❌ Error fetching attendance:", error);
        toast.error(error.response?.data?.message || "Failed to load attendance records.");
      }
    };

    fetchAttendance();
  }, [userId]);

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://eams-2-7uip.onrender.com/api/attendance/clock-in",
        {}, // No need to send userId (handled in backend)
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Clocked in:", response.data);
      toast.success("Successfully clocked in!");

      if (response.data && response.data.data) {
        setAttendanceData((prev) => [...prev, response.data.data]);
        setIsClockedIn(true);
        setLatestRecordId(response.data.data._id);
      }
    } catch (error: any) {
      console.error("❌ Clock-In Error:", error);
      toast.error(error.response?.data?.message || "Clock-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!latestRecordId) {
      setError("No valid attendance record found for today.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://eams-2-7uip.onrender.com/api/attendance/clock-out",
        {}, // No need to send userId (handled in backend)
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Clocked out:", response.data);
      toast.success("Successfully clocked out!");

      if (response.data && response.data.data) {
        setAttendanceData((prev) =>
          prev.map((record) =>
            record._id === latestRecordId
              ? { ...record, clockOut: response.data.data.clockOut }
              : record
          )
        );
        setIsClockedIn(false);
        setLatestRecordId(null);
      }
    } catch (error: any) {
      console.error("❌ Clock-Out Error:", error);
      toast.error(error.response?.data?.message || "Clock-out failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-200 px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Attendance Records</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-4 mb-8">
        <button 
          onClick={handleClockIn} 
          disabled={loading || isClockedIn}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${isClockedIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'} ${loading ? 'animate-pulse' : ''}`}
        >
          {loading ? "Processing..." : "Clock In"}
        </button>

        <button 
          onClick={handleClockOut} 
          disabled={loading || !isClockedIn}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${!isClockedIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'} ${loading ? 'animate-pulse' : ''}`}
        >
          {loading ? "Processing..." : "Clock Out"}
        </button>
      </div>

      {attendanceData.length === 0 ? (
        <p className="text-gray-600">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
          
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((record: AttendanceRecord) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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

export default Attendance;
