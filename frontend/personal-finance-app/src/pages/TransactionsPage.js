// src/pages/TransactionsPage.js
import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';

// Import our new hook and components
import { useTransactions } from '../components/hooks/useTransactions';
import Pagination from '../components/common/Pagination';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import DateRangeFilter from '../components/transactions/DateRangeFilter';
import { EnhancedErrorHandler } from '../utils/errorHandler';
import { useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
  const navigate = useNavigate();
  const {
    transactions, loading, error, page, pages, setPage, refetchTransactions,
    addTransaction, updateTransaction, deleteTransaction, categories, addCategory,
    dateFilter, applyDateFilter, clearDateFilter, clearError
  } = useTransactions();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentTransaction, setCurrentTransaction] = useState(null); // Transaction being edited

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      searchTerm ? t.description?.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );
  }, [transactions, searchTerm]);

  // Functions to handle modal operations
  const handleOpenModal = (mode, transaction = null) => {
    setModalMode(mode);
    setCurrentTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTransaction(null);
    setModalMode('add');
  };

  const handleSaveTransaction = async (transactionData) => {
    if (modalMode === 'add') {
      const result = await addTransaction(transactionData);
      if (result && result.success) {
        handleCloseModal();
      } else if (result && result.error && result.error.requiresAuth) {
        // Handle authentication errors
        EnhancedErrorHandler.handleAuthError(result.error.originalError, navigate);
      }
    } else if (modalMode === 'edit' && currentTransaction) {
      const result = await updateTransaction(currentTransaction._id, transactionData);
      if (result && result.success) {
        handleCloseModal();
      } else if (result && result.error && result.error.requiresAuth) {
        // Handle authentication errors
        EnhancedErrorHandler.handleAuthError(result.error.originalError, navigate);
      }
    }
  };

  const handleDeleteTransaction = async (id) => {
    const result = await deleteTransaction(id);
    if (result && result.success) {
      // Transaction deleted successfully
    } else if (result && result.error && result.error.requiresAuth) {
      // Handle authentication errors
      EnhancedErrorHandler.handleAuthError(result.error.originalError, navigate);
    }
  };

  const handleAddCategory = async (categoryData) => {
    const result = await addCategory(categoryData);
    if (result && result.success) {
      return result.data;
    } else if (result && result.error && result.error.requiresAuth) {
      // Handle authentication errors
      EnhancedErrorHandler.handleAuthError(result.error.originalError, navigate);
      return null;
    }
    return null;
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center p-6 text-red-600">{error} <button onClick={refetchTransactions} className="ml-2 text-blue-600">Try Again</button></div></div>;
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 text-black">
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <button onClick={() => handleOpenModal('add')} className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
            <Plus className="w-5 h-5" /> Add Transaction
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6">
          <DateRangeFilter
            onApplyFilter={(startDate, endDate) => applyDateFilter(startDate, endDate)}
            onClearFilter={() => clearDateFilter()}
            currentFilter={dateFilter}
          />
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by description on this page..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-red-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <TransactionTable 
          transactions={filteredTransactions} 
          onEdit={(transaction) => handleOpenModal('edit', transaction)} // Pass handleOpenModal for editing
          onDelete={handleDeleteTransaction} // Pass handleDeleteTransaction
          openAddModal={() => handleOpenModal('add')}
        />
        
        <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
        
        <TransactionFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode={modalMode}
          initialData={currentTransaction}
          onSubmit={handleSaveTransaction}
          categories={categories}
          onAddCategory={handleAddCategory}
        />

      </div>
    </div>
  );
};

export default TransactionsPage;