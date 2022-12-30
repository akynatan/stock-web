/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../services/api';

import FormClient from '../../components/FormClient';
import GoBack from '../../components/GoBack';
import MenuHeader from '../../components/MenuHeader';

import { Client } from '../../types';

import { Container, ContentPage, Content } from './styles';

const EditClient: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/client/${id}`).then(response => {
      setClient(response.data);
    });
  }, [id]);

  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />

          <h1>Editar Cliente</h1>

          <FormClient
            initialData={{
              name: client?.name,
              document: client?.document,
              tel: client?.tel,
              tel2: client?.tel2,
              neighborhood: client?.neighborhood,
              street: client?.street,
              city_id: {
                ...client?.city,
                label: client?.city.name,
                value: client?.city.id,
              },
              cep: client?.cep,
              number: client?.number,
              complement: client?.complement,
              mail: client?.mail,
              note: client?.note,
            }}
            url={`/client/${id}`}
            method="edit"
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditClient;
