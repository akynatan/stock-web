import styled from 'styled-components';

export const HeaderCell = styled.th`
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  padding: 12px 16px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 144, 0, 0.1);
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const SortIndicator = styled.span`
  font-size: 10px;
  color: #ff9000;
`;
