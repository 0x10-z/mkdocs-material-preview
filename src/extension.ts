import * as vscode from 'vscode';
import { admonitionPlugin } from './plugins/admonition';
import { contentTabsPlugin } from './plugins/content-tabs';
import { codeEnhancementsPlugin } from './plugins/code-enhancements';
import { captionPlugin } from './plugins/caption';

export function activate(_context: vscode.ExtensionContext) {
    return {
        extendMarkdownIt(md: any) {
            return md
                .use(admonitionPlugin)
                .use(contentTabsPlugin)
                .use(codeEnhancementsPlugin)
                .use(captionPlugin);
        }
    };
}

export function deactivate() {}
