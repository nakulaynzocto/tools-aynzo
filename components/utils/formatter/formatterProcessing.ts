import { html as beautifyHtml, css as beautifyCss, js as beautifyJs } from 'js-beautify';
import formatXML from 'xml-formatter';
import { format as formatSQL } from 'sql-formatter';
import { marked } from 'marked';
import TurndownService from 'turndown';

export const formatCode = (input: string, type: string, indentSize: number = 2): string => {
    if (!input.trim()) return '';

    try {
        switch (type) {
            case 'json-formatter':
                const parsed = JSON.parse(input);
                return JSON.stringify(parsed, null, indentSize);
            
            case 'html-formatter':
                return beautifyHtml(input, { indent_size: indentSize });
            
            case 'css-formatter':
                return beautifyCss(input, { indent_size: indentSize });
            
            case 'javascript-formatter':
                return beautifyJs(input, { indent_size: indentSize });
            
            case 'xml-formatter':
                return formatXML(input, { indentation: ' '.repeat(indentSize) });
            
            case 'sql-formatter':
                return formatSQL(input);
            
            default:
                return input;
        }
    } catch (error: any) {
        throw new Error(error.message || 'Formatting failed');
    }
};

export const minifyCode = (input: string, type: string): string => {
    if (!input.trim()) return '';

    try {
        switch (type) {
            case 'json-formatter':
                const parsed = JSON.parse(input);
                return JSON.stringify(parsed);
            
            case 'html-formatter':
            case 'css-formatter':
            case 'javascript-formatter':
                return input.replace(/\s+/g, ' ').trim();
            
            default:
                return input.replace(/\s+/g, ' ').trim();
        }
    } catch (error: any) {
        throw new Error(error.message || 'Minification failed');
    }
};

export const markdownToHTML = (markdown: string): string => {
    const result = marked(markdown);
    return typeof result === 'string' ? result : '';
};

export const htmlToMarkdown = (html: string): string => {
    const turndownService = new TurndownService();
    return turndownService.turndown(html);
};

