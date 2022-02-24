import { Uri, window, workspace, WorkspaceFolder } from 'vscode';

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

    public static getActiveWorkspaceFolder(): WorkspaceFolder | undefined {
        const editorResource = WorkspaceUtils.getActiveWorkspaceResource();
        if (!editorResource) {
            return;
        }
        return workspace.getWorkspaceFolder(editorResource);
    }
}
