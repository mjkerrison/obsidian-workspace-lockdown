import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface WorkspaceLockdownSettings {
	pinProtectionEnabled: boolean;
}

const DEFAULT_SETTINGS: WorkspaceLockdownSettings = {
	pinProtectionEnabled: true
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

		// Add settings tab
		this.addSettingTab(new WorkspaceLockdownSettingTab(this.app, this));
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
	}
}
