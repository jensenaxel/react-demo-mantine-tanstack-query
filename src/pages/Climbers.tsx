import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import Moment from 'moment';
import { ArgumentAxis, Chart, LineSeries, ValueAxis, ZoomAndPan, Tooltip as DifferentTooltip } from '@devexpress/dx-react-chart-material-ui';
import Paper from '@mui/material/Paper';
import { EventTracker } from '@devexpress/dx-react-chart';

const dateFormatter = (value) => {
    return Moment(value).format('MM/DD hh:00 A');
};

const CustomTooltipContent = ({ targetItem, text, data }) => {
    // Extract argument and value from targetItem
    const { series, point } = targetItem;
    let argument, value;

    if (point) {
        const dataIndex = point;
        argument = data[dataIndex] && data[dataIndex].date_created;
        value = text;
    }
    // You can customize the tooltip content here
    return (
        <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid black' }}>
            <div>{`Date: ${argument} `}</div>
            <div>{`Count: ${value}`}</div>
        </div>
    );
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
    const [viewport, setViewport] = useState(undefined);
    const [targetItem, setTargetItem] = useState(undefined);

    const changeTargetItem = (newTargetItem) => {
        setTargetItem(newTargetItem);
    };

    const handleViewportChange = (newViewport) => {
        setViewport(newViewport);
    };

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

                    const filteredData = transformedData.filter((item, index, array) => {
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

                    return filteredData;
                });
        },
    });

    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred: + error.message</>;

    /*
    <LineChart width={350} height={200} data={data}>
                <XAxis dataKey='date_created' hide={true} />
                <YAxis dataKey='count' />
                <Tooltip content={<CustomTooltip />} />
                <Line type='monotone' dataKey='count' stroke='#8884d8' />
            </LineChart>
     */
    return (
        <section>
            <Header />
            <h1>Climbers Page</h1>
            <Paper>
                <Chart data={data}>
                    <ArgumentAxis showLabels={false} />
                    <ValueAxis />

                    <LineSeries valueField='count' argumentField='date_created' />
                    <EventTracker />
                    <DifferentTooltip
                        targetItem={targetItem}
                        onTargetItemChange={changeTargetItem}
                        contentComponent={(props) => <CustomTooltipContent {...props} data={data} />}
                    />
                    <ZoomAndPan viewport={viewport} onViewportChange={handleViewportChange} />
                </Chart>
            </Paper>

            <div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </section>
    );
};

export default Climbers;
