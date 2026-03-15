# MkDocs Material Preview — VS Code Extension

## What This Is

A VS Code extension that enhances the built-in Markdown preview to render **Material for MkDocs** and **Zensical** (its successor, by the same team) components that are not supported by the default Markdown renderer. Both use the same Markdown syntax.

### Supported Components

- **Admonitions** — `!!! type "title"` (standard), `??? type` (collapsible), `???+ type` (collapsible, open)
- **Content Tabs** — `=== "Tab Title"` with CSS-only tab switching
- **Code Enhancements** — `title="file.py"`, `hl_lines="2 4-6"`, `linenums="1"` on fenced code blocks

## Architecture

The extension uses VS Code's **Markdown Extension API**:
- `markdown.markdownItPlugins` — registers custom `markdown-it` block-level parser rules
- `markdown.previewStyles` — injects CSS to style the rendered components

No external runtime dependencies. All parsing is done via custom `markdown-it` plugins written in TypeScript.

### Key Files

| File | Purpose |
|---|---|
| `src/extension.ts` | Entry point; returns `extendMarkdownIt` with all plugins |
| `src/plugins/admonition.ts` | Block rule for `!!!`/`???` admonition syntax |
| `src/plugins/content-tabs.ts` | Block rule for `===` tab syntax |
| `src/plugins/code-enhancements.ts` | Fence renderer wrapper for title/highlight/linenums |
| `media/mkdocs-material.css` | All visual styling (admonition colors, tab layout, code enhancements) |
| `samples/` | Test markdown files for each component |

## How to Test in Development

### Prerequisites

- VS Code installed
- Node.js installed

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Compile**
   ```bash
   npm run compile
   ```
   Or for continuous recompilation during development:
   ```bash
   npm run watch
   ```

3. **Launch Extension Development Host**
   - Open this project folder in VS Code
   - Press `F5` (or Run → Start Debugging)
   - This opens a new VS Code window with the extension loaded

4. **Test in the Development Host**
   - Open any file from `samples/` (e.g., `samples/test-admonitions.md`)
   - Open the Markdown preview: `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)
   - You should see styled admonitions, working tabs, and enhanced code blocks

5. **Iterate**
   - Edit plugin code in `src/plugins/`
   - If running `npm run watch`, TypeScript recompiles automatically
   - In the Development Host, run `Developer: Reload Window` (`Ctrl+Shift+P`) to pick up changes

### What to Verify

- Admonitions render with colored left border and title bar
- All 12 admonition types have distinct colors (note, warning, danger, tip, etc.)
- Collapsible admonitions (`???`) can be toggled open/closed
- `???+` admonitions start open
- Nested admonitions render correctly
- Content tabs switch between panels when clicked
- Code blocks with `title=` show a filename header
- Code blocks with `hl_lines=` highlight specified lines
- Code blocks with `linenums=` show line numbers
- Regular Markdown (bold, lists, blockquotes, tables) still renders normally

## Building for Distribution

```bash
npm install -g @vscode/vsce
vsce package
```

This produces a `.vsix` file that can be installed via `Extensions: Install from VSIX...` in VS Code.

## Publishing

CI publishes to the VS Code Marketplace automatically when a version tag is pushed. After bumping the version in `package.json`, always create and push the tag:

```bash
git tag v<version>
git push origin v<version>
```

Without the tag, the new version will not be published.
