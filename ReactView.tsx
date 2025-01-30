import React from 'react';
import { useApp } from './context';
import RoutineBuilder from './RoutineBuilder';

export const ReactView = () => {
    const app = useApp(); // Access the App instance here if needed

    return (
        <div className="routine-builder-container">
            <RoutineBuilder />
        </div>
    );
};
