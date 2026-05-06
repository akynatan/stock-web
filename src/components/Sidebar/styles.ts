import styled from 'styled-components';

export const Container = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  background: #28262e;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow-y: auto;
`;

export const Logo = styled.div`
  padding: 0 20px 24px;
  border-bottom: 1px solid #3e3b47;
  margin-bottom: 16px;

  img {
    height: 50px;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

export const NavItem = styled.li<{ active?: boolean }>`
  a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    color: ${props => (props.active ? '#ff9000' : '#f4ede8')};
    text-decoration: none;
    font-size: 14px;
    font-weight: ${props => (props.active ? '600' : '400')};
    border-left: 3px solid ${props => (props.active ? '#ff9000' : 'transparent')};
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 144, 0, 0.08);
      color: #ff9000;
    }

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
  }
`;

export const UserSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #3e3b47;
  display: flex;
  align-items: center;
  gap: 12px;

  span {
    color: #f4ede8;
    font-size: 13px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    background: transparent;
    border: 0;
    cursor: pointer;

    svg {
      color: #999591;
      width: 18px;
      height: 18px;
    }

    &:hover svg {
      color: #ff9000;
    }
  }
`;
