import { commands, workspace, TextDocument, Uri } from 'vscode';

import { GitignoreReader } from './gitignore-reader';
import { PatternConverter } from './pattern-converter';
import { SettingsAccessor } from './settings-accessor';

import * as fs from 'fs';

export class GitignoreHider {
    constructor(
        private _reader: GitignoreReader,
        private _converter: PatternConverter,
        private _settings: SettingsAccessor,
    ) {}

    public registerCommands(): void {
        const settings = workspace.getConfiguration();
        const addGitInfoExclude = settings.get('hide-gitignored.include.git/info/exclude', false);

        commands.registerCommand('extension.hideGitignored', () => {
            this.run(false, addGitInfoExclude);
        });

        commands.registerCommand('extension.showGitignored', () => {
            this.run(true, addGitInfoExclude);
        });

        commands.registerCommand('extension.enableHideOnSave', () => {
            settings.update('hide-gitignored.HideOnSave', true);
        });

        commands.registerCommand('extension.disableHideOnSave', () => {
            settings.update('hide-gitignored.HideOnSave', false);
        });

        workspace.onDidSaveTextDocument((document: TextDocument) => {
            if (
                settings.get('hide-gitignored.HideOnSave', true) &&
                !!document.fileName.match(/^.*(\.gitignore|\.git.info.exclude)$/g)
            ) {
                this.run(false, addGitInfoExclude);
            }
        });
    }

    public async run(show: boolean, addGitInfoExclude: boolean): Promise<void> {
        let files = await workspace.findFiles('**/.gitignore');

        if (addGitInfoExclude) {
            const folders = workspace.workspaceFolders;
            if (folders != undefined) {
                files = files.concat(
                    folders
                        .map(folder => Uri.file(folder.uri.path + '/.git/info/exclude'))
                        .filter(file => fs.existsSync(file.fsPath)),
                );
            }
        }

        if (files.length < 1) {
            return;
        }

        const handlers = files.map(file => workspace.openTextDocument(file));
        const docs = await Promise.all(handlers);

        const patterns = docs
            .map(doc => this._reader.read(doc))
            .map(gitignore => this._converter.convert(gitignore))
            .reduce((prev, cur) => cur.concat(prev), []);

        if (show) {
            await this._settings.show(patterns);
        } else {
            await this._settings.hide(patterns);
        }
    }
}
