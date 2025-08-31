// The modal for add/edit

// src/components/transactions/TransactionFormModal.js
import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, Upload, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { IndianRupee } from "lucide-react";


// --- Reusable Sub-Components ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute" onClick={(e) => e.stopPropagation()}>
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
const TransactionFormModal = ({ isOpen, onClose, onSubmit, categories, onAddCategory, initialData, mode }) => {
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, success, error

  // Effect to populate form for editing
  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      setFormState({
        date: initialData.date.split('T')[0],
        description: initialData.description,
        category: initialData.category._id || initialData.category,
        amount: Math.abs(initialData.amount),
        type: initialData.type,
      });
    } else if (isOpen && mode === 'add') {
      setFormState(initialFormState);
      setSelectedFile(null);
      setUploadStatus('idle');
    }
  }, [isOpen, initialData, mode]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (type) => {
    setFormState(prev => ({...prev, type, category: ''}));
    setNewCategoryName('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus('idle');
      // Automatically process the receipt when file is selected
      handleReceiptUpload(file);
    }
  };

  const handleReceiptUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('receiptImage', file);

      // Get user token from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('User not authenticated');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post('/api/upload/receipt', formData, config);
      
      if (response.data.parsedData) {
        setUploadStatus('success');
        // Auto-fill form with extracted data
        const parsedData = response.data.parsedData;
        const updatedFormState = { ...formState };
        
        if (parsedData.date) {
          updatedFormState.date = parsedData.date;
        }
        
        if (parsedData.description) {
          updatedFormState.description = parsedData.description;
        }
        
        if (parsedData.amount) {
          updatedFormState.amount = parsedData.amount.toString();
        }
        
        if (parsedData.type) {
          updatedFormState.type = parsedData.type;
        }
        
        // Try to find matching category
        if (parsedData.category) {
          const matchingCategory = categories.find(cat => 
            cat.type === updatedFormState.type && 
            cat.name.toLowerCase().includes(parsedData.category.toLowerCase())
          );
          if (matchingCategory) {
            updatedFormState.category = matchingCategory._id;
          }
        }
        
        setFormState(updatedFormState);
      } else {
        throw new Error('No data extracted from receipt');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
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
        const newCategory = await onAddCategory({ name: newCategoryName, type: formState.type });
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

    onSubmit(finalTransactionData); // Pass the final data up to the parent
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Transaction' : 'Add New Transaction'}>
      <div className="space-y-4">
        {/* Success notification when receipt data is applied */}
        {uploadStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Receipt data applied successfully! Review and adjust if needed.</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {uploadStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Failed to process receipt. Please try again or fill manually.</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <SegmentedControl value={formState.type} onChange={handleTypeChange} options={[{label: 'Expense', value: 'expense'}, {label: 'Income', value: 'income'}]} />
        </div>

        {/* Receipt Upload Field - Simple file input */}
        {mode === 'add' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Receipt (Optional)</label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileSelect}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm"
                disabled={isUploading}
              />
            </div>
            {isUploading && (
              <p className="text-xs text-blue-600 mt-1">Processing receipt...</p>
            )}
            {selectedFile && (
              <p className="text-xs text-gray-600 mt-1">Selected: {selectedFile.name}</p>
            )}
          </div>
        )}

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
          <div className="relative"><IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="number" name="amount" placeholder="0.00" step="0.01" min="0.01" value={formState.amount} onChange={handleFormChange} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" required /></div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={handleSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700">
            {mode === 'edit' ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionFormModal;