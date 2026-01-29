"use client";
import { useState, useEffect } from 'react';
import { Copy, Download, RotateCcw, Check, Code, Link2, FileJson, FileText, FileCode, Braces, Split, Terminal, Minimize2, Search } from 'lucide-react';
import { ScrollableNav } from '@/components/ScrollableNav';
import { cn } from '@/utils/cn';

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

    // Navigation Tools Configuration
    // Navigation Configuration (Shared)
    const devNavTools = [
        {
            category: 'Formatters',
            tools: [
                { id: 'json-formatter', label: 'JSON', icon: FileJson },
                { id: 'html-formatter', label: 'HTML', icon: Code },
                { id: 'css-formatter', label: 'CSS', icon: FileCode },
                { id: 'javascript-formatter', label: 'JS', icon: Braces },
                { id: 'xml-formatter', label: 'XML', icon: FileCode },
                { id: 'sql-formatter', label: 'SQL', icon: FileText },
            ]
        },
        {
            category: 'Converters',
            tools: [
                { id: 'markdown-to-html', label: 'MD to HTML', icon: FileText },
                { id: 'html-to-markdown', label: 'HTML to MD', icon: Code },
                { id: 'csv-to-json', label: 'CSV to JSON', icon: FileText },
                { id: 'html-to-jsx', label: 'HTML to JSX', icon: Code },
            ]
        },
        {
            category: 'Utilities',
            tools: [
                { id: 'url-encoder-decoder', label: 'URL Encoder', icon: Link2 },
                { id: 'diff-checker', label: 'Diff Checker', icon: Split },
                { id: 'user-agent-parser', label: 'User Agent', icon: Terminal },
                { id: 'code-minifier', label: 'Minifier', icon: Minimize2 },
                { id: 'regex-tester', label: 'Regex Tester', icon: Search },
            ]
        }
    ];

    const isCodeTool = devNavTools.some(cat => cat.tools.some(t => t.id === type));

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Code Tools Navigation */}
            {isCodeTool && (
                <ScrollableNav items={devNavTools} activeToolId={type} />
            )}

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
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${indentSize === size ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'}`}
                                    >
                                        {size} Spaces
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                        {/* Input Section */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-black text-muted-foreground uppercase tracking-widest">
                                    Input Code
                                </label>
                                <button
                                    onClick={clearAll}
                                    className="text-xs font-black text-destructive hover:bg-destructive/10 px-4 py-2 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-destructive/20"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Clear All
                                </button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={getPlaceholder()}
                                className="flex-1 w-full p-6 border-2 border-border rounded-[2rem] focus:border-accent focus:outline-none font-mono text-sm bg-input text-foreground resize-none leading-relaxed shadow-inner min-h-[450px]"
                                spellCheck={false}
                            />
                        </div>

                        {/* Output Section */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-black text-muted-foreground uppercase tracking-widest">
                                    Formatted Output
                                </label>
                                {output && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className={cn("px-5 py-2 rounded-xl font-black transition-all flex items-center gap-2 text-xs", copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary/10 text-primary hover:bg-primary/20')}
                                        >
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            {copied ? 'COPIED' : 'COPY'}
                                        </button>
                                        <button
                                            onClick={downloadCode}
                                            className="px-5 py-2 bg-accent/10 text-accent border-2 border-accent/10 rounded-xl font-black hover:bg-accent/20 transition-all flex items-center gap-2 text-xs"
                                        >
                                            <Download className="h-4 w-4" />
                                            SAVE
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-full p-6 border-2 border-border rounded-[2rem] bg-muted/20 font-mono text-sm overflow-auto text-foreground leading-relaxed shadow-inner min-h-[450px]">
                                {type === 'markdown-to-html' ? (
                                    <div dangerouslySetInnerHTML={{ __html: output }} className="prose prose-sm dark:prose-invert max-w-none" />
                                ) : (
                                    output ? (
                                        <pre className="whitespace-pre-wrap break-all">{output}</pre>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4 py-20">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                                <Download size={32} className="opacity-20" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">Results will appear here</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
