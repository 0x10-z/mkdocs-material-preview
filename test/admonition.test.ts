import { describe, it, expect } from 'vitest';
import MarkdownIt from 'markdown-it';
import { admonitionPlugin } from '../src/plugins/admonition';

function render(input: string): string {
    const md = new MarkdownIt();
    md.use(admonitionPlugin);
    return md.render(input);
}

describe('admonition plugin', () => {
    it('renders a basic note admonition', () => {
        const html = render('!!! note "My Note"\n    Some content here');
        expect(html).toContain('<div class="admonition note">');
        expect(html).toContain('<p class="admonition-title">My Note</p>');
        expect(html).toContain('Some content here');
        expect(html).toContain('</div>');
    });

    it('uses type as default title when no title given', () => {
        const html = render('!!! warning\n    Be careful');
        expect(html).toContain('<p class="admonition-title">Warning</p>');
        expect(html).toContain('Be careful');
    });

    it('renders collapsible admonition (closed)', () => {
        const html = render('??? tip "Click me"\n    Hidden content');
        expect(html).toContain('<details class="admonition tip">');
        expect(html).toContain('<summary class="admonition-title">Click me</summary>');
        expect(html).not.toContain(' open');
        expect(html).toContain('</details>');
    });

    it('renders collapsible admonition (open)', () => {
        const html = render('???+ danger "Expanded"\n    Visible content');
        expect(html).toContain('<details class="admonition danger" open>');
        expect(html).toContain('<summary class="admonition-title">Expanded</summary>');
    });

    it('supports all standard admonition types', () => {
        const types = ['note', 'abstract', 'info', 'tip', 'success', 'question', 'warning', 'failure', 'danger', 'bug', 'example', 'quote'];
        for (const type of types) {
            const html = render(`!!! ${type}\n    Content`);
            expect(html).toContain(`class="admonition ${type}"`);
        }
    });

    it('renders empty title with explicit empty string', () => {
        const html = render('!!! note ""\n    No title shown');
        expect(html).toContain('<p class="admonition-title"></p>');
    });

    it('does not match non-admonition lines', () => {
        const html = render('This is a normal paragraph');
        expect(html).not.toContain('admonition');
    });

    it('handles nested admonitions', () => {
        const input = '!!! note "Outer"\n    Content\n\n    !!! warning "Inner"\n        Nested content';
        const html = render(input);
        expect(html).toContain('class="admonition note"');
        expect(html).toContain('class="admonition warning"');
        expect(html).toContain('Nested content');
    });

    it('renders inline admonition', () => {
        const html = render('!!! info inline "Side note"\n    Inline content');
        expect(html).toContain('class="admonition info inline"');
    });

    it('renders inline end admonition', () => {
        const html = render('!!! info inline end "Side note"\n    Inline end content');
        expect(html).toContain('class="admonition info inline end"');
    });

    it('renders type-less admonition with title only', () => {
        const html = render('??? "Click to expand"\n    Some content');
        expect(html).toContain('<details class="admonition note">');
        expect(html).toContain('<summary class="admonition-title">Click to expand</summary>');
        expect(html).toContain('Some content');
    });

    it('renders type-less standard admonition with title only', () => {
        const html = render('!!! "Important info"\n    Some content');
        expect(html).toContain('<div class="admonition note">');
        expect(html).toContain('<p class="admonition-title">Important info</p>');
    });

    it('renders type-less expanded collapsible with title only', () => {
        const html = render('???+ "Open by default"\n    Visible content');
        expect(html).toContain('<details class="admonition note" open>');
        expect(html).toContain('<summary class="admonition-title">Open by default</summary>');
    });

    it('does not match marker with neither type nor title', () => {
        const html = render('???\n    Some content');
        expect(html).not.toContain('admonition');
    });

    it('renders type-less admonition with image in title', () => {
        const html = render('??? "![](https://placehold.co/16) Undo"\n    Undo the last operation');
        expect(html).toContain('<details class="admonition note">');
        expect(html).toContain('<img src="https://placehold.co/16"');
        expect(html).toContain('Undo');
    });

    it('renders nested admonition inside type-less collapsible', () => {
        const input = '??? "Parent"\n    Some text\n\n    !!! info\n        Nested info';
        const html = render(input);
        expect(html).toContain('<details class="admonition note">');
        expect(html).toContain('class="admonition info"');
        expect(html).toContain('Nested info');
    });
});
