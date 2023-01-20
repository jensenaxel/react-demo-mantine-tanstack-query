import React from 'react';
import { Anchor, Group, Flex, Header } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const HeaderWrapper = (): JSX.Element => {
    const { count } = useAppContext();
    return (
        <Header height={{ base: 70, md: 70 }} p='md'>
            <Group spacing={'md'} grow>
                <Group spacing={'md'} position={'left'} noWrap>
                    <Anchor component={NavLink} to='/'>
                        Home
                    </Anchor>
                    <Anchor component={NavLink} to='/count'>
                        Count
                    </Anchor>
                    <Anchor component={NavLink} to='/tanstack'>
                        Tanstack
                    </Anchor>
                    <Anchor component={NavLink} to='/questions'>
                        Questions
                    </Anchor>
                </Group>
                <Group spacing={'md'} position={'right'}>
                    <p>Current Count: {count}</p>
                </Group>
            </Group>
        </Header>
    );
};

export default HeaderWrapper;
