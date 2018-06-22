import { commands, ExtensionContext, workspace } from 'vscode';

import { GitignoreReader } from './gitignore-reader';
import { PatternConverter } from './pattern-converter';
import { SettingsAccessor } from './settings-accessor';

export class GitignoreHider {
    constructor(
        private _reader: GitignoreReader,
        private _converter: PatternConverter,
        private _settings: SettingsAccessor,
    ) {}

    public registerCommands(context: ExtensionContext): void {
        const hideDisposable = commands.registerCommand('extension.hideGitignored', () => {
            this.run();
        });
        context.subscriptions.push(hideDisposable);

        const showDisposable = commands.registerCommand('extension.showGitignored', () => {
            this.run(true);
        });
        context.subscriptions.push(showDisposable);
    }

    public async run(show = false): Promise<void> {
        const files = await workspace.findFiles('**/.gitignore');

        if (files.length < 1) {
            return;
        }

        const handlers = files.map((file) => workspace.openTextDocument(file));
        const docs = await Promise.all(handlers);

        const patterns = docs
            .map((doc) => this._reader.read(doc))
            .map((gitignore) => this._converter.convert(gitignore))
            .reduce((prev, cur) => cur.concat(prev), []);

        if (show) {
            await this._settings.show(patterns);
        } else {
            await this._settings.hide(patterns);
        }
    }
}
