import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeHome from './components/EmployeeHome';
import Login from './components/Login';
import Register from './components/Register';
import Attendance from './components/Attendance';
import Leave from './components/Leave';
import AdminInfo from './components/AdminInfo';
import EmployeeInfo from './components/EmployeeInfo';
import './App.css';
import { ToastContainer } from 'react-toastify';
import AdminLogin from './components/Adminlogin';
import AdminAttendance from './components/AdminAttendance';
import AdminLeaves from './components/AdminLeaves';
import RootLayout from './layouts/layout';
import LeaveRequest from './components/LeaveRequest';
import AddInfo from './components/AddInfo';

function App() {
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/home" element={<EmployeeHome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addinfo" element={<AddInfo />} />
          <Route path="/admin/info" element={<AdminInfo />} />
          <Route path="/information" element={<EmployeeInfo />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/requests" element={<LeaveRequest />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/login" element={<Login onLogin={handleLogin} onLogout={handleLogout} />} />
          <Route path="/admin" element={<AdminAttendance />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/leaves" element={<AdminLeaves />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </RootLayout>
      <ToastContainer position="bottom-left" autoClose={1000} />
    </Router>
  );
}

export default App;
