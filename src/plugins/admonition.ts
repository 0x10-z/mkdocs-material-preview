/**
 * markdown-it plugin for Material for MkDocs admonitions.
 *
 * Supports:
 *   !!! type "Optional title"      — standard admonition
 *   ??? type "Optional title"      — collapsible (closed)
 *   ???+ type "Optional title"     — collapsible (open)
 *   ??? "Title only"               — type-less (defaults to "note")
 *
 * Type or title (or both) must be present.
 * Content must be indented by 4 spaces.
 * Nesting is supported via recursive tokenization.
 */

const MARKER_RE = /^(!{3}|\?{3}\+?)\s+(?:(\w[\w-]*)(?:\s+(inline(?:\s+end)?))?\s*)?(?:"(.*)")?\s*$/;

function getLine(state: any, line: number): string {
    const start = state.bMarks[line] + state.tShift[line];
    const end = state.eMarks[line];
    return state.src.slice(start, end);
}

function admonitionRule(state: any, startLine: number, endLine: number, silent: boolean): boolean {
    const lineText = getLine(state, startLine);
    const match = lineText.match(MARKER_RE);
    if (!match) return false;

    if (silent) return true;

    const marker = match[1];          // "!!!", "???", or "???+"
    const adType = match[2] || 'note'; // "note", "warning", etc. (defaults to "note")
    const inlineModifier = match[3];  // "inline", "inline end", or undefined
    const rawTitle = match[4];        // explicit title or undefined

    // Must have at least a type or a title
    if (!match[2] && rawTitle === undefined) return false;

    const title = rawTitle !== undefined ? rawTitle : adType.charAt(0).toUpperCase() + adType.slice(1);

    const collapsible = marker.startsWith('???');
    const expanded = marker === '???+';

    // Determine content region: lines indented by ≥4 spaces (or blank)
    const parentIndent = state.sCount[startLine];
    const contentIndent = parentIndent + 4;
    let nextLine = startLine + 1;

    while (nextLine < endLine) {
        if (state.sCount[nextLine] < contentIndent && state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]).trim().length > 0) {
            break;
        }
        nextLine++;
    }

    // --- Emit tokens ---

    // Open
    let tokenOpen = state.push('admonition_open', collapsible ? 'details' : 'div', 1);
    tokenOpen.block = true;
    const inline = inlineModifier === 'inline';
    const inlineEnd = inlineModifier === 'inline end';
    tokenOpen.meta = { type: adType, collapsible, expanded, inline, inlineEnd };
    tokenOpen.map = [startLine, nextLine];

    // Title open
    let tokenTitleOpen = state.push('admonition_title_open', collapsible ? 'summary' : 'p', 1);
    tokenTitleOpen.meta = { collapsible };

    // Title inline content
    let tokenInline = state.push('inline', '', 0);
    tokenInline.content = title;
    tokenInline.children = [];

    // Title close
    state.push('admonition_title_close', collapsible ? 'summary' : 'p', -1);

    // Parse nested content with increased indentation
    const oldIndent = state.blkIndent;
    state.blkIndent = contentIndent;
    const oldParentType = state.parentType;
    state.parentType = 'admonition';

    // Tokenize the nested content
    state.md.block.tokenize(state, startLine + 1, nextLine);

    state.blkIndent = oldIndent;
    state.parentType = oldParentType;

    // Close
    let tokenClose = state.push('admonition_close', collapsible ? 'details' : 'div', -1);
    tokenClose.block = true;

    state.line = nextLine;
    return true;
}

export function admonitionPlugin(md: any): void {
    md.block.ruler.before('fence', 'mkdocs_admonition', admonitionRule, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });

    md.renderer.rules['admonition_open'] = (tokens: any[], idx: number) => {
        const token = tokens[idx];
        const { type, collapsible, expanded, inline, inlineEnd } = token.meta;
        const classes = ['admonition', type];
        if (inline) classes.push('inline');
        if (inlineEnd) classes.push('inline', 'end');
        const classAttr = classes.join(' ');
        if (collapsible) {
            return `<details class="${classAttr}"${expanded ? ' open' : ''}>\n`;
        }
        return `<div class="${classAttr}">\n`;
    };

    md.renderer.rules['admonition_close'] = (tokens: any[], idx: number) => {
        // Walk backwards to find the matching open
        for (let i = idx - 1; i >= 0; i--) {
            if (tokens[i].type === 'admonition_open' && tokens[i].level === tokens[idx].level) {
                return tokens[i].meta.collapsible ? '</details>\n' : '</div>\n';
            }
        }
        return '</div>\n';
    };

    md.renderer.rules['admonition_title_open'] = (tokens: any[], idx: number) => {
        const { collapsible } = tokens[idx].meta;
        return collapsible ? '<summary class="admonition-title">' : '<p class="admonition-title">';
    };

    md.renderer.rules['admonition_title_close'] = (tokens: any[], idx: number) => {
        // Walk backwards to find the matching title_open
        for (let i = idx - 1; i >= 0; i--) {
            if (tokens[i].type === 'admonition_title_open') {
                return tokens[i].meta.collapsible ? '</summary>\n' : '</p>\n';
            }
        }
        return '</p>\n';
    };
}
