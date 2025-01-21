import { createElement, FC } from 'react';
import { useApp } from './hooks';
import { Platform } from 'obsidian';

export const ReactView: FC = () => {
    const app = useApp();
    
    return (
        <div className="example-view-container">
            <h4>Current Vault: {app.vault.getName()}</h4>
            
            {/* Example of accessing more app functionalities */}
            <div>
                <h5>Workspace Info:</h5>
                <p>Active Leaf: {app.workspace.activeLeaf?.getDisplayText()}</p>
                <p>Is Mobile: {Platform.isMobile ? 'Yes' : 'No'}</p>
            </div>
        </div>
    );
};