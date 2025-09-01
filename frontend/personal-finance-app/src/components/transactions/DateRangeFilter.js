// src/components/transactions/DateRangeFilter.js
import React, { useState } from 'react';
import { Calendar, X, Filter } from 'lucide-react';


/*
provides a UI for picking a start/end date range (manual inputs), 
shows any currently active filter, and offers quick presets 
(This Week / This Month / Last 30 / Last 90). It communicates 
selected ranges to a parent component through the onApplyFilter
(startDate, endDate) prop and asks the parent to clear filters 
via onClearFilter().
*/
const DateRangeFilter = ({ onApplyFilter, onClearFilter, currentFilter }) => {
  const [startDate, setStartDate] = useState(currentFilter.startDate || '');
  const [endDate, setEndDate] = useState(currentFilter.endDate || '');
  const [isExpanded, setIsExpanded] = useState(false);


  /*
If both startDate and endDate are present, it sends them 
as-is: onApplyFilter(startDate, endDate).

If only one is present (user provided single date), it treats 
that single date as both start and end — onApplyFilter(date, 
date). This lets the parent interpret a single-day filter.

After applying, it sets isExpanded to false to hide the form.
  */
  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onApplyFilter(startDate, endDate);
      setIsExpanded(false);
    } else if (startDate || endDate) {
      // If only one date is provided, use it for both start and end
      const date = startDate || endDate;
      onApplyFilter(date, date);
      setIsExpanded(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    onClearFilter();
    setIsExpanded(false);
  };

  const hasActiveFilter = currentFilter.startDate || currentFilter.endDate;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Date Range Filter</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'} Filter
        </button>
      </div>

      {/* Active Filter Display */}
      {hasActiveFilter && !isExpanded && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              {currentFilter.startDate && currentFilter.endDate ? (
                <>
                  {new Date(currentFilter.startDate).toLocaleDateString()} - {new Date(currentFilter.endDate).toLocaleDateString()}
                </>
              ) : (
                <>
                  {currentFilter.startDate && new Date(currentFilter.startDate).toLocaleDateString()}
                  {currentFilter.endDate && new Date(currentFilter.endDate).toLocaleDateString()}
                </>
              )}
            </span>
          </div>
          <button
            onClick={handleClearFilter}
            className="text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Form */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleApplyFilter}
              disabled={!startDate && !endDate}
              className="flex-1 bg-blue-600 text-gray-700 px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={handleClearFilter}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Quick Date Presets */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  onApplyFilter(startOfWeek.toISOString().split('T')[0], today.toISOString().split('T')[0]);
                  setIsExpanded(false);
                }}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                This Week
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                  onApplyFilter(startOfMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]);
                  setIsExpanded(false);
                }}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                This Month
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const thirtyDaysAgo = new Date(today);
                  thirtyDaysAgo.setDate(today.getDate() - 30);
                  onApplyFilter(thirtyDaysAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
                  setIsExpanded(false);
                }}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Last 30 Days
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const ninetyDaysAgo = new Date(today);
                  ninetyDaysAgo.setDate(today.getDate() - 90);
                  onApplyFilter(ninetyDaysAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
                  setIsExpanded(false);
                }}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Last 90 Days
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
