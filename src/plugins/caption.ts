/**
 * markdown-it plugin for Material for MkDocs caption blocks.
 *
 * Syntax:
 *   ![image](path.png)
 *   /// caption
 *   Caption text
 *   ///
 *
 * Wraps the preceding block element in <figure> and adds a <figcaption>.
 * Works with images (paragraph containing only an image) and code blocks (fences).
 */

function getLine(state: any, line: number): string {
    const start = state.bMarks[line] + state.tShift[line];
    const end = state.eMarks[line];
    return state.src.slice(start, end);
}

function captionRule(state: any, startLine: number, endLine: number, silent: boolean): boolean {
    const lineText = getLine(state, startLine);
    if (lineText !== '/// caption') return false;

    if (silent) return true;

    // Collect caption content lines until closing ///
    let nextLine = startLine + 1;
    const contentLines: string[] = [];
    while (nextLine < endLine) {
        const line = getLine(state, nextLine);
        if (line === '///') {
            nextLine++;
            break;
        }
        contentLines.push(line);
        nextLine++;
    }

    const captionText = contentLines.join('\n').trim();

    const tokenOpen = state.push('caption_open', 'figcaption', 1);
    tokenOpen.block = true;

    if (captionText) {
        const tokenInline = state.push('inline', '', 0);
        tokenInline.content = captionText;
        tokenInline.children = [];
    }

    const tokenClose = state.push('caption_close', 'figcaption', -1);
    tokenClose.block = true;

    state.line = nextLine;
    return true;
}

/**
 * Finds the index of the opening token of the block that immediately precedes
 * the caption_open token at captionOpenIdx.
 */
function findPrecedingBlockStart(tokens: any[], captionOpenIdx: number): number {
    const prevEnd = captionOpenIdx - 1;
    if (prevEnd < 0) return -1;

    const prevToken = tokens[prevEnd];

    if (prevToken.nesting === 0) {
        // Self-closing block (e.g., fence, html_block)
        return prevEnd;
    }

    if (prevToken.nesting === -1) {
        // Closing token — walk backward to find the matching opening token by tag
        let depth = 1;
        let j = prevEnd - 1;
        while (j >= 0 && depth > 0) {
            if (tokens[j].tag === prevToken.tag) {
                if (tokens[j].nesting === 1) depth--;
                else if (tokens[j].nesting === -1) depth++;
            }
            j--;
        }
        // After the loop j was decremented one extra time, so the open token is at j+1
        return j + 1;
    }

    return -1;
}

function captionCoreRule(state: any): void {
    const tokens = state.tokens;
    let i = 0;

    while (i < tokens.length) {
        if (tokens[i].type !== 'caption_open') {
            i++;
            continue;
        }

        const captionOpenIdx = i;

        // Find the matching caption_close
        let captionCloseIdx = captionOpenIdx + 1;
        while (captionCloseIdx < tokens.length && tokens[captionCloseIdx].type !== 'caption_close') {
            captionCloseIdx++;
        }
        if (captionCloseIdx >= tokens.length) {
            i = captionCloseIdx;
            continue;
        }

        const prevStart = findPrecedingBlockStart(tokens, captionOpenIdx);
        if (prevStart < 0) {
            i = captionCloseIdx + 1;
            continue;
        }

        // Insert <figure> before the preceding block
        const figureOpen = new state.Token('figure_open', 'figure', 1);
        figureOpen.block = true;
        tokens.splice(prevStart, 0, figureOpen);

        // All indices shift by 1 after the splice
        const newCaptionOpenIdx = captionOpenIdx + 1;
        const newCaptionCloseIdx = captionCloseIdx + 1;

        // Insert </figure> after caption_close
        const figureClose = new state.Token('figure_close', 'figure', -1);
        figureClose.block = true;
        tokens.splice(newCaptionCloseIdx + 1, 0, figureClose);

        // Advance past the inserted figure_close
        i = newCaptionCloseIdx + 2;
    }
}

export function captionPlugin(md: any): void {
    md.block.ruler.before('fence', 'mkdocs_caption', captionRule, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });

    md.core.ruler.push('mkdocs_caption_figure', captionCoreRule);

    md.renderer.rules['figure_open'] = () => '<figure>\n';
    md.renderer.rules['figure_close'] = () => '</figure>\n';
    md.renderer.rules['caption_open'] = () => '<figcaption>';
    md.renderer.rules['caption_close'] = () => '</figcaption>\n';
}
