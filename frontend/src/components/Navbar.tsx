import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserRole(parsedUser.role);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Error parsing user:', err);
        setUserRole(null);
        setIsLoggedIn(false);
      }
    } else {
      setUserRole(null);
      setIsLoggedIn(false);
    }
  }, [location.pathname]); // rerun on route change

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 px-6 py-4 shadow-lg w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold tracking-wide">EAMS</div>

        <ul className="flex flex-wrap space-x-4 md:space-x-6 items-center">
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-yellow-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-yellow-300">Register</Link>
              </li>
            </>
          )}

          {/* EMPLOYEE NAVBAR */}
          {isLoggedIn && userRole === 'employee' && (
            <>
              <li>
                <Link to="/home" className="text-white hover:text-yellow-300">Home</Link>
              </li>
              <li>
                <Link to="/attendance" className="text-white hover:text-yellow-300">Attendance</Link>
              </li>
              <li>
                <Link to="/leave" className="text-white hover:text-yellow-300">Leave</Link>
              </li>
            </>
          )}

          {/* ADMIN NAVBAR */}
          {isLoggedIn && userRole === 'admin' && (
            <>
              <li>
                <Link to="/admin/attendance" className="text-white hover:text-yellow-300">Attendance</Link>
              </li>
              <li>
                <Link to="/admin/leaves" className="text-white hover:text-yellow-300">Leaves</Link>
              </li>
              <li>
                <Link to="/addinfo" className="text-white hover:text-yellow-300">Add Info</Link>
              </li>
              <li>
                <Link to="/admin/info" className="text-white hover:text-yellow-300">All Info</Link>
              </li>
             
            </>
          )}

          {isLoggedIn && location.pathname !== '/register' && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
