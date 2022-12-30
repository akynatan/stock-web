import { shade } from 'polished';
import styled from 'styled-components';

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
