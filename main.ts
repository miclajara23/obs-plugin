import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, MarkdownFileInfo } from 'obsidian';
import { createElement, StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ReactView } from './ReactView';
import { AppContext } from './hooks';
import { ErrorBoundary } from './ErrorBoundary';

// Define view type constant
const VIEW_TYPE_EXAMPLE = 'example-view';

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

// Create ExampleView class for React integration
class ExampleView extends ItemView {
    root: Root | null = null;

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
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            createElement(StrictMode, null,
                createElement(AppContext.Provider, { value: this.app },
                    createElement(ReactView)
                )
            )
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        console.log('Loading plugin');
        await this.loadSettings();

        // Register the custom view type
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

        // Previous plugin code...
        const statusBarItemEl = this.addStatusBarItem();
        statusBarItemEl.setText('Status Bar Text');

        this.addCommand({
            id: 'open-sample-modal-simple',
            name: 'Open sample modal (simple)',
            callback: () => {
                new SampleModal(this.app).open();
            }
        });

        this.addCommand({
            id: 'sample-editor-command',
            name: 'Sample editor command',
            editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
                if (ctx instanceof MarkdownView) {
                    console.log(editor.getSelection());
                    editor.replaceSelection('Sample Editor Command');
                }
            }
        });

        this.addSettingTab(new SampleSettingTab(this.app, this));

        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('click', evt);
        });

        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    async onunload() {
        console.log('Unloading plugin');
    }

    // Helper method to activate the React view
    async activateView() {
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

// Existing Modal and Settings classes remain unchanged
class SampleModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.setText('Woah!');
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class SampleSettingTab extends PluginSettingTab {
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