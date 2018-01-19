import { workspace } from 'vscode';

import { Pattern } from './pattern.model';

/**
 * Handles editing a workspace settings file
 *
 * @export
 * @class SettingsAccessor
 */
export class SettingsAccessor {
    public async update(patterns: Pattern[]): Promise<void> {
        const settings = workspace.getConfiguration();
        settings.update('files.exclude', this._buildSettingsObject(patterns));
    }

    private _buildSettingsObject(patterns: Pattern[]): any {
        const object = {};
        patterns.forEach((pattern) => (object[pattern.glob] = pattern.hide));
        return object;
    }
}
