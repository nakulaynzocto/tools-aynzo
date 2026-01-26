"use client";
import { useState, useEffect } from 'react';
import { Copy, Download, RotateCcw, Check } from 'lucide-react';

import { html as beautifyHtml, css as beautifyCss, js as beautifyJs } from 'js-beautify';
// @ts-ignore
import formatXML from 'xml-formatter';
import { format as formatSQL } from 'sql-formatter';
import { marked } from 'marked';
import TurndownService from 'turndown';
import Papa from 'papaparse';

interface FormatterToolsProps {
    type: string;
}

export default function FormatterTools({ type }: FormatterToolsProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [indentSize, setIndentSize] = useState(2);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!input) {
            setOutput('');
            return;
        }

        let result = '';
        try {
            switch (type) {
                case 'html-formatter':
                    result = beautifyHtml(input, {
                        indent_size: indentSize,
                        wrap_line_length: 80,
                        preserve_newlines: true,
                    });
                    break;
                case 'css-formatter':
                    result = beautifyCss(input, {
                        indent_size: indentSize,
                    });
                    break;
                case 'javascript-formatter':
                    result = beautifyJs(input, {
                        indent_size: indentSize,
                        brace_style: 'collapse',
                    });
                    break;
                case 'xml-formatter':
                    result = formatXML(input, {
                        indentation: ' '.repeat(indentSize),
                        collapseContent: true,
                    });
                    break;
                case 'sql-formatter':
                    result = formatSQL(input, {
                        language: 'sql',
                        tabWidth: indentSize,
                    });
                    break;
                case 'markdown-to-html':
                    result = marked(input) as string;
                    break;
                case 'html-to-markdown':
                    const turndownService = new TurndownService();
                    result = turndownService.turndown(input);
                    break;
                case 'csv-to-json':
                    const csvResult = Papa.parse(input, {
                        header: true,
                        skipEmptyLines: true,
                    });
                    result = JSON.stringify(csvResult.data, null, indentSize);
                    break;
                case 'json-to-csv':
                    try {
                        const jsonData = JSON.parse(input);
                        const csv = Papa.unparse(jsonData);
                        result = csv;
                    } catch {
                        result = 'Invalid JSON';
                    }
                    break;
                case 'code-minifier':
                    result = input.replace(/\s+/g, ' ').replace(/\n/g, '').trim();
                    break;
                default:
                    result = input;
            }
            setOutput(result);
        } catch (error: any) {
            setOutput('');
        }
    }, [input, type, indentSize]);

    const formatCode = () => {
        // Function kept for reference
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadCode = () => {
        const extensions: { [key: string]: string } = {
            'html-formatter': 'html',
            'css-formatter': 'css',
            'javascript-formatter': 'js',
            'xml-formatter': 'xml',
            'sql-formatter': 'sql',
            'markdown-to-html': 'html',
            'html-to-markdown': 'md',
            'csv-to-json': 'json',
            'json-to-csv': 'csv',
            'code-minifier': 'min.js',
        };

        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `formatted.${extensions[type] || 'txt'}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
    };

    const getToolName = () => {
        const names: { [key: string]: string } = {
            'html-formatter': 'HTML Formatter',
            'css-formatter': 'CSS Formatter',
            'javascript-formatter': 'JavaScript Formatter',
            'xml-formatter': 'XML Formatter',
            'sql-formatter': 'SQL Formatter',
            'markdown-to-html': 'Markdown to HTML',
            'html-to-markdown': 'HTML to Markdown',
            'csv-to-json': 'CSV to JSON',
            'json-to-csv': 'JSON to CSV',
            'code-minifier': 'Code Minifier',
        };
        return names[type] || 'Code Formatter';
    };

    const getPlaceholder = () => {
        const placeholders: { [key: string]: string } = {
            'html-formatter': '<!DOCTYPE html>\n<html><body><h1>Hello</h1></body></html>',
            'css-formatter': 'body{margin:0;padding:0;font-family:Arial;}',
            'javascript-formatter': 'function hello(){console.log("Hello World");}',
            'xml-formatter': '<?xml version="1.0"?><root><item>Value</item></root>',
            'sql-formatter': 'SELECT * FROM users WHERE id=1;',
            'markdown-to-html': '# Hello World\n\nThis is **bold** text.',
            'html-to-markdown': '<h1>Hello World</h1><p>This is <strong>bold</strong> text.</p>',
            'csv-to-json': 'name,age,city\nJohn,30,NYC\nJane,25,LA',
            'json-to-csv': '[{"name":"John","age":30,"city":"NYC"}]',
            'code-minifier': 'function hello() {\n  console.log("Hello");\n}',
        };
        return placeholders[type] || 'Paste your code here...';
    };

    const showIndentOption = ['html-formatter', 'css-formatter', 'javascript-formatter', 'xml-formatter', 'sql-formatter', 'csv-to-json'].includes(type);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

                <div className="p-8 space-y-8">
                    {/* Options */}
                    {showIndentOption && (
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold text-foreground">
                                Indent Size:
                            </label>
                            <div className="flex p-1 bg-muted rounded-xl border-2 border-border gap-1">
                                {[2, 4, 8].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setIndentSize(size)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${indentSize === size ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-card'}`}
                                    >
                                        {size} Spaces
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    Input Code
                                </label>
                                <button
                                    onClick={clearAll}
                                    className="text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Clear
                                </button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={getPlaceholder()}
                                rows={16}
                                className="w-full p-4 border-2 border-border rounded-2xl focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground resize-none leading-relaxed"
                            />
                        </div>

                        {/* Output Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between h-9">
                                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    Formatted Output
                                </label>
                                {output && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className={`px-3 py-1.5 border rounded-lg font-bold transition-all flex items-center gap-2 text-xs ${copied ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
                                        >
                                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={downloadCode}
                                            className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-lg font-bold hover:bg-accent/20 transition-all flex items-center gap-2 text-xs"
                                        >
                                            <Download className="h-3 w-3" />
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>
                            {type === 'markdown-to-html' ? (
                                <div
                                    className="w-full h-full min-h-[400px] p-4 border-2 border-border rounded-2xl bg-muted/30 font-mono text-sm overflow-auto text-foreground leading-relaxed shadow-inner"
                                    dangerouslySetInnerHTML={{ __html: output }}
                                />
                            ) : (
                                <div
                                    className="w-full h-full min-h-[400px] p-4 border-2 border-border rounded-2xl bg-muted/30 font-mono text-sm overflow-auto text-foreground leading-relaxed shadow-inner"
                                >
                                    {output || <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                                        <Download size={48} className="mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Results will appear here</p>
                                    </div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
