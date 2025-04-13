import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface LeaveRequest {
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
}

const Leave = () => {
  const [newLeave, setNewLeave] = useState<LeaveRequest>({
    type: "",
    startDate: null,
    endDate: null,
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const leaveTypes = ["Sick", "Vacation", "Personal" ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLeave.type || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      toast.warning("Please fill out all fields.");
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in again.");
        setIsLoading(false); // Reset loading state
        return;
      }

      await axios.post(
        "http://localhost:5000/api/leaves/request",
        {
          type: newLeave.type,
          startDate: newLeave.startDate.toISOString().split("T")[0],
          endDate: newLeave.endDate.toISOString().split("T")[0],
          reason: newLeave.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Leave request submitted!");
      setNewLeave({ type: "", startDate: null, endDate: null, reason: "" });
    } catch (error: any) {
      console.error("❌ Error submitting leave:", error);
      const message =
        error.response?.data?.message || "Failed to submit leave request.";
      toast.error(message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-200 px-4 py-8">
      {/* ✅ Submit Leave Request */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          📝 Submit New Leave Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={newLeave.type}
            onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Leave Type
            </option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <DatePicker
              selected={newLeave.startDate}
              onChange={(date) => setNewLeave({ ...newLeave, startDate: date })}
              selectsStart
              startDate={newLeave.startDate}
              endDate={newLeave.endDate}
              minDate={new Date()}
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <DatePicker
              selected={newLeave.endDate}
              onChange={(date) => setNewLeave({ ...newLeave, endDate: date })}
              selectsEnd
              startDate={newLeave.startDate}
              endDate={newLeave.endDate}
              minDate={newLeave.startDate || new Date()}
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <textarea
            placeholder="Reason"
            className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newLeave.reason}
            onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
            rows={3}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit Leave"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Leave;
