import { describe, it, expect } from 'vitest';
import MarkdownIt from 'markdown-it';
import { captionPlugin } from '../src/plugins/caption';

function render(input: string): string {
    const md = new MarkdownIt();
    md.use(captionPlugin);
    return md.render(input);
}

describe('caption plugin', () => {
    it('wraps image paragraph in figure with figcaption', () => {
        const html = render('![Alt](image.png)\n/// caption\nCaption text\n///');
        expect(html).toContain('<figure>');
        expect(html).toContain('<figcaption>');
        expect(html).toContain('Caption text');
        expect(html).toContain('</figcaption>');
        expect(html).toContain('</figure>');
    });

    it('places figure before image and figcaption after', () => {
        const html = render('![Alt](image.png)\n/// caption\nCaption text\n///');
        const figureIdx = html.indexOf('<figure>');
        const imgIdx = html.indexOf('<img');
        const captionIdx = html.indexOf('<figcaption>');
        const figureCloseIdx = html.indexOf('</figure>');
        expect(figureIdx).toBeLessThan(imgIdx);
        expect(imgIdx).toBeLessThan(captionIdx);
        expect(captionIdx).toBeLessThan(figureCloseIdx);
    });

    it('wraps code block (fence) in figure with figcaption', () => {
        const html = render('```python\nprint("hi")\n```\n/// caption\nCode caption\n///');
        expect(html).toContain('<figure>');
        expect(html).toContain('<figcaption>');
        expect(html).toContain('Code caption');
        expect(html).toContain('</figure>');
    });

    it('renders empty caption with empty figcaption', () => {
        const html = render('![Alt](image.png)\n/// caption\n///');
        expect(html).toContain('<figure>');
        expect(html).toContain('<figcaption>');
        expect(html).toContain('</figcaption>');
        expect(html).toContain('</figure>');
    });

    it('does not affect images without a caption block', () => {
        const html = render('![Alt](image.png)');
        expect(html).not.toContain('<figure>');
        expect(html).not.toContain('<figcaption>');
    });

    it('does not affect normal paragraphs', () => {
        const html = render('Just a normal paragraph.');
        expect(html).not.toContain('<figure>');
        expect(html).not.toContain('<figcaption>');
    });

    it('renders inline markdown inside caption', () => {
        const html = render('![Alt](image.png)\n/// caption\n**Bold** caption\n///');
        expect(html).toContain('<strong>Bold</strong>');
        expect(html).toContain('<figcaption>');
    });

    it('does not treat /// caption without closing /// as breaking the document', () => {
        const html = render('![Alt](image.png)\n/// caption\nNo closing marker');
        // Should still render without throwing
        expect(html).toBeDefined();
    });

    it('multiple captions in the same document each wrap their preceding block', () => {
        const input = [
            '![First](a.png)',
            '/// caption',
            'First caption',
            '///',
            '',
            '![Second](b.png)',
            '/// caption',
            'Second caption',
            '///',
        ].join('\n');
        const html = render(input);
        expect(html.split('<figure>').length - 1).toBe(2);
        expect(html).toContain('First caption');
        expect(html).toContain('Second caption');
    });
});
