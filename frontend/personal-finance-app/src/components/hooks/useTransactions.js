// useTransactions.js
// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { EnhancedErrorHandler, handleTransactionError, handleAuthError } from '../../utils/errorHandler';
import { useAuth } from '../../contexts/AuthContext';

export const useTransactions = () => {
  // Data State
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // UI & Loading State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination State (driven by the backend)
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Date Filter State
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Get auth context
  const { getToken, isAuthenticated } = useAuth();

  // --- API Abstraction ---
  const getAuthHeaders = () => {
    if (!isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    const token = getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTransactions = useCallback(async (currentPage, dateRange = null) => {
    setLoading(true);
    setError(''); // Clear previous errors

    /*
    // It Sends page number to the backend API
    // and Receives only current page data (data.transactions)
    //  Updates pagination state with current page and total pages
    */
    
    try {
      const params = { page: currentPage };
      
      // Add date filter parameters if provided
      if (dateRange) {
        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;
      } else if (dateFilter.startDate || dateFilter.endDate) {
        if (dateFilter.startDate) params.startDate = dateFilter.startDate;
        if (dateFilter.endDate) params.endDate = dateFilter.endDate;
      }

      const config = { 
        ...getAuthHeaders(),
        params 
      };
      const { data } = await axios.get('/api/transactions', config);
      setTransactions(data.transactions);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      // Enhanced error handling
      const classifiedError = EnhancedErrorHandler.classifyError(err);
      
      // Handle authentication errors
      if (classifiedError.requiresAuth) {
        setError('Your session has expired. Please login again.');
        // Note: Navigation should be handled by the component using this hook
        return;
      }
      
      // Handle network errors
      if (!err.response) {
        setError('Network error. Please check your internet connection.');
        return;
      }
      
      // Set user-friendly error message
      setError(classifiedError.userFriendlyMessage);
      
      // Log detailed error for debugging
      console.error('[Transactions] Fetch error:', {
        status: classifiedError.status,
        message: classifiedError.message,
        type: classifiedError.type
      });
    } finally {
      setLoading(false);
    }
  }, [dateFilter, isAuthenticated, getToken]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/categories', getAuthHeaders());
      setCategories(data);
    } catch (err) {
      // Enhanced error handling for categories
      const classifiedError = EnhancedErrorHandler.classifyError(err);
      
      if (classifiedError.requiresAuth) {
        console.error('[Categories] Authentication error:', classifiedError.message);
        return;
      }
      
      console.error('[Categories] Fetch error:', {
        status: classifiedError.status,
        message: classifiedError.message,
        type: classifiedError.type
      });
      
      // Show toast for category errors
      EnhancedErrorHandler.handleError(err, {
        context: 'Categories',
        fallbackMessage: 'Failed to fetch categories'
      });
    }
  }, [isAuthenticated, getToken]);

  useEffect(() => {
    fetchTransactions(page);
  }, [page, fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- CRUD Operations ---
  const addTransaction = async (transactionData) => {
    try {
      await axios.post('/api/transactions', transactionData, getAuthHeaders());
      await fetchTransactions(1); // Go back to first page to see the new item
      return { success: true };
    } catch (err) {
      const result = handleTransactionError(err);
      return { success: false, error: result };
    }
  };
  
  const updateTransaction = async (id, transactionData) => {
    try {
      await axios.put(`/api/transactions/${id}`, transactionData, getAuthHeaders());
      await fetchTransactions(page); // Refresh current page
      return { success: true };
    } catch (err) {
      const result = handleTransactionError(err);
      return { success: false, error: result };
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return { success: false, cancelled: true };
    }
    
    try {
      await axios.delete(`/api/transactions/${id}`, getAuthHeaders());
      await fetchTransactions(page); // Refresh current page
      return { success: true };
    } catch (err) {
      const result = handleTransactionError(err);
      return { success: false, error: result };
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const { data: newCategory } = await axios.post('/api/categories', categoryData, getAuthHeaders());
      await fetchCategories(); // Refresh category list
      return { success: true, data: newCategory };
    } catch (err) {
      const result = EnhancedErrorHandler.handleError(err, {
        context: 'Category',
        fallbackMessage: 'Failed to create category'
      });
      return { success: false, error: result };
    }
  };

  // Date filter functions
  const applyDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    setPage(1); // Reset to first page when applying filter
    fetchTransactions(1, { startDate, endDate });
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
    setPage(1); // Reset to first page when clearing filter
    fetchTransactions(1, { startDate: '', endDate: '' });
  };

  // Clear error function
  const clearError = () => {
    setError('');
  };

  // Expose state and functions to the component
  return {
    transactions,
    categories,
    loading,
    error,
    page,
    pages,
    setPage,
    dateFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    applyDateFilter,
    clearDateFilter,
    clearError,
    refetchTransactions: () => fetchTransactions(page)
  };
};