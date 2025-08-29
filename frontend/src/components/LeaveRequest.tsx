import { useEffect, useState } from "react";
import axios from "axios";

interface LeaveRecord {
  _id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const Profile = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);

      const res = await axios.get<LeaveRecord[]>("https://eams-2-7uip.onrender.com/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedLeaves = res.data.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setLeaves(sortedLeaves);
    } catch (err) {
      console.error("Error fetching leave history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-100 px-4 py-8">
      <h2 className="text-3xl font-semibold text-blue-700 mb-8">📝 My Leave History</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : leaves.length > 0 ? (
        <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-200 text-gray-800">
              <tr>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Start</th>
                <th className="py-2 px-4 text-left">End</th>
                <th className="py-2 px-4 text-left">Reason</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr
                  key={leave._id}
                  className={`border-b ${
                    leave.status === "approved"
                      ? "bg-green-50"
                      : leave.status === "rejected"
                      ? "bg-red-50"
                      : "bg-yellow-50"
                  }`}
                >
                  <td className="py-2 px-4 capitalize text-gray-800">{leave.type}</td>
                  <td className="py-2 px-4 text-gray-700">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-gray-700">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-gray-700">{leave.reason}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        leave.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : leave.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">You have no leave requests yet.</p>
      )}
    </div>
  );
};

export default Profile;
