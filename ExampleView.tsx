import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { AppContext } from './context';
import { ReactView } from './ReactView';

export class ExampleView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return 'example-view';
    }

    getDisplayText() {
        return 'Example view';
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            <React.StrictMode>
                <AppContext.Provider value={this.app}>
                    <ReactView />
                </AppContext.Provider>
            </React.StrictMode>
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}