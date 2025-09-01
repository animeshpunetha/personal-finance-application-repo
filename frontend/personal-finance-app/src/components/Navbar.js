import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      console.error('Logout failed:', result.error);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Name */}
        <Link 
          to="/" 
          className="text-xl font-bold text-white hover:text-blue-300 transition-colors"
        >
          FinanceApp
        </Link>
        
        {/* Navigation Section */}
        <div className="flex items-center gap-6">
          {/* Navigation Links - Only show when authenticated */}
          {isAuthenticated() && (
            <div className="flex gap-6">
              <Link 
                to="/dashboard" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/transactions" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Transactions
              </Link>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user?.username || 'User'}</span>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
