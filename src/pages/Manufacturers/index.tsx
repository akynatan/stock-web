import React from 'react';
import CrudPage from '../../components/CrudPage';

const Manufacturers: React.FC = () => (
  <CrudPage title="Fabricantes" endpoint="/manufacturer" />
);

export default Manufacturers;
