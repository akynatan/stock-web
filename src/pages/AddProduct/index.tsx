import React from 'react';

import FormProduct from '../../components/FormProduct';
import GoBack from '../../components/GoBack';

import { Container, Content } from './styles';
import MenuHeader from '../../components/MenuHeader';

const AddProduct: React.FC = () => {
  return (
    <Container>
      <MenuHeader />

      <Content>
        <GoBack />
        <h1>Novo Produto</h1>
        <FormProduct url="/product" method="add" />
      </Content>
    </Container>
  );
};

export default AddProduct;
