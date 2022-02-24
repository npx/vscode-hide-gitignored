import { Uri, window, workspace, WorkspaceConfiguration } from 'vscode';

/**
 * Returns active workspace resource to be used by `workspace.getConfiguration(..., scope)`
 *
 * @export
 * @class WorkspaceUtils
 */
export class WorkspaceUtils {
    public static getActiveWorkspaceResource(): Uri | undefined {
        const editor = window.activeTextEditor;

        if (!editor || !workspace.workspaceFolders) {
            return;
        }
        return editor.document.uri;
    }
}
