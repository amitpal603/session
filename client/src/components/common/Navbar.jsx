import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthoContext';

const Navbar = () => {
  const { user, logout } = useAuth();
 console.log(user)
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Session Auth App
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span>Welcome {user.username.charAt(0).toUpperCase()}</span>
                <Link
                  to="/profile"
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;