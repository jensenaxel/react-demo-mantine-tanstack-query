import React from 'react';

import { useAppContext } from '../hooks/useAppContext';

const Home: React.FC = (): JSX.Element => {
    const { count } = useAppContext();

    return (
        <section>
            <h1>Welcome!</h1>
            <p>Current count: {count}</p>
        </section>
    );
};

export default Home;
