import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiPower,
    FiHome,
    FiTruck,
    FiBox,
    FiUsers,
    FiRepeat,
    FiTag,
    FiLayers,
    FiGrid,
    FiTool,
    FiBarChart2,
    FiUserPlus,
} from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

import { Container, Logo, NavList, NavItem, UserSection } from './styles';

const baseMenuItems = [
    { path: '/', label: 'Início', icon: FiHome, exact: true },
    { path: '/suppliers', label: 'Fornecedores', icon: FiTruck },
    { path: '/products', label: 'Produtos', icon: FiBox },
    { path: '/clients', label: 'Clientes', icon: FiUsers },
    { path: '/stock-movements', label: 'Transações', icon: FiRepeat },
    { path: '/brands', label: 'Marcas', icon: FiTag },
    { path: '/models', label: 'Modelos', icon: FiLayers },
    { path: '/categories', label: 'Categorias', icon: FiGrid },
    { path: '/manufacturers', label: 'Fabricantes', icon: FiTool },
    { path: '/stock-dashboard', label: 'Dashboard', icon: FiBarChart2 },
];

const adminOnlyMenuItems = [
    { path: '/users', label: 'Usuários', icon: FiUserPlus },
];

const Sidebar: React.FC = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();

    const menuItems =
        user?.role === 'admin'
            ? [...baseMenuItems, ...adminOnlyMenuItems]
            : baseMenuItems;

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <Container>
            <Logo>
                <Link to="/">
                    <img src={logoImg} alt="Stock" />
                </Link>
            </Logo>

            <NavList>
                {menuItems.map(item => (
                    <NavItem key={item.path} active={isActive(item.path, item.exact)}>
                        <Link to={item.path}>
                            <item.icon />
                            {item.label}
                        </Link>
                    </NavItem>
                ))}
            </NavList>

            <UserSection>
                <span>Aky Natan</span>
                <button type="button" onClick={signOut} title="Sair">
                    <FiPower />
                </button>
            </UserSection>
        </Container>
    );
};

export default Sidebar;
