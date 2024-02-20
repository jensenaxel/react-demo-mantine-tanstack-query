import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Moment from 'moment';

const dateFormatter = ({ value }) => {
    return <span>{Moment(value).format('d MMM')}</span>;
};

const Climbers: React.FC = (): JSX.Element => {
    Moment.locale('en');

    console.log('re-render tanstack');
    const { isLoading, error, data } = useQuery({
        queryKey: ['climbers-data'],
        queryFn: () => {
            console.log('tanstack queryFn called');
            return fetch('https://reauslgov7.execute-api.us-east-1.amazonaws.com/prod/get-all-climbers').then((res) => {
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
            <h1>Climbers Page</h1>
            <LineChart width={500} height={300} data={data}>
                <XAxis dataKey='date_created' hide={true} />
                <YAxis dataKey='count' />
                <Tooltip />
                <Line type='monotone' dataKey='count' stroke='#8884d8' />
            </LineChart>
            <div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </section>
    );
};

export default Climbers;
