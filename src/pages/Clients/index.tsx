/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import { HiPencil } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';

import 'react-day-picker/lib/style.css';

import { FiPlusCircle } from 'react-icons/fi';
import { Client } from '../../types/Client';

import MenuHeader from '../../components/MenuHeader';
import Button from '../../components/Button';
import api from '../../services/api';

import { Container, Content, HeaderPage } from './styles';
import { useToast } from '../../hooks/toast';

const Clients: React.FC = () => {
  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    api
      .get('/client')
      .then(res => {
        setClients(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const handleDeleteClient = useCallback(
    (client: Client) => {
      const confirm = window.confirm(
        `Deseja mesmo apagar o cliente ${client.name}?`,
      );

      confirm &&
        api
          .delete(`/client/${client.id}`)
          .then(() => {
            setClients(val => val.filter(s => s.id !== client.id));

            addToast({
              type: 'success',
              title: 'Cliente apagado!',
            });
          })
          .catch(() => {
            addToast({
              type: 'error',
              title: 'Falha ao apagar cliente!',
            });
          });
    },
    [addToast],
  );

  const handleStatus = useCallback(
    async (clientId: string) => {
      try {
        await api.patch(`/client/${clientId}/status`);
        setClients(oldClients =>
          oldClients.map(c =>
            c.id === clientId ? { ...c, active: !c.active } : c,
          ),
        );
      } catch (err) {
        addToast({
          title: 'Falha ao alterar status do cliente.',
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
            <h1>Lista de Clientes</h1>
            <hr />
          </div>
          <Link to="client/add">
            <Button type="button">Adicionar Cliente</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Nome</th>
              <th>Código</th>
              <th>Documento</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Endereço</th>
              <th>Notas</th>
              <th>Ativo?</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => {
              return (
                <tr key={client.id}>
                  <td className="column1">
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`client/${client.id}`}
                      title="Detalhar Cliente"
                    >
                      {client.name || '-'}
                    </Link>
                  </td>
                  <td className="column2">{client.code || '-'}</td>
                  <td className="column2">{client.document || '-'}</td>
                  <td className="column3">{client.tel || '-'}</td>
                  <td className="column4">{client.mail || '-'}</td>
                  <td className="column5">
                    {`${client.street}, ${client.number} - ${client.neighborhood}, ${client.city.name}/${client.city.state.abbreviation}`}
                  </td>
                  <td className="column6">{client.note || '-'}</td>
                  <td>
                    <Switch
                      checked={!!client.active}
                      width={30}
                      height={15}
                      offColor="#d2a3a3"
                      onHandleColor="#d6d6d6"
                      offHandleColor="#d6d6d6"
                      activeBoxShadow="0"
                      handleDiameter={17}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onChange={() => handleStatus(client.id)}
                    />
                  </td>
                  <td>
                    <Link
                      style={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        color: '#ff9000',
                      }}
                      to={`client/${client.id}`}
                      title="Editar Cliente"
                    >
                      <HiPencil />
                    </Link>
                    <MdDelete
                      title="Apagar Cliente"
                      onClick={() => handleDeleteClient(client)}
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

export default Clients;
