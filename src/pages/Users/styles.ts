import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.main`
  max-width: 1400px;
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

  .column1 {
    width: 240px;
  }

  .column2 {
    width: 280px;
  }

  .column3 {
    width: 140px;
  }

  .column4 {
    width: 120px;
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

  @media screen and (max-width: 992px) {
    table {
      display: block;
    }
    table > *,
    table tr,
    table td,
    table th {
      display: block;
    }
    table thead {
      display: none;
    }
    table tbody tr {
      height: auto;
      padding: 37px 0;
    }
    table tbody tr td {
      padding-left: 40% !important;
      margin-bottom: 24px;
    }
    table tbody tr td:last-child {
      margin-bottom: 0;
    }
    table tbody tr td:before {
      font-family: OpenSans-Regular;
      font-size: 14px;
      color: #999999;
      line-height: 1.2;
      font-weight: unset;
      position: absolute;
      width: 40%;
      left: 30px;
      top: 0;
    }
    table tbody tr td:nth-child(1):before {
      content: 'Nome';
    }
    table tbody tr td:nth-child(2):before {
      content: 'E-mail';
    }
    table tbody tr td:nth-child(3):before {
      content: 'Papel';
    }
    table tbody tr td:nth-child(4):before {
      content: 'Ações';
    }

    table td,
    table th {
      text-align: left;
    }

    .column1,
    .column2,
    .column3,
    .column4 {
      width: 100%;
    }

    tbody tr {
      font-size: 14px;
    }
  }
`;

export const HeaderPage = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;

  div {
    width: 79%;

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
    width: 260px;
  }

  svg {
    display: none;
    width: 40px;
    height: 40px;
    font-weight: bold;
    color: #ff9000;
  }

  @media screen and (max-width: 992px) {
    button {
      display: none;
    }

    svg {
      display: flex;
    }
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

  input,
  select {
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
