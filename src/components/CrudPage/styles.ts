import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.main`
  max-width: 900px;
  margin: 64px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;

  .fetching {
    text-align: center;
    color: #ff9000;
  }

  table {
    border-spacing: 1;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    position: relative;
  }
  table * {
    position: relative;
  }
  table td,
  table th {
    padding-left: 8px;
    text-align: center;
  }
  table thead tr {
    height: 60px;
    background: #28262e;
  }
  table tbody tr {
    height: 50px;
  }
  table tbody tr:last-child {
    border: 0;
  }
  tbody tr:nth-child(even) {
    background-color: #f5f5f5;
  }
  tbody tr:nth-child(odd) {
    background-color: white;
  }
  tbody tr {
    font-family: OpenSans-Regular;
    font-size: 15px;
    color: #808080;
    line-height: 1.2;
    font-weight: unset;
  }
  tbody tr:hover {
    color: #555555;
    background-color: #f5f5f5;
    cursor: pointer;
  }

  table td svg {
    color: #ff9000;
    height: 40px;
    width: 20px;
    cursor: pointer;
  }
  table td svg + svg {
    margin-left: 10px;
  }
`;

export const HeaderPage = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;

  div {
    width: 70%;
    hr {
      width: 100%;
      color: white;
      height: 2px;
    }
    h1 {
      color: #ff9000;
    }
  }

  button {
    width: 200px;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #312e38;
  border-radius: 10px;
  padding: 40px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: #ff9000;
    margin-bottom: 24px;
  }

  input {
    background: #232129;
    border-radius: 10px;
    border: 2px solid #232129;
    padding: 16px;
    width: 100%;
    color: #f4ede8;
    font-size: 16px;
    margin-bottom: 16px;

    &::placeholder {
      color: #666360;
    }

    &:focus {
      border-color: #ff9000;
    }
  }

  div {
    display: flex;
    gap: 12px;
    width: 100%;

    button {
      flex: 1;
    }
  }
`;
