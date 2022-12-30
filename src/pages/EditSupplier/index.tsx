/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import api from '../../services/api';

import GoBack from '../../components/GoBack';
import MenuHeader from '../../components/MenuHeader';
import FormSupplier from '../../components/FormSupplier';

import { Container, Content, ContentPage } from './styles';

import { Supplier } from '../../types';

const EditSupplier: React.FC = () => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/suppliers/${id}`).then(response => {
      setSupplier(response.data);
    });
  }, [id]);

  return (
    <Container>
      <MenuHeader />
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Editar Fornecedor</h1>

          <FormSupplier
            initialData={{
              id: supplier?.id,
              name_social_reason: supplier?.name_social_reason,
              name_fantasy: supplier?.name_fantasy,
              cnpj: supplier?.cnpj,
              tel: supplier?.tel,
              tel2: supplier?.tel2,
              domain: supplier?.domain,
              neighborhood: supplier?.neighborhood,
              street: supplier?.street,
              cep: supplier?.cep,
              number: supplier?.number,
              complement: supplier?.complement,
              city_id: {
                ...supplier?.city,
                label: supplier?.city.name,
                value: supplier?.city.id,
              },
              logo_url: supplier?.logo_url,
              representative_name: supplier?.representative_name,
              mail: supplier?.mail,
              mail2: supplier?.mail2,
              note: supplier?.note,
            }}
            url={`/suppliers/${id}`}
            method="edit"
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditSupplier;
