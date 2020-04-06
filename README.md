# hide-gitignored

Hide files from the file Explorer that are ignored by your workspace's 
`.gitignore` files.

Upon running the registered command, the workspace's `.gitignore` files are
read and converted to `files.exclude` rules that vscode can interpret.
You can include even the rules in `.git/info/exclude` file and you can run
automatically run the command every time a `.gitignore` file is saved.
Your workspace settings will be created or updated.

ATTENTION if there are more than one workspaceFolders settings.json file is not
update anymore but is used workspace setting(.code-workspace file), this however
dosen't work(see because in #48262 or #50638 issue vscode repo).

## Acknowledgement

Credit goes to [vscode-ignore-gitignore](https://github.com/stubailo/vscode-ignore-gitignore),
which unfortunately is not maintained anymore. I have been given 
[permission](https://github.com/stubailo/vscode-ignore-gitignore/pull/7#issuecomment-343804588) to
re-release.

## TODO
* ~~run on saving .gitignore files [+ setting]~~
* resolve problem with more than one workspaceFolders
* tests
