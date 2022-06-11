import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.main`
  max-width: 1400px;
  margin: 64px auto;
  padding: 0 20px;
  display: flex;
`;

export const Menu = styled.section`
  margin-top: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  a {
    text-decoration: none;
  }

  a:hover {
    opacity: 0.8;
    border: 0.5px solid #ff9000;
    border-radius: 10px;
  }

  gap: 20px;
`;

export const MenuItem = styled.div`
  background-color: #28262e;
  border-radius: 10px;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
  text-decoration: none;
  color: #ff9000;
  font-size: 20px;

  &:hover {
    opacity: 0.8;
  }
`;
