import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

export const DateInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #666360;
`;

export const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #232129;
  border-radius: 4px;
  background: #232129;
  color: #f4ede8;
  font-size: 14px;

  &:focus {
    border-color: #ff9000;
    outline: none;
  }
`;

export const FilterButton = styled.button`
  padding: 8px 16px;
  background: #ff9000;
  color: #312e38;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #cc7300;
  }
`;

export const ErrorMessage = styled.span`
  color: #c53030;
  font-size: 12px;
  display: block;
  width: 100%;
  margin-top: 4px;
`;
