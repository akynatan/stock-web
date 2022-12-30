import styled from 'styled-components';

export const Container = styled.div``;

export const ContentPage = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  margin: 80px 0;
  text-align: center;

  h1 {
    margin-bottom: 24px;
    font-size: 36px;
    text-align: center;
    color: #ff9000;
  }
`;
