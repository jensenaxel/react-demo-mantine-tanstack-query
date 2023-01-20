import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Title, Stack } from '@mantine/core';

const QuestionsEdit: React.FC = (): JSX.Element => {
    console.log('re-render');
    const { isLoading, error, data } = useQuery({
        queryKey: ['currentQuestion'],
        queryFn: () => {
            console.log('queryFn called');
            return fetch('https://private-9e5c7-reactdemo2.apiary-mock.com/questions/2').then((res) => {
                return res.json();
            });
        },
    });

    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred:</>;

    return (
        <section>
            <Stack spacing={'lg'}>
                <Title>Questions Edit</Title>
                <div>{data.question}</div>
            </Stack>
        </section>
    );
};

export default QuestionsEdit;
