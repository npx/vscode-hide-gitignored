import { ExtensionContext } from 'vscode';

import { GitignoreHider } from './gitignore-hider';
import { GitignoreReader } from './gitignore-reader';
import { PatternConverter } from './pattern-converter';
import { SettingsAccessor } from './settings-accessor';

export function activate(context: ExtensionContext): void {
    const gitignoreHider = new GitignoreHider(
        new GitignoreReader(),
        new PatternConverter(),
        new SettingsAccessor(context),
    );
    gitignoreHider.registerCommands();
}

export function deactivate(): void {}
