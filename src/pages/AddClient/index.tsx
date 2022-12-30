/* eslint-disable no-useless-escape */
import React from 'react';

import FormClient from '../../components/FormClient';
import GoBack from '../../components/GoBack';

import { Container, Content, ContentPage } from './styles';
import MenuHeader from '../../components/MenuHeader';

const AddClient: React.FC = () => {
  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />

          <h1>Novo Cliente</h1>

          <FormClient url="/client" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddClient;
