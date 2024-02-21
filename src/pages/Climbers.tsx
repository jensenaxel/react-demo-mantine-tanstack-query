import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import Moment from 'moment';

const dateFormatter = (value) => {
    return Moment(value).format('MM/DD hh:00 A');
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ padding: '10px', color: 'black' }}>
                <p>{`Date: ${label}`}</p>
                <p>{`Count: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const Climbers: React.FC = (): JSX.Element => {
    Moment.locale('en');

    console.log('re-render tanstack');
    const { isLoading, error, data } = useQuery({
        queryKey: ['climbers-data'],
        queryFn: () => {
            console.log('tanstack queryFn called');
            return fetch('https://reauslgov7.execute-api.us-east-1.amazonaws.com/prod/get-all-climbers')
                .then((res) => {
                    console.log('data returned', res);
                    return res.json();
                })
                .then((json) => {
                    // Manipulate the data here
                    // For example, transform the date format
                    const transformedData = json.map((item) => ({
                        ...item,
                        date_created: new Date(item.date_created).toLocaleString(), // Convert to local date format
                    }));

                    return transformedData.filter((item, index, array) => {
                        // Check if the current count is zero
                        if (item.count === 0) {
                            // If the previous count was not zero or it's the first item, keep it
                            if (index === 0 || array[index - 1].count !== 0) {
                                return true;
                            }
                            // Otherwise, skip this zero count
                            return false;
                        }
                        // Keep non-zero counts
                        return true;
                    });
                });
        },
    });

    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred: + error.message</>;

    return (
        <section>
            <Header />
            <h1>Climbers Page</h1>
            <LineChart width={400} height={200} data={data}>
                <XAxis dataKey='date_created' hide={true} />
                <YAxis dataKey='count' />
                <Tooltip content={<CustomTooltip />} />
                <Line type='monotone' dataKey='count' stroke='#8884d8' />
            </LineChart>
            <div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </section>
    );
};

export default Climbers;
