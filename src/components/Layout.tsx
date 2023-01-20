import React, { useState } from 'react';
import { AppShell, Navbar, Footer, Aside, Text, MediaQuery, useMantineTheme, r } from '@mantine/core';
import HeaderWrapper from './Header';

const Layout = ({ children }: LayoutProps): JSX.Element => {
    const theme = useMantineTheme();

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint='sm'
            asideOffsetBreakpoint='sm'
            footer={
                <Footer height={60} p='md'>
                    Application footer
                </Footer>
            }
            header={<HeaderWrapper />}
        >
            {children}
        </AppShell>
    );
};

export default Layout;
