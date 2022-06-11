import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  .css-reyg8m-control:hover,
  .css-e7sjo6-control:hover {
    border-color: #232129 !important;
  }

  .css-111ybla-control:hover,
  .css-1j1j20l-control:hover {
    border-color: transparent !important;
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;

  width: 100%;

  form {
    margin: 80px 0;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 36px;
      text-align: center;
      color: #ff9000;
    }

    h2 {
      margin-top: 24px;
      margin-bottom: 5px;
      font-size: 20px;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const FormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;

  @media screen and (max-width: 992px) {
    justify-content: center;
  }
`;

export const FormGroupBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
