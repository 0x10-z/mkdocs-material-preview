import { describe, it, expect } from 'vitest';
import MarkdownIt from 'markdown-it';
import { contentTabsPlugin } from '../src/plugins/content-tabs';

function render(input: string): string {
    const md = new MarkdownIt();
    md.use(contentTabsPlugin);
    return md.render(input);
}

describe('content tabs plugin', () => {
    it('renders a basic tab set', () => {
        const input = '=== "Tab 1"\n    Content 1\n\n=== "Tab 2"\n    Content 2';
        const html = render(input);
        expect(html).toContain('<div class="tabbed-set">');
        expect(html).toContain('type="radio"');
        expect(html).toContain('Content 1');
        expect(html).toContain('Content 2');
        expect(html).toContain('</div>');
    });

    it('first tab is checked by default', () => {
        const input = '=== "First"\n    A\n\n=== "Second"\n    B';
        const html = render(input);
        const inputs = html.match(/<input[^>]*>/g) || [];
        expect(inputs.length).toBe(2);
        expect(inputs[0]).toContain('checked');
        expect(inputs[1]).not.toContain('checked');
    });

    it('renders correct labels', () => {
        const input = '=== "Python"\n    py code\n\n=== "JavaScript"\n    js code';
        const html = render(input);
        expect(html).toContain('>Python</label>');
        expect(html).toContain('>JavaScript</label>');
    });

    it('renders tabbed content blocks', () => {
        const input = '=== "A"\n    Alpha\n\n=== "B"\n    Beta';
        const html = render(input);
        const blocks = html.match(/<div class="tabbed-block">/g) || [];
        expect(blocks.length).toBe(2);
    });

    it('escapes HTML in tab titles', () => {
        const input = '=== "<script>alert(1)</script>"\n    Content';
        const html = render(input);
        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
    });

    it('does not match non-tab lines', () => {
        const html = render('Just a regular paragraph');
        expect(html).not.toContain('tabbed');
    });

    it('handles single tab', () => {
        const input = '=== "Only Tab"\n    Solo content';
        const html = render(input);
        expect(html).toContain('<div class="tabbed-set">');
        expect(html).toContain('>Only Tab</label>');
    });
});
