// src/pages/TransactionsPage.js
import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';

// Import our hook and new components
import { useTransactions } from '../components/hooks/useTransactions';
import Pagination from '../components/common/Pagination';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFormModal from '../components/transactions/TransactionFormModal'; // Import the new modal

const TransactionsPage = () => {
  // All data logic is still in our custom hook
  const {
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
    refetchTransactions
  } = useTransactions();

  // State for filters remains in the page component
  const [searchTerm, setSearchTerm] = useState('');
  
  // New state to manage the modal
  const [modalState, setModalState] = useState({ isOpen: false, data: null });

  // Client-side filtering for the current page's data
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      searchTerm ? t.description?.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );
  }, [transactions, searchTerm]);

  // --- Handlers for the Modal ---
  const handleOpenModal = (data = null) => {
    setModalState({ isOpen: true, data: data });
  };
  
  const handleCloseModal = () => {
    setModalState({ isOpen: false, data: null });
  };

  const handleSaveTransaction = async (formData) => {
    try {
      if (modalState.data) { // If there's data, we're editing
        await updateTransaction(modalState.data._id, formData);
      } else { // Otherwise, we're adding
        await addTransaction(formData);
      }
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save transaction');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center p-6 text-red-600">{error} <button onClick={refetchTransactions} className="ml-2 text-blue-600">Try Again</button></div></div>;
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
            <Plus className="w-5 h-5" /> Add Transaction
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by description on this page..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" 
            />
          </div>
        </div>

        <TransactionTable 
          transactions={filteredTransactions} 
          onEdit={handleOpenModal} 
          onDelete={deleteTransaction}
          openAddModal={() => handleOpenModal()}
        />
        
        <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
        
        <TransactionFormModal
          show={modalState.isOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTransaction}
          categories={categories}
          addCategory={addCategory}
          initialData={modalState.data}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;