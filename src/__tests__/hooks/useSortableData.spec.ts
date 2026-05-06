import { renderHook, act } from '@testing-library/react-hooks';
import useSortableData, { SortConfig } from '../../hooks/useSortableData';

interface TestItem {
  name: string;
  age: number;
  city: string;
}

const testItems: TestItem[] = [
  { name: 'Carlos', age: 30, city: 'São Paulo' },
  { name: 'Ana', age: 25, city: 'Rio de Janeiro' },
  { name: 'Bruno', age: 35, city: 'Belo Horizonte' },
];

describe('useSortableData', () => {
  it('should return items unsorted when no sortConfig is provided', () => {
    const { result } = renderHook(() => useSortableData(testItems));

    expect(result.current.sortedItems).toEqual(testItems);
    expect(result.current.sortConfig).toBeNull();
  });

  it('should sort items ascending by string key when requestSort is called', () => {
    const { result } = renderHook(() => useSortableData(testItems));

    act(() => {
      result.current.requestSort('name');
    });

    expect(result.current.sortedItems[0].name).toBe('Ana');
    expect(result.current.sortedItems[1].name).toBe('Bruno');
    expect(result.current.sortedItems[2].name).toBe('Carlos');
    expect(result.current.sortConfig).toEqual({ key: 'name', direction: 'asc' });
  });

  it('should toggle direction to desc when same column is sorted again', () => {
    const { result } = renderHook(() => useSortableData(testItems));

    act(() => {
      result.current.requestSort('name');
    });

    act(() => {
      result.current.requestSort('name');
    });

    expect(result.current.sortedItems[0].name).toBe('Carlos');
    expect(result.current.sortedItems[1].name).toBe('Bruno');
    expect(result.current.sortedItems[2].name).toBe('Ana');
    expect(result.current.sortConfig).toEqual({ key: 'name', direction: 'desc' });
  });

  it('should reset to asc when a different column is selected', () => {
    const { result } = renderHook(() => useSortableData(testItems));

    act(() => {
      result.current.requestSort('name');
    });

    act(() => {
      result.current.requestSort('name');
    });

    // Now sort by age (different column)
    act(() => {
      result.current.requestSort('age');
    });

    expect(result.current.sortConfig).toEqual({ key: 'age', direction: 'asc' });
    expect(result.current.sortedItems[0].age).toBe(25);
    expect(result.current.sortedItems[1].age).toBe(30);
    expect(result.current.sortedItems[2].age).toBe(35);
  });

  it('should sort numbers correctly', () => {
    const { result } = renderHook(() => useSortableData(testItems));

    act(() => {
      result.current.requestSort('age');
    });

    expect(result.current.sortedItems.map(i => i.age)).toEqual([25, 30, 35]);

    act(() => {
      result.current.requestSort('age');
    });

    expect(result.current.sortedItems.map(i => i.age)).toEqual([35, 30, 25]);
  });

  it('should accept a defaultSort config', () => {
    const defaultSort: SortConfig = { key: 'age', direction: 'desc' };
    const { result } = renderHook(() => useSortableData(testItems, defaultSort));

    expect(result.current.sortConfig).toEqual(defaultSort);
    expect(result.current.sortedItems[0].age).toBe(35);
    expect(result.current.sortedItems[1].age).toBe(30);
    expect(result.current.sortedItems[2].age).toBe(25);
  });

  it('should handle empty arrays', () => {
    const { result } = renderHook(() => useSortableData<TestItem>([]));

    act(() => {
      result.current.requestSort('name');
    });

    expect(result.current.sortedItems).toEqual([]);
  });

  it('should handle null values by placing them at the end', () => {
    const itemsWithNull = [
      { name: 'Carlos', value: 10 },
      { name: null, value: 5 },
      { name: 'Ana', value: 20 },
    ];

    const { result } = renderHook(() => useSortableData(itemsWithNull));

    act(() => {
      result.current.requestSort('name');
    });

    expect(result.current.sortedItems[2].name).toBeNull();
  });
});
