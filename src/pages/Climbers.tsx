import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Moment from 'moment';
import { ArgumentAxis, Chart, BarSeries, ValueAxis, ZoomAndPan, Tooltip as DifferentTooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import { Stack, Title, Container, Flex, Box, Text } from '@mantine/core';

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
        <Container>
            <Text>{`Date: ${argument} `}</Text>
            <Text>{`Count: ${value}`}</Text>
        </Container>
    );
};

const CustomBar = ({ label, value, prevDate, maxCount }) => {
    let scale = 1;
    const showDate = prevDate?.split(',')[0] !== label.split(',')[0]; // Check if it's the same date as the previous one
    const hours = label.split(',')[1];

    if (maxCount >= 50 && maxCount < 75) scale = 2;
    if (maxCount >= 25 && maxCount < 50) scale = 3;
    if (maxCount < 25) scale = 4;

    const barWidth = value * scale;

    return (
        <Flex w={400} m={0}>
            <Flex w='60%' direction={'row'} justify={'space-evenly'}>
                {showDate ? (
                    <Text w={175} align={'right'}>
                        {label}
                    </Text>
                ) : (
                    <Text w={175} align={'right'}>
                        {hours}
                    </Text>
                )}
                <Text w={25}> {value}</Text>
            </Flex>
            <Flex w='40%' align={'center'}>
                <Box w={`${barWidth}%`} h={18} bg='blue' color='blue'></Box>
            </Flex>
        </Flex>
    );
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
            return fetch('https://reauslgov7.execute-api.us-east-1.amazonaws.com/prod/get-all-climbers')
                .then((res) => {
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

                    // Find the maximum count
                    const maxCount = filteredData.reduce((max, item) => (item.count > max ? item.count : max), 0);

                    return { data: filteredData, maxCount };
                });
        },
    });

    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred: + error.message</>;

    return (
        <section>
            <Header />
            <Stack>
                <Title>Climbers </Title>
                <Chart data={data.data}>
                    <ArgumentAxis showLabels={false} />
                    <ValueAxis />

                    <BarSeries valueField='count' argumentField='date_created' />
                    <EventTracker />
                    <DifferentTooltip
                        targetItem={targetItem}
                        onTargetItemChange={changeTargetItem}
                        contentComponent={(props) => <CustomTooltipContent {...props} data={data.data} />}
                    />
                    <ZoomAndPan viewport={viewport} onViewportChange={handleViewportChange} />
                </Chart>
                <Stack spacing={0}>
                    {data.data.map((item, index, array) => (
                        <CustomBar
                            key={index}
                            label={item.date_created}
                            value={item.count}
                            prevDate={index > 0 ? array[index - 1].date_created : null} // Pass the previous date
                            maxCount={data.maxCount}
                        />
                    ))}
                </Stack>
            </Stack>
        </section>
    );
};

export default Climbers;
