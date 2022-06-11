/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';

import 'react-day-picker/lib/style.css';

import { Link } from 'react-router-dom';
import { FiPlusCircle } from 'react-icons/fi';
import MenuHeader from '../../components/MenuHeader';
import { Container, Content, HeaderPage } from './styles';
import Button from '../../components/Button';
import api from '../../services/api';
import { Product } from '../../types/Product';
import { useToast } from '../../hooks/toast';

const Products: React.FC = () => {
  const { addToast } = useToast();
  const [measures] = useState([
    { label: 'Unidade', value: 'UN' },
    { label: 'Tonelada', value: 'T' },
    { label: 'Quilograma', value: 'KG' },
    { label: 'Grama', value: 'G' },
    { label: 'Miligrama', value: 'MG' },
    { label: 'Volume', value: 'V' },
    { label: 'Litro', value: 'L' },
    { label: 'Mililitro', value: 'ML' },
    { label: 'Quilometro', value: 'KM' },
    { label: 'Metro', value: 'M' },
    { label: 'Centimetro', value: 'CM' },
    { label: 'Decimetro', value: 'DM' },
    { label: 'Milimetro', value: 'MM' },
  ]);
  const [isFetching, setIsFetching] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get('/products')
      .then(res => {
        setProducts(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const handleDeleteProduct = useCallback(
    (product: Product) => {
      const confirm = window.confirm(
        `Deseja mesmo apagar o produto ${product.name}?`,
      );

      confirm &&
        api
          .delete(`/products/${product.id}`)
          .then(() => {
            setProducts(val => val.filter(s => s.id !== product.id));

            addToast({
              type: 'success',
              title: 'Produto apagado!',
            });
          })
          .catch(() => {
            addToast({
              type: 'error',
              title: 'Falha ao apagar produto!',
            });
          });
    },
    [addToast],
  );

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>Lista de Produtos</h1>
            <hr />
          </div>
          <Link to="product/add">
            <Button type="button">Adicionar Produto</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Nome</th>
              <th>Código</th>
              <th>Descrição</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Categoria</th>
              <th>Fabricante</th>
              <th>Unidade de Medida</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return (
                <tr key={product.id}>
                  <td className="column1">
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`product/${product.id}`}
                      title="Detalhar Produto"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="column2">{product.code}</td>
                  <td className="column3">
                    {`${product?.description}` || '-'}
                  </td>
                  <td className="column4">{product.brand?.name || '-'}</td>
                  <td className="column4">{product.model?.name || '-'}</td>
                  <td className="column4">{product.category?.name || '-'}</td>
                  <td className="column4">
                    {product.manufacturer?.name || '-'}
                  </td>
                  <td className="column4">
                    {measures.find(m => m.value === product?.measure_unit)
                      ?.label || '-'}
                  </td>
                  <td>
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`product/${product.id}`}
                      title="Detalhar Produto"
                    >
                      <HiPencil />
                    </Link>
                    <MdDelete onClick={() => handleDeleteProduct(product)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isFetching && <p className="fetching">Carregando...</p>}
      </Content>
    </Container>
  );
};

export default Products;
