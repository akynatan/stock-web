import React from 'react';
import CrudPage from '../../components/CrudPage';

const Categories: React.FC = () => (
  <CrudPage title="Categorias" endpoint="/category" />
);

export default Categories;
