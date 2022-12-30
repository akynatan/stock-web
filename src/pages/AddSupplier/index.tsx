/* eslint-disable no-alert */
/* eslint-disable no-useless-escape */
import React from 'react';

import FormSupplier from '../../components/FormSupplier';
import GoBack from '../../components/GoBack';
import MenuHeader from '../../components/MenuHeader';

import { Container, Content, ContentPage } from './styles';

const AddSupplier: React.FC = () => {
  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />
          <h1>Novo Fornecedor</h1>

          <FormSupplier url="/suppliers" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddSupplier;
