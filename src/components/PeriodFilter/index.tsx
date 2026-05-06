import React, { useState, useCallback } from 'react';

import {
    Container,
    DateInputGroup,
    Label,
    DateInput,
    FilterButton,
    ErrorMessage,
} from './styles';

interface PeriodFilterProps {
    onFilter: (startDate: string, endDate: string) => void;
}

function getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0];
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({ onFilter }) => {
    const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
    const [endDate, setEndDate] = useState<string>(getDefaultEndDate());
    const [error, setError] = useState<string>('');

    const handleFilter = useCallback(() => {
        if (startDate > endDate) {
            setError('Data início não pode ser posterior à data fim');
            return;
        }

        setError('');
        onFilter(startDate, endDate);
    }, [startDate, endDate, onFilter]);

    return (
        <Container>
            <DateInputGroup>
                <Label htmlFor="start-date">De:</Label>
                <DateInput
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />
            </DateInputGroup>

            <DateInputGroup>
                <Label htmlFor="end-date">Até:</Label>
                <DateInput
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                />
            </DateInputGroup>

            <FilterButton type="button" onClick={handleFilter}>
                Filtrar
            </FilterButton>

            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
    );
};

export default PeriodFilter;
