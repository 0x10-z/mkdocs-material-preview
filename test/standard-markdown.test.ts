import { describe, it, expect } from 'vitest';
import MarkdownIt from 'markdown-it';
import { admonitionPlugin } from '../src/plugins/admonition';
import { contentTabsPlugin } from '../src/plugins/content-tabs';
import { codeEnhancementsPlugin } from '../src/plugins/code-enhancements';

/**
 * Verifies that standard Markdown rendering is not broken
 * when all three plugins are active.
 */

function createMd(): MarkdownIt {
    const md = new MarkdownIt();
    md.use(admonitionPlugin);
    md.use(contentTabsPlugin);
    md.use(codeEnhancementsPlugin);
    return md;
}

const md = createMd();
const baseline = new MarkdownIt();

function expectSameAsBaseline(input: string) {
    expect(md.render(input)).toBe(baseline.render(input));
}

describe('standard markdown is not broken by plugins', () => {
    it('headings', () => {
        expectSameAsBaseline('# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6');
    });

    it('paragraphs', () => {
        expectSameAsBaseline('First paragraph.\n\nSecond paragraph.');
    });

    it('bold and italic', () => {
        expectSameAsBaseline('**bold** and *italic* and ***both***');
    });

    it('inline code', () => {
        expectSameAsBaseline('Use `console.log()` to debug.');
    });

    it('unordered lists', () => {
        expectSameAsBaseline('- item 1\n- item 2\n  - nested\n- item 3');
    });

    it('ordered lists', () => {
        expectSameAsBaseline('1. first\n2. second\n3. third');
    });

    it('links', () => {
        expectSameAsBaseline('[click here](https://example.com)');
    });

    it('images', () => {
        expectSameAsBaseline('![alt text](image.png)');
    });

    it('blockquotes', () => {
        expectSameAsBaseline('> This is a quote\n>\n> With two paragraphs');
    });

    it('horizontal rule', () => {
        expectSameAsBaseline('---');
    });

    it('tables', () => {
        expectSameAsBaseline('| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |');
    });

    it('fenced code blocks without enhancements', () => {
        expectSameAsBaseline('```js\nconst x = 1;\n```');
    });

    it('indented code blocks', () => {
        expectSameAsBaseline('    code line 1\n    code line 2');
    });

    it('strikethrough', () => {
        expectSameAsBaseline('~~deleted~~');
    });

    it('html passthrough', () => {
        expectSameAsBaseline('<div>raw html</div>');
    });

    it('line with exclamation marks (not admonition)', () => {
        expectSameAsBaseline('!!! This is not an admonition because the type has spaces');
    });

    it('line with equals signs (not tabs)', () => {
        expectSameAsBaseline('== not a tab ==');
    });

    it('complex document', () => {
        const doc = `# Title

A paragraph with **bold**, *italic*, and \`code\`.

- List item 1
- List item 2

> A blockquote

| Col1 | Col2 |
|------|------|
| a    | b    |

\`\`\`python
def hello():
    print("world")
\`\`\`

---

[Link](https://example.com) and ![image](img.png)
`;
        expectSameAsBaseline(doc);
    });
});
