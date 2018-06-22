import { workspace, WorkspaceConfiguration } from 'vscode';

import { Pattern } from './pattern.model';

/**
 * Handles editing a workspace settings file
 *
 * @export
 * @class SettingsAccessor
 */
export class SettingsAccessor {
    public async hide(patterns: Pattern[]): Promise<void> {
        const settings = workspace.getConfiguration();
        const hidden = this.getWorkspaceValue(settings);
        const newSettings = Object.assign(hidden || {}, this._buildSettingsObject(patterns));
        settings.update('files.exclude', newSettings);
    }

    public async show(patterns: Pattern[]): Promise<void> {
        const settings = workspace.getConfiguration();
        const hidden = this.getWorkspaceValue(settings);

        if (!hidden) {
            return;
        }

        // keep excluded files that arent excluded via gitignore
        const show = this._buildSettingsObject(patterns);
        const newSettings = {};
        for (const key in hidden) {
            if (key in show) {
                continue;
            }
            newSettings[key] = hidden[key];
        } 

        settings.update('files.exclude', newSettings);
    }

    private getWorkspaceValue(settings: WorkspaceConfiguration): any | undefined {
        return settings.inspect('files.exclude').workspaceValue;
    }

    private _buildSettingsObject(patterns: Pattern[]): any {
        const object = {};
        patterns.forEach((pattern) => (object[pattern.glob] = pattern.hide));
        return object;
    }
}
