import React, { createContext, useContext, useState } from 'react';

interface AppContextProps {
    countIncrement: React.Dispatch<React.SetStateAction<number>>;
    count: number;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
    opened: boolean;
}

interface AppContextProviderProps {
    children: React.ReactNode;
}

export const AppContext = createContext<AppContextProps>({
    countIncrement: () => 0,
    count: 0,
    opened: false,
    setOpened: () => false,
});

const AppContextProvider = ({ children }: AppContextProviderProps): JSX.Element => {
    const [count, countIncrement] = useState(0);
    const [opened, setOpened] = useState(false);

    return <AppContext.Provider value={{ count, countIncrement, opened, setOpened }}>{children}</AppContext.Provider>;
};

const useAppContext = (): AppContextProps => {
    return useContext(AppContext);
};

export { AppContextProvider, useAppContext };
