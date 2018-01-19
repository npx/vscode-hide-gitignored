# hide-gitignored

This extension hides files ignored by a `.gitignore` file from the file Explorer by converting
the `.gitignore`'s patterns to globs that vscode can interpret when added to the `files.exclude` 
workspace settings.

## Features

The extension registers a command you can use to parse your project's `.gitignore` and update your
workspace settings.

## Release Notes

### 1.0.0

Initial release

## Acknowledgement

Credit goes to [vscode-ignore-gitignore](https://github.com/stubailo/vscode-ignore-gitignore),
which unfortunately is not maintained anymore. I have been given 
[permission](https://github.com/stubailo/vscode-ignore-gitignore/pull/7#issuecomment-343804588) to
re-release.

## TODO
* multiple .gitignores (subfolders)
* run on save of .gitignore [+setting]
* tests
