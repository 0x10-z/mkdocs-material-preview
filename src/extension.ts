import * as vscode from 'vscode';
import { admonitionPlugin } from './plugins/admonition';
import { contentTabsPlugin } from './plugins/content-tabs';
import { codeEnhancementsPlugin } from './plugins/code-enhancements';

export function activate(_context: vscode.ExtensionContext) {
    return {
        extendMarkdownIt(md: any) {
            return md
                .use(admonitionPlugin)
                .use(contentTabsPlugin)
                .use(codeEnhancementsPlugin);
        }
    };
}

export function deactivate() {}
