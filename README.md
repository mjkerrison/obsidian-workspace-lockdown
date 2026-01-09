# Workspace Lockdown

An Obsidian plugin to prevent accidental workspace changes and keep your layout clean.

## Features

### Suppress Unwanted Sidebar Panes

Automatically close specific view types on startup. Useful for panes that keep reappearing even after you close them (like "All properties" or "Outgoing links").

Configure in Settings > Workspace Lockdown > **Suppressed view types**

Common view types to suppress:
- `all-properties` - the global properties view (default)
- `outgoing-link` - outgoing links pane
- `backlink` - backlinks pane
- `tag-pane` - tags view

### Pin Protection

Prevents accidental unpinning of tabs by disabling clicks on pin icons. You can still unpin tabs via the right-click context menu.

Toggle in Settings > Workspace Lockdown > **Protect pin icons**

### Close Tab in Main Pane

A command that closes the active tab only in the main pane, leaving sidebar tabs untouched. Useful as a keyboard shortcut replacement for Ctrl/Cmd+W.

Access via Command Palette: **Workspace Lockdown: Close tab in main pane**

## Installation

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create a folder called `workspace-lockdown` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into that folder
4. Reload Obsidian and enable the plugin in Settings > Community plugins

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Protect pin icons | Disable clicking on pin icons to prevent accidental unpinning | Enabled |
| Suppressed view types | Comma-separated list of view types to auto-close on startup | `all-properties` |

## License

MIT
