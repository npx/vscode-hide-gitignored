import { workspace, WorkspaceConfiguration, ExtensionContext } from 'vscode';

import { Pattern } from './pattern.model';

/**
 * Handles editing a workspace settings file
 *
 * @export
 * @class SettingsAccessor
 */
export class SettingsAccessor {
    constructor(private _context: ExtensionContext) {}

    public async hide(patterns: Pattern[]): Promise<void> {
        const settings = workspace.getConfiguration();
        const hidden = this.getWorkspaceValue(settings);

        // I delete the keys that are elements of hide-gitignored.fromgitingnore
        // hide-gitignored.fromgitingnore memorize the elements previously contained in the .gitignore
        const oldSettings = this._context.workspaceState.get('hide-gitignored.fromgitingnore', []);
        oldSettings.forEach(e => delete hidden[e]);

        // then regenerate the elements of hide-gitignored.fromgitingnore
        const newSettings = this._buildSettingsObject(patterns);
        this._context.workspaceState.update(
            'hide-gitignored.fromgitingnore',
            Object.keys(newSettings),
        );

        //add new the elements in files.exclude
        settings.update('files.exclude', Object.assign({}, newSettings, hidden));
    }

    public async show(patterns: Pattern[]): Promise<void> {
        const settings = workspace.getConfiguration();
        const hidden = this.getWorkspaceValue(settings);

        if (!hidden) {
            return;
        }

        // keep excluded files that arent excluded via gitignore
        // if they're not here, it means they're visible
        const oldSettings = this._context.workspaceState.get('hide-gitignored.fromgitingnore', []);
        oldSettings.forEach(e => delete hidden[e]);

        settings.update('files.exclude', hidden);
    }

    private getWorkspaceValue(settings: WorkspaceConfiguration): any {
        return settings.inspect('files.exclude')?.workspaceValue || {};
    }

    private _buildSettingsObject(patterns: Pattern[]): any {
        const object: any = {};
        patterns.forEach(pattern => (object[pattern.glob] = pattern.hide));
        return object;
    }
}
