import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Content, Menu, MenuItem } from './styles';

const Dashboard: React.FC = () => {
  return (
    <Container>
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
          <Link to="/stock-dashboard">
            <MenuItem>Dashboard de Estoque</MenuItem>
          </Link>
          <Link to="/users">
            <MenuItem>Usuários</MenuItem>
          </Link>
        </Menu>
      </Content>
    </Container>
  );
};

export default Dashboard;
