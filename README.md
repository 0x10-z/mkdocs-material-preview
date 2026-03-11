# MkDocs Material Preview

A VS Code extension that enhances the built-in Markdown preview to render **Material for MkDocs** components that are not supported by the default Markdown renderer.

No external runtime dependencies. All parsing is done via custom `markdown-it` plugins written in TypeScript.

## Features

- **Admonitions** — `!!! type "title"` (standard), `??? type` (collapsible), `???+ type` (collapsible, open)
- **Content Tabs** — `=== "Tab Title"` with CSS-only tab switching
- **Code Enhancements** — `title="file.py"`, `hl_lines="2 4-6"`, `linenums="1"` on fenced code blocks

## Installation

### From VSIX

1. Download the `.vsix` file from [Releases](https://github.com/0x10-z/mkdocs-material-preview/releases) or [Actions artifacts](https://github.com/0x10-z/mkdocs-material-preview/actions)
2. In VS Code: `Extensions: Install from VSIX...` (`Ctrl+Shift+P`)

### From Source

```bash
git clone https://github.com/0x10-z/mkdocs-material-preview.git
cd mkdocs-material-preview
npm install
npm install -g @vscode/vsce
vsce package
```

Then install the generated `.vsix` file.

## Usage

1. Open any `.md` file that uses Material for MkDocs syntax
2. Open the Markdown preview (`Ctrl+Shift+V` / `Cmd+Shift+V`)
3. Admonitions, content tabs, and enhanced code blocks will render with proper styling

## Development

### Prerequisites

- VS Code
- Node.js

### Getting Started

```bash
npm install
npm run watch
```

Press `F5` in VS Code to launch the Extension Development Host, then open any file from `samples/` to test.

## License

[MIT](LICENSE)
