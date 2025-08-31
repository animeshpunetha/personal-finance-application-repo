// The modal for add/edit

// src/components/transactions/TransactionFormModal.js
import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';

// --- Reusable Sub-Components ---
const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
          </div>
          {children}
        </div>
      </div>
    );
};

const SegmentedControl = ({ value, onChange, options }) => (
    <div className="flex w-full bg-gray-100 p-1 rounded-lg">
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${ value === opt.value ? 'bg-white text-blue-600 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-200' }`}>{opt.label}</button>
      ))}
    </div>
);

// --- Main Modal Component ---
const TransactionFormModal = ({ show, onClose, onSave, categories, addCategory, initialData }) => {
  const ADD_NEW_CATEGORY_VALUE = 'ADD_NEW_CATEGORY';
  const initialFormState = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: '',
    type: 'expense'
  };

  const [formState, setFormState] = useState(initialFormState);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Effect to populate form for editing
  useEffect(() => {
    if (show && initialData) {
      setFormState({
        date: initialData.date.split('T')[0],
        description: initialData.description,
        category: initialData.category._id || initialData.category,
        amount: Math.abs(initialData.amount),
        type: initialData.type,
      });
    } else {
      setFormState(initialFormState);
    }
  }, [show, initialData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (type) => {
    setFormState(prev => ({...prev, type, category: ''}));
    setNewCategoryName('');
  };

  const handleSubmit = async () => {
    const isAddingNewCategory = formState.category === ADD_NEW_CATEGORY_VALUE;
    
    if (!formState.date || !formState.description || !formState.amount || (isAddingNewCategory ? !newCategoryName : !formState.category)) {
      alert('Please fill in all required fields.');
      return;
    }

    let categoryId = formState.category;
    if (isAddingNewCategory) {
      try {
        const newCategory = await addCategory({ name: newCategoryName, type: formState.type });
        categoryId = newCategory._id;
      } catch (err) {
        alert('Failed to create new category.');
        return;
      }
    }
    
    const finalTransactionData = {
      ...formState,
      category: categoryId,
      amount: parseFloat(formState.amount),
    };

    onSave(finalTransactionData); // Pass the final data up to the parent
  };

  return (
    <Modal show={show} onClose={onClose} title={initialData ? 'Edit Transaction' : 'Add New Transaction'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <SegmentedControl value={formState.type} onChange={handleTypeChange} options={[{label: 'Expense', value: 'expense'}, {label: 'Income', value: 'income'}]} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <div className="relative"><Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="date" name="date" value={formState.date} onChange={handleFormChange} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" required /></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="relative"><FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" name="description" placeholder="e.g., Groceries, Salary" value={formState.description} onChange={handleFormChange} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" required /></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="relative"><Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><select name="category" value={formState.category} onChange={handleFormChange} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" required>
              <option value="" disabled>Select a category</option>
              {categories.filter(c => c.type === formState.type).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              <option value={ADD_NEW_CATEGORY_VALUE} className="font-bold text-blue-600">+ Add new category</option>
            </select>
          </div>
        </div>
        
        {formState.category === ADD_NEW_CATEGORY_VALUE && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Category Name</label>
            <input 
              type="text" 
              placeholder="Enter name for the new category" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full" 
              required 
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div className="relative"><DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="number" name="amount" placeholder="0.00" step="0.01" min="0.01" value={formState.amount} onChange={handleFormChange} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" required /></div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={handleSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionFormModal;