import React from 'react';
import { Link } from 'react-router-dom';
import { FiPower } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import userImg from '../../assets/user.png';

import { useAuth } from '../../hooks/auth';

import { Header, HeaderContent, Profile } from './styles';

const MenuHeader: React.FC = () => {
  const { signOut, user } = useAuth();
  const { name, avatar_url } = user;

  return (
    <Header>
      <HeaderContent>
        <Link to="/">
          <img src={logoImg} alt="GoBarber" />
        </Link>

        <Profile>
          <img src={avatar_url || userImg} alt={name} />
          <div>
            <span>Bem vindo</span>
            <Link to="/profile">
              <strong>{name}</strong>
            </Link>
          </div>
        </Profile>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </Header>
  );
};

export default MenuHeader;
