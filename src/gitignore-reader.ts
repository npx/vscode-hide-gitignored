import { TextDocument } from 'vscode';

/**
 * Read the .gitignore file line-by-line
 *
 * @export
 * @class GitignoreReader
 */
export class GitignoreReader {
    /**
     * Read Textdocument into a string array
     *
     * @param {TextDocument} document
     * @returns {string[]}
     * @memberof GitignoreReader
     */
    public read(document: TextDocument): string[] {
        const lineCount = document.lineCount;
        const lines: string[] = [];
        for (let index = 0; index < lineCount; index++) {
            lines.push(document.lineAt(index).text);
        }
        return lines;
    }
}
