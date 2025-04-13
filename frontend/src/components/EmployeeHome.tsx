import { useNavigate } from "react-router-dom";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userDetails = {
    name: user?.name || 'Not available',
    email: user?.email || 'Not available',
  };

  return (
    <div className="fixed top-16 flex flex-col items-center min-h-screen w-full bg-gray-200 px-4 py-8">
      <div className="bg-blue-200 p-8 rounded-2xl shadow-lg mb-10">
        <h1 className="text-2xl font-semibold !text-black mb-2">Welcome {userDetails.name}</h1>
        <p className="text-gray-600 text-lg">
          Email: <span className="font-medium text-gray-800">{userDetails.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div 
          onClick={() => navigate("/attendance")}
          className="bg-blue-100 hover:bg-blue-200 transition rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="text-blue-600 text-3xl">⏱</span>
            <h2 className="text-xl font-semibold text-blue-900">Attendance</h2>
          </div>
          <p className="mt-2 text-sm text-blue-800">View and manage your attendance records</p>
        </div>

        {/* Leaves Card */}
        <div 
          onClick={() => navigate("/leave")}
          className="bg-green-100 hover:bg-green-200 transition rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="text-green-600 text-3xl">📅</span>
            <h2 className="text-xl font-semibold text-green-900">Leave Management</h2>
          </div>
          <p className="mt-2 text-sm text-green-800">Request and track your leaves</p>
        </div>

        {/* My Leave Requests Card (replaces My Profile) */}
        <div 
          onClick={() => navigate("/requests")}
          className="bg-purple-100 hover:bg-purple-200 transition rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="text-purple-600 text-3xl">🧾</span>
            <h2 className="text-xl font-semibold text-purple-900">My Leave Requests</h2>
          </div>
          <p className="mt-2 text-sm text-purple-800">View your submitted leave history</p>
        </div>
        {/* My Leave Requests Card (replaces My Profile) */}
        <div 
          onClick={() => navigate("/information")}
          className="bg-purple-100 hover:bg-purple-200 transition rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="text-purple-600 text-3xl">🧾</span>
            <h2 className="text-xl font-semibold text-purple-900">My Information</h2>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
