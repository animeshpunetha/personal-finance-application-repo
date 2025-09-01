// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          // Check if token exists and is not expired
          if (parsedUser && parsedUser.token) {
            setUser(parsedUser);
          } else {
            // Token is missing or invalid, clear storage
            localStorage.removeItem('userInfo');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('userInfo');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData) => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Failed to save user data' };
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('userInfo');
      setUser(null);
      navigate('/');
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: 'Failed to logout' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null && user.token;
  };

  // Get user token
  const getToken = () => {
    return user?.token;
  };

  // Get user info
  const getUserInfo = () => {
    return user;
  };

  // Update user info
  const updateUserInfo = (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Error updating user info:', error);
      return { success: false, error: 'Failed to update user data' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getToken,
    getUserInfo,
    updateUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
