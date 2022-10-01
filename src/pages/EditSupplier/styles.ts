import styled from 'styled-components';
import { shade } from 'polished';

export const GoBack = styled.button`
  background: transparent;
  border: 0;
  color: #ff9000;
  width: fit-content;
  display: flex;
  align-items: center;
`;

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

export const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const AvatarInput = styled.div`
  position: relative;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }

    input {
      display: none;
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
