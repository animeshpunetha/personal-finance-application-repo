// useTransactions.js
// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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

  // --- API Abstraction ---
  const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) throw new Error('User not authenticated');
    return { headers: { Authorization: `Bearer ${userInfo.token}` } };
  };

  const fetchTransactions = useCallback(async (currentPage) => {
    setLoading(true);
    try {
      const config = { 
        ...getAuthHeaders(),
        params: { page: currentPage } 
      };
      const { data } = await axios.get('/api/transactions', config);
      setTransactions(data.transactions);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/categories', getAuthHeaders());
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(page);
  }, [page, fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- CRUD Operations ---
  const addTransaction = async (transactionData) => {
    await axios.post('/api/transactions', transactionData, getAuthHeaders());
    fetchTransactions(1); // Go back to first page to see the new item
  };
  
  const updateTransaction = async (id, transactionData) => {
    await axios.put(`/api/transactions/${id}`, transactionData, getAuthHeaders());
    fetchTransactions(page); // Refresh current page
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    await axios.delete(`/api/transactions/${id}`, getAuthHeaders());
    fetchTransactions(page); // Refresh current page
  };

  const addCategory = async (categoryData) => {
    const { data: newCategory } = await axios.post('/api/categories', categoryData, getAuthHeaders());
    await fetchCategories(); // Refresh category list
    return newCategory; // Return the new category to the form
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
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    refetchTransactions: () => fetchTransactions(page)
  };
};