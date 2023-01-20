import React from 'react';

import Layout from './Layout';
import routes from '../routes';
import { AppContextProvider } from '../hooks/useAppContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

const App = (): JSX.Element => {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContextProvider>
                <Layout>{routes}</Layout>
            </AppContextProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
