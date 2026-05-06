import React, { useState, useCallback, useEffect } from 'react';

import PeriodFilter from '../../components/PeriodFilter';
import SortableHeader from '../../components/SortableHeader';
import api from '../../services/api';
import useSortableData from '../../hooks/useSortableData';

import { Container, Content, HeaderPage, SectionTitle } from './styles';

interface StockLevelData {
    product_id: string;
    product_name: string;
    last_movement_date: string;
    type: 'entrada' | 'saida';
    stock_after: number;
}

interface ZeroStockData {
    product_id: string;
    product_name: string;
    category_name: string;
    brand_name: string;
}

interface MovementsSummaryData {
    product_id: string;
    product_name: string;
    total_entries: number;
    total_exits: number;
}

interface EntriesBySupplierData {
    supplier_id: string;
    supplier_name: string;
    total_movements: number;
}

interface ExitsByClientData {
    client_id: string;
    client_name: string;
    total_movements: number;
}

function getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0];
}

const StockDashboard: React.FC = () => {
    const [startDate, setStartDate] = useState<string>(getDefaultStartDate());
    const [endDate, setEndDate] = useState<string>(getDefaultEndDate());

    const [stockLevels, setStockLevels] = useState<StockLevelData[]>([]);
    const [stockLevelsLoading, setStockLevelsLoading] = useState(true);

    const [zeroStock, setZeroStock] = useState<ZeroStockData[]>([]);
    const [zeroStockLoading, setZeroStockLoading] = useState(true);

    const [movementsSummary, setMovementsSummary] = useState<MovementsSummaryData[]>([]);
    const [movementsSummaryLoading, setMovementsSummaryLoading] = useState(true);

    const [entriesBySupplier, setEntriesBySupplier] = useState<EntriesBySupplierData[]>([]);
    const [entriesBySupplierLoading, setEntriesBySupplierLoading] = useState(true);

    const [exitsByClient, setExitsByClient] = useState<ExitsByClientData[]>([]);
    const [exitsByClientLoading, setExitsByClientLoading] = useState(true);

    const { sortedItems: sortedStockLevels, sortConfig: stockLevelsSortConfig, requestSort: requestStockLevelsSort } = useSortableData(stockLevels);
    const { sortedItems: sortedZeroStock, sortConfig: zeroStockSortConfig, requestSort: requestZeroStockSort } = useSortableData(zeroStock);
    const { sortedItems: sortedMovementsSummary, sortConfig: movementsSummarySortConfig, requestSort: requestMovementsSummarySort } = useSortableData(movementsSummary);
    const { sortedItems: sortedEntriesBySupplier, sortConfig: entriesBySupplierSortConfig, requestSort: requestEntriesBySupplierSort } = useSortableData(entriesBySupplier);
    const { sortedItems: sortedExitsByClient, sortConfig: exitsByClientSortConfig, requestSort: requestExitsByClientSort } = useSortableData(exitsByClient);

    const handleFilter = useCallback((newStartDate: string, newEndDate: string) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }, []);

    useEffect(() => {
        setStockLevelsLoading(true);
        api
            .get(`/dashboard/stock-levels?start_date=${startDate}&end_date=${endDate}`)
            .then(res => {
                setStockLevels(res.data);
            })
            .finally(() => {
                setStockLevelsLoading(false);
            });
    }, [startDate, endDate]);

    useEffect(() => {
        setZeroStockLoading(true);
        api
            .get('/dashboard/zero-stock')
            .then(res => {
                setZeroStock(res.data);
            })
            .finally(() => {
                setZeroStockLoading(false);
            });
    }, []);

    useEffect(() => {
        setMovementsSummaryLoading(true);
        api
            .get(`/dashboard/movements-summary?start_date=${startDate}&end_date=${endDate}`)
            .then(res => {
                setMovementsSummary(res.data);
            })
            .finally(() => {
                setMovementsSummaryLoading(false);
            });
    }, [startDate, endDate]);

    useEffect(() => {
        setEntriesBySupplierLoading(true);
        api
            .get('/dashboard/entries-by-supplier')
            .then(res => {
                setEntriesBySupplier(res.data);
            })
            .finally(() => {
                setEntriesBySupplierLoading(false);
            });
    }, []);

    useEffect(() => {
        setExitsByClientLoading(true);
        api
            .get('/dashboard/exits-by-client')
            .then(res => {
                setExitsByClient(res.data);
            })
            .finally(() => {
                setExitsByClientLoading(false);
            });
    }, []);

    return (
        <Container>
            <Content>
                <HeaderPage>
                    <div>
                        <h1>Dashboard de Estoque</h1>
                        <hr />
                    </div>
                </HeaderPage>

                <PeriodFilter onFilter={handleFilter} />

                <SectionTitle>Nível de Estoque</SectionTitle>
                {stockLevelsLoading && <p className="fetching">Carregando...</p>}
                {!stockLevelsLoading && stockLevels.length === 0 && (
                    <p>Não há dados para o período selecionado</p>
                )}
                {!stockLevelsLoading && stockLevels.length > 0 && (
                    <table>
                        <thead>
                            <tr className="table100-head">
                                <SortableHeader
                                    label="Produto"
                                    sortKey="product_name"
                                    sortConfig={stockLevelsSortConfig}
                                    onSort={requestStockLevelsSort}
                                />
                                <SortableHeader
                                    label="Última Movimentação"
                                    sortKey="last_movement_date"
                                    sortConfig={stockLevelsSortConfig}
                                    onSort={requestStockLevelsSort}
                                />
                                <SortableHeader
                                    label="Tipo"
                                    sortKey="type"
                                    sortConfig={stockLevelsSortConfig}
                                    onSort={requestStockLevelsSort}
                                />
                                <SortableHeader
                                    label="Estoque Após"
                                    sortKey="stock_after"
                                    sortConfig={stockLevelsSortConfig}
                                    onSort={requestStockLevelsSort}
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStockLevels.map(item => (
                                <tr key={item.product_id}>
                                    <td>{item.product_name}</td>
                                    <td>{new Date(item.last_movement_date).toLocaleString('pt-BR')}</td>
                                    <td>
                                        <span className={item.type === 'entrada' ? 'badge-entrada' : 'badge-saida'}>
                                            {item.type === 'entrada' ? 'Entrada' : 'Saída'}
                                        </span>
                                    </td>
                                    <td>{item.stock_after}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <SectionTitle>Itens com Estoque Zerado</SectionTitle>
                {zeroStockLoading && <p className="fetching">Carregando...</p>}
                {!zeroStockLoading && zeroStock.length === 0 && (
                    <p>Não há itens com estoque zerado</p>
                )}
                {!zeroStockLoading && zeroStock.length > 0 && (
                    <table>
                        <thead>
                            <tr className="table100-head">
                                <SortableHeader
                                    label="Produto"
                                    sortKey="product_name"
                                    sortConfig={zeroStockSortConfig}
                                    onSort={requestZeroStockSort}
                                />
                                <SortableHeader
                                    label="Categoria"
                                    sortKey="category_name"
                                    sortConfig={zeroStockSortConfig}
                                    onSort={requestZeroStockSort}
                                />
                                <SortableHeader
                                    label="Marca"
                                    sortKey="brand_name"
                                    sortConfig={zeroStockSortConfig}
                                    onSort={requestZeroStockSort}
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedZeroStock.map(item => (
                                <tr key={item.product_id}>
                                    <td>{item.product_name}</td>
                                    <td>{item.category_name}</td>
                                    <td>{item.brand_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <SectionTitle>Resumo de Movimentações</SectionTitle>
                {movementsSummaryLoading && <p className="fetching">Carregando...</p>}
                {!movementsSummaryLoading && movementsSummary.length === 0 && (
                    <p>Não há dados para o período selecionado</p>
                )}
                {!movementsSummaryLoading && movementsSummary.length > 0 && (
                    <table>
                        <thead>
                            <tr className="table100-head">
                                <SortableHeader
                                    label="Produto"
                                    sortKey="product_name"
                                    sortConfig={movementsSummarySortConfig}
                                    onSort={requestMovementsSummarySort}
                                />
                                <SortableHeader
                                    label="Total de Entradas"
                                    sortKey="total_entries"
                                    sortConfig={movementsSummarySortConfig}
                                    onSort={requestMovementsSummarySort}
                                />
                                <SortableHeader
                                    label="Total de Saídas"
                                    sortKey="total_exits"
                                    sortConfig={movementsSummarySortConfig}
                                    onSort={requestMovementsSummarySort}
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMovementsSummary.map(item => (
                                <tr key={item.product_id}>
                                    <td>{item.product_name}</td>
                                    <td>{item.total_entries}</td>
                                    <td>{item.total_exits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <SectionTitle>Entradas por Fornecedor</SectionTitle>
                {entriesBySupplierLoading && <p className="fetching">Carregando...</p>}
                {!entriesBySupplierLoading && entriesBySupplier.length === 0 && (
                    <p>Não há dados disponíveis</p>
                )}
                {!entriesBySupplierLoading && entriesBySupplier.length > 0 && (
                    <table>
                        <thead>
                            <tr className="table100-head">
                                <SortableHeader
                                    label="Fornecedor"
                                    sortKey="supplier_name"
                                    sortConfig={entriesBySupplierSortConfig}
                                    onSort={requestEntriesBySupplierSort}
                                />
                                <SortableHeader
                                    label="Número de Movimentações de Entrada"
                                    sortKey="total_movements"
                                    sortConfig={entriesBySupplierSortConfig}
                                    onSort={requestEntriesBySupplierSort}
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEntriesBySupplier.map(item => (
                                <tr key={item.supplier_id}>
                                    <td>{item.supplier_name}</td>
                                    <td>{item.total_movements}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <SectionTitle>Saídas por Cliente</SectionTitle>
                {exitsByClientLoading && <p className="fetching">Carregando...</p>}
                {!exitsByClientLoading && exitsByClient.length === 0 && (
                    <p>Não há dados disponíveis</p>
                )}
                {!exitsByClientLoading && exitsByClient.length > 0 && (
                    <table>
                        <thead>
                            <tr className="table100-head">
                                <SortableHeader
                                    label="Cliente"
                                    sortKey="client_name"
                                    sortConfig={exitsByClientSortConfig}
                                    onSort={requestExitsByClientSort}
                                />
                                <SortableHeader
                                    label="Número de Movimentações de Saída"
                                    sortKey="total_movements"
                                    sortConfig={exitsByClientSortConfig}
                                    onSort={requestExitsByClientSort}
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedExitsByClient.map(item => (
                                <tr key={item.client_id}>
                                    <td>{item.client_name}</td>
                                    <td>{item.total_movements}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Content>
        </Container>
    );
};

export default StockDashboard;
