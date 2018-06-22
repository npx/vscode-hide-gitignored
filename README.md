# hide-gitignored

Hide files from the file Explorer that are ignored by your workspace's 
`.gitignore` files.

Upon running the registered command, the workspace's `.gitignore` files are
read and converted to `files.exclude` rules that vscode can interpret.
Your workspace settings will be created or updated.

## Acknowledgement

Credit goes to [vscode-ignore-gitignore](https://github.com/stubailo/vscode-ignore-gitignore),
which unfortunately is not maintained anymore. I have been given 
[permission](https://github.com/stubailo/vscode-ignore-gitignore/pull/7#issuecomment-343804588) to
re-release.

## TODO
* run on saving .gitignore files [+ setting]
* tests
