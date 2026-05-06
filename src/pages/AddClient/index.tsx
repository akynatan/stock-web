/* eslint-disable no-useless-escape */
import React from 'react';

import FormClient from '../../components/FormClient';
import GoBack from '../../components/GoBack';

import { Container, Content, ContentPage } from './styles';

const AddClient: React.FC = () => {
  return (
    <Container>
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
