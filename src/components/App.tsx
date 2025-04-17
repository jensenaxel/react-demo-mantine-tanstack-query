import React, { useEffect } from 'react';

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
    useEffect(() => {
        const scriptId = 'brightcove-player-sdk';

        // Prevent duplicate script
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://players.brightcove.net/6415718365001/D3UCGynRWU_default/index.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);
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
