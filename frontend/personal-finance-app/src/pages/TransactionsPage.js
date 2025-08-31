// src/pages/TransactionsPage.js
import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';

// Import our new hook and components
import { useTransactions } from '../components/hooks/useTransactions';
import Pagination from '../components/common/Pagination';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
// import FilterBar from '../components/transactions/FilterBar';

const TransactionsPage = () => {
  const {
    transactions,
    loading,
    error,
    page,
    pages,
    setPage,
    refetchTransactions,
    addTransaction, // Added
    updateTransaction, // Added
    deleteTransaction, // Added
    categories, // Added
    addCategory // Added
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
      await addTransaction(transactionData);
    } else if (modalMode === 'edit' && currentTransaction) {
      await updateTransaction(currentTransaction._id, transactionData);
    }
    handleCloseModal();
  };

  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
    // The useTransactions hook already refetches after delete, so no need to refetch here
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

        {/* This would be your FilterBar component */}
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
          onAddCategory={addCategory}
        />

      </div>
    </div>
  );
};

export default TransactionsPage;