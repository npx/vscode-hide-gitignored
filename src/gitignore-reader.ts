import { dirname } from 'path';
import { TextDocument, workspace } from 'vscode';

import { Gitignore } from './gitignore.model';

/**
 * Read the .gitignore file line-by-line
 *
 * @export
 * @class GitignoreReader
 */
export class GitignoreReader {
    /**
     * Read TextDocument into a string array, wrapped in Gitignore
     *
     * @param {TextDocument} document
     * @returns {Gitignore}
     * @memberof GitignoreReader
     */
    public read(document: TextDocument): Gitignore {
        const lineCount = document.lineCount;
        const lines: string[] = [];
        for (let index = 0; index < lineCount; index++) {
            lines.push(document.lineAt(index).text);
        }
        const path = dirname(workspace.asRelativePath(document.fileName));
        return { lines, path };
    }
}
