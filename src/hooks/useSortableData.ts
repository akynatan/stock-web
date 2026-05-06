import { useState, useMemo } from 'react';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface UseSortableDataReturn<T> {
  sortedItems: T[];
  sortConfig: SortConfig | null;
  requestSort: (key: string) => void;
}

function useSortableData<T>(
  items: T[],
  defaultSort?: SortConfig,
): UseSortableDataReturn<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    defaultSort || null,
  );

  const sortedItems = useMemo(() => {
    if (!sortConfig) {
      return [...items];
    }

    const sorted = [...items].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortConfig.key];
      const bValue = (b as Record<string, unknown>)[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    setSortConfig(current => {
      if (current && current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  return { sortedItems, sortConfig, requestSort };
}

export default useSortableData;
