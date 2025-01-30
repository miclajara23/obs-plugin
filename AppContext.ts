import { createContext, useContext } from 'react';
import { App } from 'obsidian';

const AppContext = createContext<App | null>(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export { AppContext };