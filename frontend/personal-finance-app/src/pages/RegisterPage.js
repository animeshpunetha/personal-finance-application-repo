// frontend/src/pages/RegisterPage.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  // State to hold the form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  // State to hold any error messages from the API
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Function to update state when user types in an input field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission which reloads the page
    setError(''); // Clear previous errors

    try {
      // The URL for our backend register endpoint
      const url = 'http://localhost:5000/api/users/register';
      const { data } = await axios.post(url, formData);

      // Save user info and token to local storage
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Redirect to the dashboard on successful registration
      navigate('/dashboard');
    } catch (err) {
      // If the API returns an error (e.g., user already exists)
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="flex justify-center items-center mt-16">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        
        {error && <p className="bg-red-500 text-white p-2 rounded mb-4 text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            required
            onChange={handleChange}
            value={formData.username}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
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
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Sign Up
        </button>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;