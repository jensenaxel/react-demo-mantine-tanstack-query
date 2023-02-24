import React from 'react';
import { AppShell, Footer, useMantineTheme, Navbar, Text, Stack, Anchor, MediaQuery } from '@mantine/core';
import HeaderWrapper from './Header';
import { useAppContext } from '../hooks/useAppContext';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }: LayoutProps): JSX.Element => {
    const theme = useMantineTheme();
    const { opened, setOpened } = useAppContext();

    return (
        <>
            <AppShell
                footer={
                    <Footer height={60} p='md'>
                        Application footer
                    </Footer>
                }
                navbar={
                    <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                        <Navbar p='md' hidden={!opened} width={{ base: 0 }}>
                            <Stack>
                                <Anchor component={NavLink} to='/' truncate onClick={() => setOpened(false)}>
                                    Home
                                </Anchor>
                                <Anchor component={NavLink} to='/count' truncate onClick={() => setOpened(false)}>
                                    Count
                                </Anchor>
                                <Anchor component={NavLink} to='/tanstack' truncate onClick={() => setOpened(false)}>
                                    Tanstack
                                </Anchor>
                                <Anchor component={NavLink} to='/table-demo' truncate onClick={() => setOpened(false)}>
                                    React Table Demo
                                </Anchor>
                                <Anchor component={NavLink} to='/questions' truncate onClick={() => setOpened(false)}>
                                    Questions (Basic Table)
                                </Anchor>
                            </Stack>
                        </Navbar>
                    </MediaQuery>
                }
                header={<HeaderWrapper />}
            >
                {children}
            </AppShell>
        </>
    );
};

export default Layout;
