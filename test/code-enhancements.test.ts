import { describe, it, expect } from 'vitest';
import MarkdownIt from 'markdown-it';
import { codeEnhancementsPlugin } from '../src/plugins/code-enhancements';

function render(input: string): string {
    const md = new MarkdownIt();
    md.use(codeEnhancementsPlugin);
    return md.render(input);
}

describe('code enhancements plugin', () => {
    it('renders title attribute', () => {
        const input = '```py title="example.py"\nprint("hello")\n```';
        const html = render(input);
        expect(html).toContain('<div class="code-block-wrapper">');
        expect(html).toContain('<div class="code-block-title">example.py</div>');
        expect(html).toContain('print');
    });

    it('renders highlight lines', () => {
        const input = '```py hl_lines="2"\nline1\nline2\nline3\n```';
        const html = render(input);
        expect(html).not.toContain('<span class="hll">line1');
        expect(html).toContain('<span class="hll">line2\n</span>');
        expect(html).not.toContain('<span class="hll">line3');
    });

    it('renders highlight line ranges', () => {
        const input = '```py hl_lines="1-3"\na\nb\nc\nd\n```';
        const html = render(input);
        expect(html).toContain('<span class="hll">a\n</span>');
        expect(html).toContain('<span class="hll">b\n</span>');
        expect(html).toContain('<span class="hll">c\n</span>');
        expect(html).not.toContain('<span class="hll">d');
    });

    it('renders line numbers', () => {
        const input = '```py linenums="1"\nfirst\nsecond\nthird\n```';
        const html = render(input);
        expect(html).toContain('<span class="line-number">1</span>');
        expect(html).toContain('<span class="line-number">2</span>');
        expect(html).toContain('<span class="line-number">3</span>');
    });

    it('renders line numbers with custom start', () => {
        const input = '```py linenums="10"\na\nb\n```';
        const html = render(input);
        expect(html).toContain('<span class="line-number">10</span>');
        expect(html).toContain('<span class="line-number">11</span>');
    });

    it('combines title, highlight, and line numbers', () => {
        const input = '```py title="test.py" hl_lines="1" linenums="1"\nhighlighted\nnormal\n```';
        const html = render(input);
        expect(html).toContain('code-block-title');
        expect(html).toContain('<span class="hll">');
        expect(html).toContain('<span class="line-number">');
    });

    it('passes through regular code blocks unchanged', () => {
        const input = '```py\nprint("hello")\n```';
        const md = new MarkdownIt();
        const expected = md.render(input);
        const html = render(input);
        expect(html).toBe(expected);
    });

    it('preserves language class', () => {
        const input = '```javascript title="app.js"\nconsole.log("hi")\n```';
        const html = render(input);
        expect(html).toContain('class="language-javascript"');
    });

    it('escapes HTML in code content', () => {
        const input = '```html title="test.html"\n<div>hello</div>\n```';
        const html = render(input);
        expect(html).toContain('&lt;div&gt;');
    });

    it('escapes HTML in title', () => {
        const input = '```py title="<script>bad</script>"\ncode\n```';
        const html = render(input);
        expect(html).toContain('&lt;script&gt;');
    });
});
