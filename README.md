# MkDocs Material Preview

A VS Code extension that enhances the built-in Markdown preview to render **Material for MkDocs** components that are not supported by the default Markdown renderer.

Unlike other solutions, this extension **does not require MkDocs, Python, or any external server**. It works directly on top of VS Code's native Markdown preview by extending its `markdown-it` parser with custom plugins. This makes it the fastest way to preview Material for MkDocs syntax — just open the preview and it's there, with zero setup and instant rendering.

![Demo](media/demo.gif)

## Features

- **Admonitions** — `!!! type "title"` (standard), `??? type` (collapsible), `???+ type` (collapsible, open)
- **Content Tabs** — `=== "Tab Title"` with CSS-only tab switching
- **Code Enhancements** — `title="file.py"`, `hl_lines="2 4-6"`, `linenums="1"` on fenced code blocks

## Installation

### From the Marketplace

Install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=0x10.mkdocs-material-preview), or search for **"MkDocs Material Preview"** in VS Code's Extensions panel.

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

No extra commands or panels — just use VS Code's built-in Markdown preview:

1. Open any `.md` file that uses Material for MkDocs syntax
2. Open the Markdown preview: `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac)
3. That's it — admonitions, content tabs, and enhanced code blocks render automatically

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

## Regenerating the Icon

The extension icon source is `media/icon.svg`. To regenerate the PNG after editing the SVG:

```bash
npx sharp-cli --input media/icon.svg --output media/icon.png -- resize 128 128
```

The Marketplace requires a PNG of at least 128x128 pixels.

## License

[MIT](LICENSE)
