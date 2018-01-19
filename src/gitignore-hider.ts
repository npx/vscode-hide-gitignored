import { commands, ExtensionContext, TextDocument, workspace } from 'vscode';

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
        let disposable = commands.registerCommand('extension.hideGitignored', () => {
            this.run();
        });

        context.subscriptions.push(disposable);
    }

    public async run(): Promise<void> {
        const files = await workspace.findFiles('.gitignore');

        // TODO support multiple .gitignore files in subfolders
        if (files.length < 1) {
            return;
        }

        const document = await workspace.openTextDocument(files.pop());
        await this._exec(document);
    }

    private async _exec(document: TextDocument): Promise<void> {
        const lines = this._reader.read(document);
        const patterns = this._converter.convert(lines);
        // patterns.forEach((pattern) =>
        //     console.log(`${pattern.line} -> ${pattern.glob} (= ${pattern.hide})`),
        // );
        this._settings.update(patterns);
    }
}
