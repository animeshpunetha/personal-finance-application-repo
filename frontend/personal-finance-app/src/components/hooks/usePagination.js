// The advanced pagination logic hook
// src/hooks/usePagination.js
import { useMemo } from 'react';

// This hook dynamically calculates which page numbers should be shown
//  in your pagination bar.Instead of always rendering every single page

export const usePagination = ({ totalPages, currentPage, siblings = 1 }) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblings * 2 + 3 + 2;
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblings;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblings;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
      return [1, '...', ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [1, '...', ...middleRange, '...', totalPages];
    }
  }, [totalPages, currentPage, siblings]);
  return paginationRange || [];
};