import React from 'react';
import { Anchor, Header, createStyles, Flex, Image, MediaQuery, Burger, Text, Container, Group } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const useStyles = createStyles((theme, _params, getRef) => ({
    link: {},
    hSpace: {
        flexGrow: 2,
    },
}));

const HeaderWrapper = (): JSX.Element => {
    const { count, opened, setOpened } = useAppContext();
    const { classes } = useStyles();
    console.log(`opened:${opened}`);
    return (
        <>
            <Header height={{ base: 60, md: 60 }} p='md'>
                <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                    <Burger opened={opened} onClick={() => setOpened((o) => !o)} size='sm' mr='xl' />
                </MediaQuery>
                <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
                    <Flex gap={10}>
                        <div className={classes.hSpace} />
                        <Anchor component={NavLink} to='/' className={classes.link} truncate>
                            Home
                        </Anchor>
                        <Anchor component={NavLink} to='/count' className={classes.link} truncate>
                            Count
                        </Anchor>
                        <Anchor component={NavLink} to='/tanstack' className={classes.link} truncate>
                            Tanstack
                        </Anchor>
                        <Anchor component={NavLink} to='/table-demo' className={classes.link} truncate>
                            React Table Demo
                        </Anchor>
                        <Anchor component={NavLink} to='/questions' className={classes.link} truncate>
                            Questions (Basic Table)
                        </Anchor>
                    </Flex>
                </MediaQuery>
            </Header>
        </>
    );
};

export default HeaderWrapper;
/*
<>

</>
 */
