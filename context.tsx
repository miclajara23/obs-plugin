import React, { createContext, useContext } from 'react';
import { App } from 'obsidian';

const AppContext = createContext<App | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppContext.Provider');
    return context;
};

export { AppContext }; 