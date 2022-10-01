/* eslint-disable no-useless-escape */
import React from 'react';

import FormClient from '../../components/FormClient';
import GoBack from '../../components/GoBack';

import { Container, Content } from './styles';
import MenuHeader from '../../components/MenuHeader';

const AddClient: React.FC = () => {
  return (
    <Container>
      <MenuHeader />

      <Content>
        <GoBack />

        <h1>Novo Cliente</h1>

        <FormClient url="/client" method="add" />
      </Content>
    </Container>
  );
};

export default AddClient;
