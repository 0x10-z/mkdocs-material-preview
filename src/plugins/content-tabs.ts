/**
 * markdown-it plugin for Material for MkDocs content tabs.
 *
 * Syntax:
 *   === "Tab 1"
 *       Content for tab 1
 *
 *   === "Tab 2"
 *       Content for tab 2
 *
 * Uses CSS-only radio-input approach for tab switching in the preview.
 */

const TAB_RE = /^===\s+"(.+)"\s*$/;

let tabSetCounter = 0;

function getLine(state: any, line: number): string {
    const start = state.bMarks[line] + state.tShift[line];
    const end = state.eMarks[line];
    return state.src.slice(start, end);
}

interface TabInfo {
    title: string;
    contentStart: number;
    contentEnd: number;
}

function contentTabsRule(state: any, startLine: number, endLine: number, silent: boolean): boolean {
    const lineText = getLine(state, startLine);
    const match = lineText.match(TAB_RE);
    if (!match) return false;

    if (silent) return true;

    const parentIndent = state.sCount[startLine];
    const contentIndent = parentIndent + 4;

    // Collect all tabs in this group
    const tabs: TabInfo[] = [];
    let currentLine = startLine;

    while (currentLine < endLine) {
        const lt = getLine(state, currentLine);
        const tabMatch = lt.match(TAB_RE);
        if (!tabMatch) break;

        const title = tabMatch[1];
        const contentStart = currentLine + 1;

        // Find end of this tab's content
        let contentEnd = contentStart;
        while (contentEnd < endLine) {
            const nextTabMatch = getLine(state, contentEnd).match(TAB_RE);
            if (nextTabMatch && state.sCount[contentEnd] <= parentIndent) {
                break;
            }
            if (state.sCount[contentEnd] < contentIndent &&
                state.src.slice(state.bMarks[contentEnd], state.eMarks[contentEnd]).trim().length > 0 &&
                !getLine(state, contentEnd).match(TAB_RE)) {
                break;
            }
            contentEnd++;
        }

        tabs.push({ title, contentStart, contentEnd });
        currentLine = contentEnd;
    }

    if (tabs.length === 0) return false;

    const setId = tabSetCounter++;

    // Emit tokens
    const tokenSetOpen = state.push('tabbed_set_open', 'div', 1);
    tokenSetOpen.block = true;
    tokenSetOpen.meta = { setId, tabCount: tabs.length };
    tokenSetOpen.map = [startLine, currentLine];

    // Emit all inputs first, then all labels (CSS nth-child selectors depend on this order)
    for (let i = 0; i < tabs.length; i++) {
        const tokenInput = state.push('tabbed_input', 'input', 0);
        tokenInput.meta = { setId, tabIndex: i, checked: i === 0 };
    }
    for (let i = 0; i < tabs.length; i++) {
        const tokenLabel = state.push('tabbed_label', 'label', 0);
        tokenLabel.meta = { setId, tabIndex: i, title: tabs[i].title };
    }

    // Emit content blocks
    const tokenContentOpen = state.push('tabbed_content_open', 'div', 1);
    tokenContentOpen.block = true;

    for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        const tokenBlockOpen = state.push('tabbed_block_open', 'div', 1);
        tokenBlockOpen.block = true;
        tokenBlockOpen.meta = { tabIndex: i };

        // Parse nested content
        const oldIndent = state.blkIndent;
        state.blkIndent = contentIndent;
        state.md.block.tokenize(state, tab.contentStart, tab.contentEnd);
        state.blkIndent = oldIndent;

        const tokenBlockClose = state.push('tabbed_block_close', 'div', -1);
        tokenBlockClose.block = true;
    }

    state.push('tabbed_content_close', 'div', -1);
    state.push('tabbed_set_close', 'div', -1);

    state.line = currentLine;
    return true;
}

export function contentTabsPlugin(md: any): void {
    md.block.ruler.before('fence', 'mkdocs_content_tabs', contentTabsRule, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });

    md.renderer.rules['tabbed_set_open'] = () => {
        return '<div class="tabbed-set">\n';
    };

    md.renderer.rules['tabbed_set_close'] = () => {
        return '</div>\n';
    };

    md.renderer.rules['tabbed_input'] = (tokens: any[], idx: number) => {
        const { setId, tabIndex, checked } = tokens[idx].meta;
        const checkedAttr = checked ? ' checked' : '';
        return `<input type="radio" name="tabset-${setId}" id="tab-${setId}-${tabIndex}"${checkedAttr}>\n`;
    };

    md.renderer.rules['tabbed_label'] = (tokens: any[], idx: number) => {
        const { setId, tabIndex, title } = tokens[idx].meta;
        return `<label for="tab-${setId}-${tabIndex}">${md.utils.escapeHtml(title)}</label>\n`;
    };

    md.renderer.rules['tabbed_content_open'] = () => {
        return '<div class="tabbed-content">\n';
    };

    md.renderer.rules['tabbed_content_close'] = () => {
        return '</div>\n';
    };

    md.renderer.rules['tabbed_block_open'] = () => {
        return '<div class="tabbed-block">\n';
    };

    md.renderer.rules['tabbed_block_close'] = () => {
        return '</div>\n';
    };
}
