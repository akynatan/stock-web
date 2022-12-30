import React from 'react';

import FormProduct from '../../components/FormProduct';
import GoBack from '../../components/GoBack';
import MenuHeader from '../../components/MenuHeader';

import { Container, Content, ContentPage } from './styles';

const AddProduct: React.FC = () => {
  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />
          <h1>Novo Produto</h1>
          <FormProduct url="/product" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddProduct;
