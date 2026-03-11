/**
 * markdown-it plugin for Material for MkDocs code block enhancements.
 *
 * Supports:
 *   ```py title="example.py"
 *   ```py hl_lines="2 4-6"
 *   ```py linenums="1"
 *
 * Wraps the default fence renderer to add title bars and line highlighting.
 */

function parseHighlightLines(spec: string): Set<number> {
    const lines = new Set<number>();
    for (const part of spec.split(/\s+/)) {
        const range = part.match(/^(\d+)-(\d+)$/);
        if (range) {
            const start = parseInt(range[1], 10);
            const end = parseInt(range[2], 10);
            for (let i = start; i <= end; i++) {
                lines.add(i);
            }
        } else {
            const num = parseInt(part, 10);
            if (!isNaN(num)) {
                lines.add(num);
            }
        }
    }
    return lines;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function codeEnhancementsPlugin(md: any): void {
    const defaultFence = md.renderer.rules.fence ||
        function (tokens: any[], idx: number, options: any, _env: any, self: any) {
            return self.renderToken(tokens, idx, options);
        };

    md.renderer.rules.fence = function (tokens: any[], idx: number, options: any, env: any, self: any) {
        const token = tokens[idx];
        const info = token.info ? token.info.trim() : '';

        // Extract attributes from info string
        const titleMatch = info.match(/title="([^"]+)"/);
        const hlMatch = info.match(/hl_lines="([^"]+)"/);
        const linenumMatch = info.match(/linenums="(\d+)"/);

        const hasEnhancements = titleMatch || hlMatch || linenumMatch;
        if (!hasEnhancements) {
            return defaultFence(tokens, idx, options, env, self);
        }

        const title = titleMatch ? titleMatch[1] : null;
        const hlLines = hlMatch ? parseHighlightLines(hlMatch[1]) : new Set<number>();
        const lineNumStart = linenumMatch ? parseInt(linenumMatch[1], 10) : null;

        // Clean info string: remove our custom attributes, keep only the language
        const lang = info.replace(/\s+title="[^"]*"/, '')
            .replace(/\s+hl_lines="[^"]*"/, '')
            .replace(/\s+linenums="\d+"/, '')
            .trim();

        const content = token.content;
        const lines = content.split('\n');
        // Remove trailing empty line (markdown-it adds one)
        if (lines.length > 0 && lines[lines.length - 1] === '') {
            lines.pop();
        }

        // Build code lines with optional highlighting and line numbers
        let codeContent = '';
        for (let i = 0; i < lines.length; i++) {
            const lineNum = i + 1;
            const highlighted = hlLines.has(lineNum);
            const escapedLine = escapeHtml(lines[i]);

            let lineHtml = '';
            if (lineNumStart !== null) {
                lineHtml += `<span class="line-number">${lineNumStart + i}</span>`;
            }
            lineHtml += escapedLine;

            if (highlighted) {
                codeContent += `<span class="hll">${lineHtml}\n</span>`;
            } else {
                codeContent += lineHtml + '\n';
            }
        }

        const langClass = lang ? ` class="language-${lang}"` : '';

        let html = '';
        if (title) {
            html += `<div class="code-block-wrapper">\n`;
            html += `<div class="code-block-title">${escapeHtml(title)}</div>\n`;
        }

        html += `<pre><code${langClass}>${codeContent}</code></pre>\n`;

        if (title) {
            html += `</div>\n`;
        }

        return html;
    };
}
