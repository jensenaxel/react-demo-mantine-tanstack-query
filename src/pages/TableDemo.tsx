import React from 'react';
import { Table, Title, Stack } from '@mantine/core';
import { useTable } from 'react-table';
import { useQuery } from '@tanstack/react-query';

/* eslint-disable */

const TableDemo: React.FC = (): JSX.Element => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['questions'],
        queryFn: () => {
            return fetch('https://private-9e5c7-reactdemo2.apiary-mock.com/questions').then((res) => {
                return res.json();
            });
        },
    });

    const columns = React.useMemo(
        () => [
            {
                Header: 'Question',
                accessor: 'question', // accessor is the "key" in the data
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred: + error.message</>;

    return (
        <section>
            <Stack spacing={'lg'}>
                <Title>Questions Page</Title>
                <Title size={'sm'} color={'dimmed'}>
                    Select a question to edit
                </Title>
                <Table {...getTableProps()} striped highlightOnHover withBorder withColumnBorders>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Stack>
        </section>
    );
};

export default TableDemo;
