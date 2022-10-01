import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: transparent;
  border: 0;
  color: #ff9000;
  width: fit-content;
  display: flex;
  align-self: flex-start;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;
