import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';

/*
Uses a custom usePagination hook to calculate which page numbers 
to display, inserting "..." when there are too many pages to show 
all at once.

Renders a Previous button (disabled on the first page), clickable 
page numbers (highlighting the current page), and a Next button 
(disabled on the last page).

Calls the onPageChange function whenever a button is clicked, 
updating the currentPage so the data view changes accordingly
*/

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = usePagination({ currentPage, totalPages });
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center py-4">
      <div className="flex items-center gap-2">
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === '...' ? (
            <span key={index} className="px-3 text-gray-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border text-sm transition ${
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
