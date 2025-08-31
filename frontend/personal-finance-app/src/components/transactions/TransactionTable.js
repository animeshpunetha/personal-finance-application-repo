import { Edit, Trash2, Tag, ClipboardX, Plus } from 'lucide-react';

const TransactionRow = ({ transaction, onEdit, onDelete, formatDate, formatCurrency }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-4 py-2 text-sm">{formatDate(transaction.date)}</td>
    <td className="px-4 py-2 text-sm font-medium">{transaction.description}</td>
    <td className="px-4 py-2 text-sm">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 rounded">
        <Tag className="w-3 h-3" /> {transaction.category?.name || 'Uncategorized'}
      </span>
    </td>
    <td className="px-4 py-2 text-sm">
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${
          transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {transaction.type}
      </span>
    </td>
    <td
      className={`px-4 py-2 text-sm font-semibold text-right ${
        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      }`}
    >
      {transaction.type === 'income' ? '+' : '-'}
      {formatCurrency(transaction.amount)}
    </td>
    <td className="px-4 py-2 text-sm text-center">
      <div className="flex justify-center gap-2">
        <button onClick={() => onEdit(transaction)} className="p-1 hover:text-blue-600">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(transaction._id)} className="p-1 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);

const TransactionTable = ({ transactions, onEdit, onDelete, openAddModal }) => {
  const formatCurrency = (amount) => `₹${Math.abs(amount).toLocaleString('en-IN')}`;
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs">
            <tr>
              {['Date', 'Description', 'Category', 'Type', 'Amount', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.length ? (
              transactions.map((t) => (
                <TransactionRow
                  key={t._id}
                  transaction={t}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  {...{ formatDate, formatCurrency }}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardX className="w-10 h-10 text-gray-300" />
                    <p>No Transactions</p>
                    <button
                      onClick={openAddModal}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" /> Add Transaction
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
