/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import { HiPencil } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';

import 'react-day-picker/lib/style.css';

import { Supplier } from '../../types/Supplier';

import MenuHeader from '../../components/MenuHeader';
import Button from '../../components/Button';
import api from '../../services/api';

import { Container, Content, HeaderPage } from './styles';
import { useToast } from '../../hooks/toast';

const Suppliers: React.FC = () => {
  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    api
      .get('/suppliers')
      .then(res => {
        setSuppliers(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const handleDeleteSupplier = useCallback(
    (supplier: Supplier) => {
      const confirm = window.confirm(
        `Deseja mesmo apagar o fornecedor ${supplier.name_fantasy}?`,
      );

      confirm &&
        api
          .delete(`/suppliers/${supplier.id}`)
          .then(() => {
            setSuppliers(val => val.filter(s => s.id !== supplier.id));

            addToast({
              type: 'success',
              title: 'Fornecedor apagado!',
            });
          })
          .catch(() => {
            addToast({
              type: 'error',
              title: 'Falha ao apagar fornecedor!',
            });
          });
    },
    [addToast],
  );

  const handleStatus = useCallback(
    async supplier_id => {
      try {
        api
          .patch(`/suppliers/${supplier_id}/status`)
          // .patch(`/suppliers/status`)
          .then(() => {
            setSuppliers(oldSuppliers => {
              return oldSuppliers.map(p => {
                if (p.id === supplier_id) {
                  return { ...p, active: !p.active };
                }

                return p;
              });
            });
          })
          .catch(() => {
            addToast({
              title: 'Falha ao alterar status do fornecedor.',
              type: 'error',
            });
          });
      } catch (err) {
        addToast({
          title: 'Falha ao alterar status do fornecedor.',
          type: 'error',
        });
      }
    },
    [addToast],
  );

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>Fornecedores</h1>
            <hr />
          </div>
          <Link to="supplier/add">
            <Button type="button">Adicionar Fornecedor</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Nome Fantasia</th>
              <th>CNPJ</th>
              <th>Endereço</th>
              <th>Site</th>
              <th>Representante</th>
              <th>Email</th>
              <th>Telefone Principal</th>
              <th>Ativo?</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => {
              return (
                <tr key={supplier.id}>
                  <td className="column1">
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`supplier/${supplier.id}`}
                      title="Detalhar Fornecedor"
                    >
                      {supplier.name_fantasy || '-'}
                    </Link>
                  </td>
                  <td className="column2">{supplier.cnpj || '-'}</td>
                  <td className="column3">
                    {`${supplier.street}, ${supplier.number} - ${supplier.neighborhood}, ${supplier.city.name}/${supplier.city.state.abbreviation}`}
                  </td>
                  <td className="column4">{supplier.domain || '-'}</td>
                  <td className="column5">
                    {supplier.representative_name || '-'}
                  </td>
                  <td className="column6">{supplier.mail || '-'}</td>
                  <td className="column7">{supplier.tel || '-'}</td>
                  <td className="column7">
                    <Switch
                      checked={supplier.active}
                      width={30}
                      height={15}
                      offColor="#d2a3a3"
                      onHandleColor="#d6d6d6"
                      offHandleColor="#d6d6d6"
                      activeBoxShadow="0"
                      handleDiameter={17}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onChange={() => {
                        handleStatus(supplier.id);
                      }}
                    />
                  </td>
                  <td>
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`supplier/${supplier.id}`}
                      title="Editar Fornecedor"
                    >
                      <HiPencil />
                    </Link>
                    <MdDelete
                      title="Apagar Fornecedor"
                      onClick={() => handleDeleteSupplier(supplier)}
                    />
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

export default Suppliers;
