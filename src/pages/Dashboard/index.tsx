import React from 'react';
import { Link } from 'react-router-dom';

import MenuHeader from '../../components/MenuHeader';
import { Container, Content, Menu, MenuItem } from './styles';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <MenuHeader />

      <Content>
        <Menu>
          <Link to="/suppliers">
            <MenuItem>Fornecedores</MenuItem>
          </Link>
          <Link to="/products">
            <MenuItem>Produtos</MenuItem>
          </Link>
          <Link to="/clients">
            <MenuItem>Clientes</MenuItem>
          </Link>

          <Link to="/stock-movements">
            <MenuItem>Transações</MenuItem>
          </Link>
          <Link to="/brands">
            <MenuItem>Marcas</MenuItem>
          </Link>
          <Link to="/models">
            <MenuItem>Modelos</MenuItem>
          </Link>
          <Link to="/categories">
            <MenuItem>Categorias</MenuItem>
          </Link>
          <Link to="/manufacturers">
            <MenuItem>Fabricantes</MenuItem>
          </Link>
        </Menu>
      </Content>
    </Container>
  );
};

export default Dashboard;
