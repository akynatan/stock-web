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

  .badge-entrada {
    background-color: #04d361;
    color: #fff;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 13px;
  }

  .badge-saida {
    background-color: #c53030;
    color: #fff;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 13px;
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
    padding: 0 8px;
    text-align: center;
    vertical-align: middle;
  }
  table thead tr {
    height: 60px;
    background: #28262e;
    color: #f4ede8;
  }
  table tbody tr {
    height: 50px;
  }
  table tbody tr:last-child {
    border: 0;
  }

  tbody tr:nth-child(even) {
    background-color: #312e38;
  }

  tbody tr:nth-child(odd) {
    background-color: #3e3b47;
  }

  tbody tr {
    font-family: OpenSans-Regular;
    font-size: 15px;
    color: #f4ede8;
    line-height: 1.2;
    font-weight: unset;
  }

  tbody tr:hover {
    color: #ffffff;
    background-color: #454050;
    cursor: pointer;
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

export const SectionTitle = styled.h2`
  color: #ff9000;
  margin-top: 40px;
  margin-bottom: 16px;
  font-size: 20px;
`;
