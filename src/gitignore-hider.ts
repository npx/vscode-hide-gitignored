import { spawn } from "child_process";
import { join } from "path";
import { homedir } from "os";
import { commands, ExtensionContext, workspace, Uri } from 'vscode';

import { GitignoreReader } from './gitignore-reader';
import { PatternConverter } from './pattern-converter';
import { SettingsAccessor } from './settings-accessor';
import { Pattern } from "./pattern.model";

function expandHome(path: string): string {
    if (!path) return path;
    if (path == '~') return homedir();
    if (path.slice(0, 2) != '~/') return path;
    return join(homedir(), path.slice(2));
}

export class GitignoreHider {
    constructor(
        private _reader: GitignoreReader,
        private _converter: PatternConverter,
        private _settings: SettingsAccessor,
    ) { }

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

    private async getGlobalGitignore(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const commandExecuter = spawn('git', ['config', '--global', 'core.excludesfile']);
            let stdOutData = '';
            let stderrData = '';

            commandExecuter.stdout.on('data', (data) => stdOutData += data);
            commandExecuter.stderr.on('data', (data) => stderrData += data);
            commandExecuter.on('close', (code) => {
                code != 0 ? reject(stderrData.toString()) : resolve(stdOutData.toString().trim())
            })
        })
    }

    private async getGlobalPatterns(): Promise<Pattern[]> {
        try {
            const globalGitIgnore = expandHome(await this.getGlobalGitignore());
            const doc = await workspace.openTextDocument(Uri.file(globalGitIgnore));
            return this._converter.convert(this._reader.read(doc, true));
        } catch (error) {
            console.log('Unable to get global gitignore', error);
            return [];
        }
    }

    public async run(show = false): Promise<void> {
        const files = await workspace.findFiles('**/.gitignore');
        const globalPatterns = await this.getGlobalPatterns();

        if (files.length == 0 && globalPatterns.length == 0) {
            return;
        }

        const handlers = files.map(file => workspace.openTextDocument(file));
        const docs = await Promise.all(handlers);
        const patterns = docs
            .map(doc => this._reader.read(doc))
            .map(gitignore => this._converter.convert(gitignore))
            .reduce((prev, cur) => cur.concat(prev), []);

        if (show) {
            await this._settings.show(patterns.concat(globalPatterns));
        } else {
            await this._settings.hide(patterns.concat(globalPatterns));
        }
    }
}
