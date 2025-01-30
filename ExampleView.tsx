import React from 'react';
import ReactDOM from 'react-dom';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot } from 'react-dom/client';
import { AppContext } from './AppContext'; // Import AppContext
import { ReactView } from './ReactView'; // Your React component

const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {

    private root: ReturnType<typeof createRoot> | undefined;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_EXAMPLE;
    }

    getDisplayText() {
        return 'Example view';
    }

    async onOpen() {
        const container = this.contentEl.createDiv(); // Create a div to render React inside
        this.root = createRoot(container); // Create a React root (only if using React 18)
        this.root.render(
            <AppContext.Provider value={this.app}>
                <ReactView /> {/* Your React component */}
            </AppContext.Provider>
        );
    }
    
    async onClose() {
        if (this.root) {
            this.root.unmount(); // Unmount the React component when the view is closed
        }
    }
}
