// frontend/src/pages/LoginPage.js
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { EnhancedErrorHandler } from '../utils/errorHandler';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const url = 'http://localhost:5000/api/users/login';
      const { data } = await axios.post(url, formData);

      // Use the auth context to login
      const loginResult = login(data);
      if (loginResult.success) {
        // Redirect to the intended destination or dashboard
        navigate(from, { replace: true });
      } else {
        setError(loginResult.error || 'Failed to login');
      }
    } catch (err) {
      // Enhanced error handling
      const classifiedError = EnhancedErrorHandler.classifyError(err);
      
      // Handle network errors
      if (!err.response) {
        setError('Network error. Please check your internet connection.');
        return;
      }
      
      // Set user-friendly error message
      setError(classifiedError.userFriendlyMessage);
      
      // Log detailed error for debugging
      console.error('[Login] Error:', {
        status: classifiedError.status,
        message: classifiedError.message,
        type: classifiedError.type
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-16">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            onChange={handleChange}
            value={formData.email}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={handleChange}
            value={formData.password}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;