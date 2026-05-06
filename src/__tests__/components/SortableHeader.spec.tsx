import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SortableHeader from '../../components/SortableHeader';
import { SortConfig } from '../../hooks/useSortableData';

describe('SortableHeader Component', () => {
    it('should render the label text', () => {
        const { getByText } = render(
            <table>
                <thead>
                    <tr>
                        <SortableHeader
                            label="Produto"
                            sortKey="product_name"
                            sortConfig={null}
                            onSort={jest.fn()}
                        />
                    </tr>
                </thead>
            </table>,
        );

        expect(getByText('Produto')).toBeTruthy();
    });

    it('should show ▲ when sorted ascending on this column', () => {
        const sortConfig: SortConfig = { key: 'product_name', direction: 'asc' };

        const { getByText } = render(
            <table>
                <thead>
                    <tr>
                        <SortableHeader
                            label="Produto"
                            sortKey="product_name"
                            sortConfig={sortConfig}
                            onSort={jest.fn()}
                        />
                    </tr>
                </thead>
            </table>,
        );

        expect(getByText('▲')).toBeTruthy();
    });

    it('should show ▼ when sorted descending on this column', () => {
        const sortConfig: SortConfig = { key: 'product_name', direction: 'desc' };

        const { getByText } = render(
            <table>
                <thead>
                    <tr>
                        <SortableHeader
                            label="Produto"
                            sortKey="product_name"
                            sortConfig={sortConfig}
                            onSort={jest.fn()}
                        />
                    </tr>
                </thead>
            </table>,
        );

        expect(getByText('▼')).toBeTruthy();
    });

    it('should not show sort indicator when sorted by a different column', () => {
        const sortConfig: SortConfig = { key: 'other_column', direction: 'asc' };

        const { queryByText } = render(
            <table>
                <thead>
                    <tr>
                        <SortableHeader
                            label="Produto"
                            sortKey="product_name"
                            sortConfig={sortConfig}
                            onSort={jest.fn()}
                        />
                    </tr>
                </thead>
            </table>,
        );

        expect(queryByText('▲')).toBeNull();
        expect(queryByText('▼')).toBeNull();
    });

    it('should not show sort indicator when sortConfig is null', () => {
        const { queryByText } = render(
            <table>
                <thead>
                    <tr>
                        <SortableHeader
                            label="Produto"
                            sortKey="product_name"
                            sortConfig={null}
                            onSort={jest.fn()}
                        />
                    </tr>
                </thead>
            </table>,
        );

        expect(queryByText('▲')).toBeNull();
        expect(queryByText('▼')).toBeNull();
    });

    it('should call onSort with sortKey when clicked', () => {
        const onSort = jest.fn();

        const { getByText } = render(
            <table>
                <thead>
                    <tr>
                        <SortableHeader
                            label="Produto"
                            sortKey="product_name"
                            sortConfig={null}
                            onSort={onSort}
                        />
                    </tr>
                </thead>
            </table>,
        );

        fireEvent.click(getByText('Produto'));

        expect(onSort).toHaveBeenCalledWith('product_name');
        expect(onSort).toHaveBeenCalledTimes(1);
    });
});
