import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface WorkspaceLockdownSettings {
	pinProtectionEnabled: boolean;
	suppressedViewTypes: string[];
}

const DEFAULT_SETTINGS: WorkspaceLockdownSettings = {
	pinProtectionEnabled: true,
	suppressedViewTypes: ['all-properties']
};

const PIN_PROTECTION_CLASS = 'workspace-lockdown-pin-protection';

export default class WorkspaceLockdownPlugin extends Plugin {
	settings: WorkspaceLockdownSettings;

	async onload() {
		await this.loadSettings();

		// Register the "Close tab in main pane" command
		this.addCommand({
			id: 'close-tab-in-main-pane',
			name: 'Close tab in main pane',
			callback: () => {
				const leaf = this.app.workspace.getMostRecentLeaf(this.app.workspace.rootSplit);
				if (leaf) {
					leaf.detach();
				}
			}
		});

		// Apply pin protection on load
		this.updatePinProtection();

		// Close suppressed view types when layout is ready
		this.app.workspace.onLayoutReady(() => {
			this.closeSuppressedViews();
		});

		// Add settings tab
		this.addSettingTab(new WorkspaceLockdownSettingTab(this.app, this));
	}

	closeSuppressedViews() {
		if (this.settings.suppressedViewTypes.length === 0) return;

		// Iterate through all leaves and close any with suppressed view types
		this.app.workspace.iterateAllLeaves((leaf) => {
			const viewType = leaf.view?.getViewType();
			if (viewType && this.settings.suppressedViewTypes.includes(viewType)) {
				leaf.detach();
			}
		});
	}

	onunload() {
		// Remove pin protection class when plugin is disabled
		document.body.removeClass(PIN_PROTECTION_CLASS);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	updatePinProtection() {
		if (this.settings.pinProtectionEnabled) {
			document.body.addClass(PIN_PROTECTION_CLASS);
		} else {
			document.body.removeClass(PIN_PROTECTION_CLASS);
		}
	}
}

class WorkspaceLockdownSettingTab extends PluginSettingTab {
	plugin: WorkspaceLockdownPlugin;

	constructor(app: App, plugin: WorkspaceLockdownPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Protect pin icons')
			.setDesc('Disable clicking on pin icons to prevent accidentally unpinning tabs. You can still unpin via right-click menu.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.pinProtectionEnabled)
				.onChange(async (value) => {
					this.plugin.settings.pinProtectionEnabled = value;
					await this.plugin.saveSettings();
					this.plugin.updatePinProtection();
				}));

		new Setting(containerEl)
			.setName('Suppressed view types')
			.setDesc('Comma-separated list of view types to auto-close on startup (e.g., "all-properties, outgoing-link, backlink").')
			.addText(text => text
				.setPlaceholder('all-properties')
				.setValue(this.plugin.settings.suppressedViewTypes.join(', '))
				.onChange(async (value) => {
					this.plugin.settings.suppressedViewTypes = value
						.split(',')
						.map(s => s.trim())
						.filter(s => s.length > 0);
					await this.plugin.saveSettings();
				}));
	}
}
