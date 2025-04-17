import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Moment from 'moment';
import { ArgumentAxis, Chart, BarSeries, ValueAxis, ZoomAndPan, Tooltip as DifferentTooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, Stack as ChartStack, ScatterSeries, Animation, ValueScale } from '@devexpress/dx-react-chart';
import { dSymbol, getVisibility } from '@devexpress/dx-chart-core';
import { Stack, Title, Container, Flex, Box, Text } from '@mantine/core';

const dateFormatter = (value) => {
    return Moment(value).format('MM/DD/YY');
};

const CustomTooltipContent = ({ targetItem, text, data }) => {
    // Extract argument and value from targetItem
    const { series, point } = targetItem;
    let argument, value;
    let item;

    if (point) {
        const dataIndex = point;
        argument = data[dataIndex] && data[dataIndex].gameDate;
        value = text;
        item = data[dataIndex];
    }
    // You can customize the tooltip content here
    return (
        <Container>
            <Text>{`Date: ${argument} `}</Text>
            <Text>{`Goals: ${item?.goals}`}</Text>
            <Text>{`Shots: ${item?.shots}`}</Text>
            <Text>{`Assists: ${item?.assists}`}</Text>
            <Text>{`PlusMinus: ${item?.plusMinus}`}</Text>
        </Container>
    );
};

const labelStyle = { fill: '#BBDEFB' };

interface CustomScatterPointProps {
    arg: number;
    val: number;
    rotated: boolean;
    animation?: any; // Add type for animation if needed
    argument?: string;
    value?: string;
    seriesIndex?: number;
    index?: number;
    state?: any; // Add type for state if needed
    point?: any; // Add type for pointOptions if needed
    color?: string;
    pane?: string;
    scales?: any; // Add type for scales if needed
    data: any[]; // Add type for data if needed
    shotscolor: string;
    assistscolor: string;
    goalscolor: string;
    scale?: number;
}

const CustomScatterPoint: React.FC<CustomScatterPointProps> = (props) => {
    const {
        arg,
        val,
        rotated,
        animation,
        argument,
        value,
        seriesIndex,
        index,
        state,
        point: pointOptions,
        color,
        pane,
        scales,
        data,
        shotscolor,
        assistscolor,
        goalscolor,
        scale = 6,
    } = props;
    const x = rotated ? val : arg;
    const y = rotated ? arg : val;
    const visibility = getVisibility(pane, x!, y!, 0, 0);
    const dataItem = data[index];
    return (
        <React.Fragment>
            <path
                transform={`translate(${x} ${y})`}
                d={dSymbol({ size: dataItem.shots * scale })}
                fill={shotscolor}
                visibility={visibility}
                stroke='none'
                {...props}
            />
            <path
                transform={`translate(${x} ${y})`}
                d={dSymbol({ size: dataItem.goals * scale })}
                fill={goalscolor}
                visibility={visibility}
                opacity={0.5}
                stroke='black'
                {...props}
            />
            <path
                transform={`translate(${x} ${y})`}
                d={dSymbol({ size: dataItem.assists * scale })}
                fill={assistscolor}
                opacity={0.25}
                visibility={visibility}
                stroke='white'
                {...props}
            />
        </React.Fragment>
    );
};

const Players: React.FC = (): JSX.Element => {
    Moment.locale('en');
    const [viewport, setViewport] = useState(undefined);
    const [targetItem, setTargetItem] = useState(undefined);

    const changeTargetItem = (newTargetItem) => {
        setTargetItem(newTargetItem);
    };

    const handleViewportChange = (newViewport) => {
        setViewport(newViewport);
    };

    const {
        isLoading,
        error,
        data: player1Data,
    } = useQuery({
        queryKey: ['player1-data'],
        queryFn: () => {
            return fetch('./assets/caufield.json')
                .then((res) => {
                    return res.json();
                })
                .then((json) => {
                    const transformedData = json.map((item) => {
                        return {
                            ...item,
                        };
                    });

                    // Find the maximum count
                    const maxCount = transformedData.reduce((max, item) => (item.goals > max ? item.goals : max), 0);

                    return { data: transformedData, maxCount };
                });
        },
    });

    const { data: player2Data } = useQuery({
        queryKey: ['player2-data'],
        queryFn: () => {
            return fetch('./assets/sid.json')
                .then((res) => {
                    return res.json();
                })
                .then((json) => {
                    const transformedData = json.map((item) => {
                        return {
                            ...item,
                        };
                    });

                    // Find the maximum count
                    const maxCount = transformedData.reduce((max, item) => (item.goals > max ? item.goals : max), 0);

                    return { data: transformedData, maxCount };
                });
        },
    });

    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred: + error.message</>;

    const modifyAxisDomain = () => [-5, 5];

    return (
        <section>
            <Header />
            <Stack>
                <Title>Cole Caufield </Title>
                <Chart data={player1Data.data} height={300}>
                    <ArgumentAxis showLabels={false} />
                    <ValueScale name='number' modifyDomain={modifyAxisDomain} />
                    <ValueAxis scaleName='number' />

                    <ScatterSeries
                        scaleName='number'
                        valueField='goals'
                        argumentField='gameDate'
                        pointComponent={(props) => (
                            <CustomScatterPoint
                                {...props}
                                data={player1Data.data}
                                shotsprop={'shots'}
                                goalsprop={'goals'}
                                goalscolor={'black'}
                                shotscolor={'skyBlue'}
                                assistscolor={'purple'}
                            />
                        )}
                    />

                    <BarSeries scaleName='number' valueField='plusMinus' argumentField='gameDate' />
                    <EventTracker />
                    <DifferentTooltip
                        targetItem={targetItem}
                        onTargetItemChange={changeTargetItem}
                        contentComponent={(props) => <CustomTooltipContent {...props} data={player1Data.data} />}
                    />
                </Chart>
                <Title>Sid</Title>
                <Chart data={player2Data.data} height={300}>
                    <ArgumentAxis showLabels={false} />
                    <ValueScale name='number' modifyDomain={modifyAxisDomain} />
                    <ValueAxis scaleName='number' />

                    <ScatterSeries
                        scaleName='number'
                        valueField='goals'
                        argumentField='gameDate'
                        pointComponent={(props) => (
                            <CustomScatterPoint
                                {...props}
                                data={player2Data.data}
                                shotsprop={'shots'}
                                goalsprop={'goals'}
                                goalscolor={'black'}
                                shotscolor={'skyBlue'}
                                assistscolor={'purple'}
                            />
                        )}
                    />

                    <BarSeries scaleName='number' valueField='plusMinus' argumentField='gameDate' />
                    <EventTracker />
                    <DifferentTooltip
                        targetItem={targetItem}
                        onTargetItemChange={changeTargetItem}
                        contentComponent={(props) => <CustomTooltipContent {...props} data={player2Data.data} />}
                    />
                </Chart>
            </Stack>
        </section>
    );
};

export default Players;
