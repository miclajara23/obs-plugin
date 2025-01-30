import React, { createContext, useContext } from 'react';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot } from 'react-dom/client'; // For React integration
import RoutineBuilder from './RoutineBuilder'; // Adjust the path as necessary

// AppContext for React
const AppContext = createContext<App | null>(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppContext.Provider');
    }
    return context;
};

export { AppContext };

// Define view type constant
const VIEW_TYPE_EXAMPLE = 'example-view';

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

// Create ExampleView class for React integration
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
        console.log("Opening ExampleView...");
        const container = this.contentEl.createDiv();
        this.root = createRoot(container);
        
        this.root.render(
            React.createElement(AppContext.Provider, { value: this.app }, 
                React.createElement(MyReactView, { app: this.app })
            )
        );
    }
    
    async onClose() {
        if (this.root) {
            this.root.unmount(); // Unmount the React component when the view is closed
        }
    }
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        console.log('Loading plugin');
        await this.loadSettings();

        // Register the custom view type for React view
        this.registerView(
            VIEW_TYPE_EXAMPLE,
            (leaf: WorkspaceLeaf) => new ExampleView(leaf)
        );

        // Add command to open the React view
        this.addCommand({
            id: 'open-react-view',
            name: 'Open React View',
            callback: async () => {
                const { workspace } = this.app;
                
                // Check if view is already open
                const existingView = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0];
                if (existingView) {
                    workspace.revealLeaf(existingView);
                    return;
                }

                // Open new leaf and show view
                const newLeaf = workspace.getRightLeaf(false);
                if (!newLeaf) return;
                await newLeaf.setViewState({
                    type: VIEW_TYPE_EXAMPLE,
                    active: true,
                });
            },
        });

        // Add ribbon icon to open React view
        this.addRibbonIcon('dice', 'Toggle React View', (evt: MouseEvent) => {
            const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0];
            if (leaf) {
                // If view exists, close it
                leaf.detach();
            } else {
                // If view doesn't exist, open it
                this.activateView();
            }
        });

        const statusBarItemEl = this.addStatusBarItem();
        statusBarItemEl.setText('Status Bar is active');

        // Use the concrete class for settings tab
        this.addSettingTab(new MySettingTab(this.app, this));

        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('Document clicked', evt);
        });
    }

    async onunload() {
        console.log('Unloading plugin');
    }

    async activateView() {
        console.log("Activating view...");
        const { workspace } = this.app;
        
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0];
        
        if (!leaf) {
            const newLeaf = workspace.getRightLeaf(false);
            if (!newLeaf) return;
            leaf = newLeaf;
            await leaf.setViewState({
                type: VIEW_TYPE_EXAMPLE,
                active: true,
            });
        }
        
        workspace.revealLeaf(leaf);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
interface RoutineBuilderProps {
    app: App;
}

// Define the props interface
interface MyReactViewProps {
    app: App; // Assuming 'App' is the type of the app instance
}

// Rename the local component to avoid conflict
const MyReactView: React.FC<MyReactViewProps> = ({ app }) => {
    const appContext = useApp();

    return React.createElement("div", null, 
        React.createElement("h1", null, `Vault name: ${appContext.vault.getName()}`),
        React.createElement(RoutineBuilder as React.ComponentType<RoutineBuilderProps>, { app: appContext })
    );
};

class MySettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
