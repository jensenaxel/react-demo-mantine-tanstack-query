import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { useAppContext } from '../hooks/useAppContext';
import { Button } from '@mantine/core';

const Tanstack: React.FC = (): JSX.Element => {
    const { count, countIncrement } = useAppContext();

    console.log('re-render tanstack');
    const { isLoading, error, data } = useQuery({
        queryKey: ['tanstack-data'],
        queryFn: () => {
            console.log('tanstack queryFn called');
            return fetch('https://api.github.com/repos/tannerlinsley/react-query').then((res) => {
                console.log('data returned', res);
                return res.json();
            });
        },
    });

    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred: + error.message</>;

    return (
        <section>
            <Header />
            <h1>Tanstack Page</h1>
            <Button onClick={() => countIncrement(count + 1)}>Increment</Button>
            <p>Current Count: {count}</p>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <strong>👀 {data.subscribers_count}</strong> <strong>✨ {data.stargazers_count}</strong>
            <strong>🍴 {data.forks_count}</strong>
        </section>
    );
};

export default Tanstack;
