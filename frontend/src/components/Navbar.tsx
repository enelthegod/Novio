import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/jobs" className="text-xl font-bold text-blue-600">
          Novio
        </Link>
        <div className="flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user?.name}</span>

              {/* Role badge */}
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                {user?.role}
              </span>

              {user?.role === 'Employer' && (
                <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
                  Dashboard
                </Link>
              )}
              {user?.role === 'Applicant' && (
                <Link to="/my-applications" className="text-sm text-blue-600 hover:underline">
                  My Applications
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}