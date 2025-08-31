// The table displaying transactions
// src/components/transactions/TransactionTable.js
import { Edit, Trash2, Tag, ClipboardX, Plus } from 'lucide-react';

// You can keep TransactionRow inside this file or move it out if you prefer
const TransactionRow = ({ transaction, onEdit, onDelete, formatDate, formatCurrency }) => (
    <tr className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(transaction.date)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.description}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Tag className="w-3 h-3"/>
          {transaction.category?.name || 'Uncategorized'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`capitalize inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${ transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}>{transaction.type}</span>
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${ transaction.amount > 0 ? 'text-green-600' : 'text-red-600' }`}>{transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
        <div className="flex items-center justify-center space-x-2">
          <button onClick={() => onEdit(transaction)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
          <button onClick={() => onDelete(transaction._id)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      </td>
    </tr>
);

const TransactionTable = ({ transactions, onEdit, onDelete, openAddModal }) => {
    const formatCurrency = (amount) => `₹${Math.abs(amount).toLocaleString('en-IN')}`;
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <TransactionRow key={t._id} transaction={t} onEdit={onEdit} onDelete={onDelete} {...{ formatDate, formatCurrency }} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-24 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <ClipboardX className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No Transactions Found</h3>
                        <p className="text-sm">Try adjusting your filters or add a new transaction.</p>
                        <button onClick={openAddModal} className="mt-4 bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200">
                          <Plus className="w-4 h-4" /> Add First Transaction
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    );
};

export default TransactionTable;