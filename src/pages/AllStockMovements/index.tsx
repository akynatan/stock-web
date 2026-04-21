import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';

import MenuHeader from '../../components/MenuHeader';
import Button from '../../components/Button';
import api from '../../services/api';

import { Container, Content, HeaderPage } from './styles';

interface MovementData {
  id: string;
  product_id: string;
  type: string;
  quantity: number;
  stock_after: number;
  reason: string;
  supplier_id?: string;
  client_id?: string;
  created_at: string;
  product?: { name: string };
  supplier?: { name_fantasy: string; name_social_reason: string };
  client?: { name: string };
}

const AllStockMovements: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [movements, setMovements] = useState<MovementData[]>([]);

  useEffect(() => {
    api
      .get('/stock_movements')
      .then(res => {
        setMovements(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const getPartyName = (movement: MovementData): string => {
    if (movement.type === 'entrada' && movement.supplier) {
      return (
        movement.supplier.name_fantasy || movement.supplier.name_social_reason
      );
    }
    if (movement.type === 'saida' && movement.client) {
      return movement.client.name;
    }
    return '-';
  };

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>Todas as Movimentações</h1>
            <hr />
          </div>
          <Link to="/stock-movement/add">
            <Button type="button">Nova Movimentação</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Estoque Inicial</th>
              <th>Estoque Após</th>
              <th>Motivo</th>
              <th>Fornecedor/Cliente</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(movement => (
              <tr key={movement.id}>
                <td>{movement.product?.name || '-'}</td>
                <td>
                  <span
                    className={
                      movement.type === 'entrada'
                        ? 'badge-entrada'
                        : 'badge-saida'
                    }
                  >
                    {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td>{movement.quantity}</td>
                <td>
                  {movement.type === 'entrada'
                    ? Number(movement.stock_after) - Number(movement.quantity)
                    : Number(movement.stock_after) + Number(movement.quantity)}
                </td>
                <td>{Number(movement.stock_after)}</td>
                <td>{movement.reason}</td>
                <td>{getPartyName(movement)}</td>
                <td>{new Date(movement.created_at).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {isFetching && <p className="fetching">Carregando...</p>}

        {!isFetching && movements.length === 0 && (
          <p>Nenhuma movimentação registrada.</p>
        )}
      </Content>
    </Container>
  );
};

export default AllStockMovements;
