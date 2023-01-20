import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Title, Stack, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const Questions: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    console.log('re-render');
    const { isLoading, error, data } = useQuery({
        queryKey: ['questions'],
        queryFn: () => {
            console.log('queryFn called');
            return fetch('https://private-9e5c7-reactdemo2.apiary-mock.com/questions').then((res) => {
                console.log('data returned', res.data);
                return res.json();
            });
        },
    });

    if (isLoading) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    const handleNavigate = () => {
        navigate('/questions/1');
    };
    const rows = data.map((item) => (
        <tr key={item.id} onClick={handleNavigate}>
            <td>{item.question}</td>
            <td>{item.type}</td>
        </tr>
    ));

    return (
        <section>
            <Stack spacing={'lg'}>
                <Title>Questions Page</Title>
                <Table striped highlightOnHover withBorder withColumnBorders>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Stack>
        </section>
    );
};

export default Questions;
