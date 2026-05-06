import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PeriodFilter from '../../components/PeriodFilter';

describe('PeriodFilter Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-31'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render start and end date inputs', () => {
        const { getByLabelText } = render(
            <PeriodFilter onFilter={jest.fn()} />,
        );

        expect(getByLabelText('De:')).toBeTruthy();
        expect(getByLabelText('Até:')).toBeTruthy();
    });

    it('should render with default period of last 30 days', () => {
        const { getByLabelText } = render(
            <PeriodFilter onFilter={jest.fn()} />,
        );

        const startInput = getByLabelText('De:') as HTMLInputElement;
        const endInput = getByLabelText('Até:') as HTMLInputElement;

        expect(startInput.value).toBe('2024-01-01');
        expect(endInput.value).toBe('2024-01-31');
    });

    it('should render a "Filtrar" button', () => {
        const { getByText } = render(
            <PeriodFilter onFilter={jest.fn()} />,
        );

        expect(getByText('Filtrar')).toBeTruthy();
    });

    it('should call onFilter with start and end dates when button is clicked', () => {
        const onFilter = jest.fn();
        const { getByText } = render(
            <PeriodFilter onFilter={onFilter} />,
        );

        fireEvent.click(getByText('Filtrar'));

        expect(onFilter).toHaveBeenCalledWith('2024-01-01', '2024-01-31');
        expect(onFilter).toHaveBeenCalledTimes(1);
    });

    it('should call onFilter with updated dates after user changes inputs', () => {
        const onFilter = jest.fn();
        const { getByLabelText, getByText } = render(
            <PeriodFilter onFilter={onFilter} />,
        );

        fireEvent.change(getByLabelText('De:'), {
            target: { value: '2024-01-10' },
        });
        fireEvent.change(getByLabelText('Até:'), {
            target: { value: '2024-01-20' },
        });
        fireEvent.click(getByText('Filtrar'));

        expect(onFilter).toHaveBeenCalledWith('2024-01-10', '2024-01-20');
    });

    it('should show error message when start date is after end date', () => {
        const onFilter = jest.fn();
        const { getByLabelText, getByText } = render(
            <PeriodFilter onFilter={onFilter} />,
        );

        fireEvent.change(getByLabelText('De:'), {
            target: { value: '2024-02-15' },
        });
        fireEvent.change(getByLabelText('Até:'), {
            target: { value: '2024-01-10' },
        });
        fireEvent.click(getByText('Filtrar'));

        expect(
            getByText('Data início não pode ser posterior à data fim'),
        ).toBeTruthy();
        expect(onFilter).not.toHaveBeenCalled();
    });

    it('should clear error message when valid dates are submitted', () => {
        const onFilter = jest.fn();
        const { getByLabelText, getByText, queryByText } = render(
            <PeriodFilter onFilter={onFilter} />,
        );

        // First, trigger an error
        fireEvent.change(getByLabelText('De:'), {
            target: { value: '2024-02-15' },
        });
        fireEvent.change(getByLabelText('Até:'), {
            target: { value: '2024-01-10' },
        });
        fireEvent.click(getByText('Filtrar'));

        expect(
            getByText('Data início não pode ser posterior à data fim'),
        ).toBeTruthy();

        // Now fix the dates and submit again
        fireEvent.change(getByLabelText('De:'), {
            target: { value: '2024-01-01' },
        });
        fireEvent.click(getByText('Filtrar'));

        expect(
            queryByText('Data início não pode ser posterior à data fim'),
        ).toBeNull();
        expect(onFilter).toHaveBeenCalledWith('2024-01-01', '2024-01-10');
    });
});
