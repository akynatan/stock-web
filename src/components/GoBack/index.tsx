import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import { Container } from './styles';

const GoBack: React.FC = () => {
  const history = useHistory();

  return (
    <Container type="button" onClick={() => history.goBack()}>
      <FiArrowLeft size={30} />
    </Container>
  );
};

export default GoBack;
