import React from 'react';

import { useAppContext } from '../hooks/useAppContext';
import { Button } from '@mantine/core';

const Count: React.FC = (): JSX.Element => {
    const { count, countIncrement } = useAppContext();

    console.log('re-render count');
    return (
        <section>
            <>
                <h1>Count Page</h1>
                <Button onClick={() => countIncrement(count + 1)}>
                    Increment
                </Button>
                <p>Current Count: {count}</p>
            </>
        </section>
    );
};

export default Count;
