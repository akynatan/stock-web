import React from 'react';

import { SortConfig } from '../../hooks/useSortableData';

import { HeaderCell, HeaderContent, SortIndicator } from './styles';

interface SortableHeaderProps {
    label: string;
    sortKey: string;
    sortConfig: SortConfig | null;
    onSort: (key: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
    label,
    sortKey,
    sortConfig,
    onSort,
}) => {
    const getSortIndicator = (): string | null => {
        if (!sortConfig || sortConfig.key !== sortKey) {
            return null;
        }
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    const indicator = getSortIndicator();

    return (
        <HeaderCell onClick={() => onSort(sortKey)}>
            <HeaderContent>
                {label}
                {indicator && <SortIndicator>{indicator}</SortIndicator>}
            </HeaderContent>
        </HeaderCell>
    );
};

export default SortableHeader;
