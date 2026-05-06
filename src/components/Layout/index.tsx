import React from 'react';

import Sidebar from '../Sidebar';
import { LayoutContainer, MainContent } from './styles';

const Layout: React.FC = ({ children }) => {
    return (
        <LayoutContainer>
            <Sidebar />
            <MainContent>{children}</MainContent>
        </LayoutContainer>
    );
};

export default Layout;
