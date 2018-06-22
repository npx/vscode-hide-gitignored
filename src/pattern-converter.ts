import { Gitignore } from './gitignore.model';
import { Pattern } from './pattern.model';

/**
 * Converts .gitignore lines to vscode-style ignore pattern
 *
 * @export
 * @class PatternConverter
 */
export class PatternConverter {
    /**
     * Convert a Gitignore to a Pattern[]
     *
     * @param {Gitignore} gitgnore
     * @returns {Pattern[]}
     * @memberof PatternConverter
     */
    public convert(gitignore: Gitignore): Pattern[] {
        return gitignore.lines
            .map((line) => this._convertToPattern(line, gitignore.path))
            .filter((line) => line !== void 0) as Pattern[];
    }

    /**
     * Convert single .gitignore line to vscode-style pattern
     *
     * @private
     * @param {string} line
     * @param {string} path
     * @returns {(Pattern | void)}
     * @memberof PatternConverter
     */
    private _convertToPattern(line: string, path: string): Pattern | void {
        if (this._canBeIgnored(line)) {
            return;
        }

        let text = line;

        const isNegated = text.startsWith('!');
        const hide = !isNegated;
        if (isNegated) {
            text = text.substr(1);
        }

        let glob = text;
        if (text.startsWith('/')) {
            glob = text.substr(1);
        } else if (
            !text.startsWith('**') &&
            (text.indexOf('/') < 0 || text.endsWith('/'))
        ) {
            glob = `**/${glob}`;
        }

        // prefix with path
        glob = path !== '.' ? `${path}/${glob}` : glob;

        return { glob, hide, line };
    }

    /**
     * Check if the given line does not need to be converted
     *
     * @private
     * @param {string} line
     * @returns {boolean}
     * @memberof PatternConverter
     */
    private _canBeIgnored(line: string): boolean {
        return line.indexOf('#') === 0 || line.length < 1;
    }
}
