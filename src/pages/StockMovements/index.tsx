import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';

import MenuHeader from '../../components/MenuHeader';
import GoBack from '../../components/GoBack';
import Button from '../../components/Button';
import api from '../../services/api';
import { StockMovement } from '../../types';

import { Container, Content, HeaderPage } from './styles';

const StockMovements: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFetching, setIsFetching] = useState(true);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    api
      .get(`/stock_movements/${id}`)
      .then(res => {
        setMovements(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });

    api.get(`/products/${id}`).then(res => {
      setProductName(res.data.name);
    });
  }, [id]);

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>
              {productName
                ? `${productName} - Movimentações`
                : 'Movimentações de Estoque'}
            </h1>
            <hr />
          </div>
          <Link to={`/product/${id}/stock-movement/add`}>
            <Button type="button">Nova Movimentação</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <GoBack />

        <table>
          <thead>
            <tr className="table100-head">
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
                <td className="column1">
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
                <td className="column2">{movement.quantity}</td>
                <td className="column3">
                  {movement.type === 'entrada'
                    ? Number(movement.stock_after) - Number(movement.quantity)
                    : Number(movement.stock_after) + Number(movement.quantity)}
                </td>
                <td className="column3">{Number(movement.stock_after)}</td>
                <td className="column4">{movement.reason}</td>
                <td className="column5">
                  {movement.supplier_id || movement.client_id || '-'}
                </td>
                <td className="column6">
                  {new Date(movement.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isFetching && <p className="fetching">Carregando...</p>}

        {!isFetching && movements.length === 0 && (
          <p>Nenhuma movimentação registrada para este produto.</p>
        )}
      </Content>
    </Container>
  );
};

export default StockMovements;
