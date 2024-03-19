import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Chart, ArgumentAxis, ValueAxis, LineSeries, ZoomAndPan } from '@devexpress/dx-react-chart-material-ui';

const generateData = (n) => {
    const ret = [];
    let y = 0;
    for (let i = 0; i < n; i += 1) {
        y += Math.round(Math.random() * 10 - 5);
        ret.push({ x: `${i}`, y });
    }
    return ret;
};

const NotClimbers = () => {
    const [viewport, setViewport] = useState(undefined);
    const [data] = useState(generateData(100));

    const handleViewportChange = (newViewport) => {
        setViewport(newViewport);
    };

    return (
        <Paper>
            <Chart data={data}>
                <ArgumentAxis />
                <ValueAxis />

                <LineSeries valueField='y' argumentField='x' />
                <ZoomAndPan viewport={viewport} onViewportChange={handleViewportChange} />
            </Chart>
        </Paper>
    );
};

export default NotClimbers;
