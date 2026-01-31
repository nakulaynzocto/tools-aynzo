"use client";
import { useState, useEffect } from 'react';
import { Code, Link2, FileJson, FileText, FileCode, Minimize2, Maximize2, Split, Braces, Terminal, Search } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { DevToolProps } from '@/components/types/dev/types';
import { JSONFormatter } from './JSONFormatter';
import { URLEncoderDecoder } from './URLEncoderDecoder';

export default function DevToolsIndex({ type }: DevToolProps) {
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

    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [copied, setCopied] = useState(false);
    const [jsonMode, setJsonMode] = useState<'beautify' | 'minify'>('beautify');
    const [validationError, setValidationError] = useState<string>('');
    const [showConverters, setShowConverters] = useState(false);
    const [modal, setModal] = useState<{ show: boolean, title: string, content: string, type: 'csv' | 'xml' | null }>({
        show: false,
        title: '',
        content: '',
        type: null
    });

    useEffect(() => {
        if (type === 'url-encoder-decoder') {
            processURL(input, mode);
        } else if (type === 'json-formatter') {
            if (!input.trim()) {
                setOutput('');
                setValidationError('');
                return;
            }
            const validation = validateJSON(input);
            if (!validation.valid) {
                setValidationError(validation.error || 'Invalid JSON');
                setOutput('');
                return;
            }
            setValidationError('');
            try {
                const parsed = JSON.parse(input);
                if (jsonMode === 'beautify') {
                    setOutput(JSON.stringify(parsed, null, 2));
                } else {
                    setOutput(JSON.stringify(parsed));
                }
            } catch (e: any) {
                setValidationError(e.message);
            }
        }
    }, [input, mode, type, jsonMode]);

    const validateJSON = (jsonString: string): { valid: boolean, error?: string } => {
        try {
            JSON.parse(jsonString);
            return { valid: true };
        } catch (e: any) {
            return { valid: false, error: e.message };
        }
    };

    const processURL = (val: string, currentMode: 'encode' | 'decode') => {
        if (!val.trim()) {
            setOutput('');
            return;
        }
        if (currentMode === 'encode') {
            setOutput(encodeURIComponent(val));
        } else {
            try {
                setOutput(decodeURIComponent(val));
            } catch {
                setOutput('Invalid encoded URL');
            }
        }
    };

    const handleModeChange = (newMode: 'encode' | 'decode') => {
        setMode(newMode);
        if (type === 'url-encoder-decoder') {
            processURL(input, newMode);
        }
    };

    const jsonToCSV = () => {
        try {
            const data = JSON.parse(input);
            let csv = '';

            if (Array.isArray(data) && data.length > 0) {
                const headers = Object.keys(data[0]);
                csv = headers.join(',') + '\n';
                data.forEach((row: any) => {
                    const values = headers.map(header => {
                        const value = row[header];
                        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    });
                    csv += values.join(',') + '\n';
                });
            } else if (typeof data === 'object' && !Array.isArray(data)) {
                const headers = Object.keys(data);
                csv = headers.join(',') + '\n';
                csv += Object.values(data).join(',');
            }

            setModal({
                show: true,
                title: 'JSON to CSV Conversion',
                content: csv,
                type: 'csv'
            });
        } catch {
        }
    };

    const jsonToXML = () => {
        try {
            const data = JSON.parse(input);
            const convertToXML = (obj: any, rootName = 'root'): string => {
                let xml = '';
                const objectToXML = (obj: any, indent = ''): string => {
                    let result = '';
                    if (Array.isArray(obj)) {
                        obj.forEach(item => {
                            result += `${indent}<item>\n`;
                            result += objectToXML(item, indent + '  ');
                            result += `${indent}</item>\n`;
                        });
                    } else if (typeof obj === 'object' && obj !== null) {
                        Object.entries(obj).forEach(([key, value]) => {
                            if (typeof value === 'object' && value !== null) {
                                result += `${indent}<${key}>\n`;
                                result += objectToXML(value, indent + '  ');
                                result += `${indent}</${key}>\n`;
                            } else {
                                result += `${indent}<${key}>${value}</${key}>\n`;
                            }
                        });
                    } else {
                        result += `${indent}${obj}\n`;
                    }
                    return result;
                };
                xml += `<${rootName}>\n`;
                xml += objectToXML(obj, '  ');
                xml += `</${rootName}>`;
                return xml;
            };

            const xmlOutput = convertToXML(data);
            setModal({
                show: true,
                title: 'JSON to XML Conversion',
                content: xmlOutput,
                type: 'xml'
            });
        } catch {
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
        }
    };

    const handleDownload = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = type === 'json-formatter' ? 'formatted.json' : 'encoded.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const copyModalContent = async () => {
        try {
            await navigator.clipboard.writeText(modal.content);
        } catch {
        }
    };

    const downloadModalContent = () => {
        const blob = new Blob([modal.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = modal.type === 'csv' ? 'data.csv' : 'data.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const renderDevTool = () => {
        switch (type) {
            case 'json-formatter':
                return (
                    <JSONFormatter
                        input={input}
                        setInput={setInput}
                        output={output}
                        setOutput={setOutput}
                        jsonMode={jsonMode}
                        setJsonMode={setJsonMode}
                        validationError={validationError}
                        setValidationError={setValidationError}
                        showConverters={showConverters}
                        setShowConverters={setShowConverters}
                        onConvertToCSV={jsonToCSV}
                        onConvertToXML={jsonToXML}
                        copied={copied}
                        onCopy={handleCopy}
                        onDownload={handleDownload}
                    />
                );
            case 'url-encoder-decoder':
                return (
                    <URLEncoderDecoder
                        input={input}
                        setInput={setInput}
                        output={output}
                        mode={mode}
                        setMode={handleModeChange}
                        copied={copied}
                        onCopy={handleCopy}
                        onDownload={handleDownload}
                    />
                );
            default:
                return (
                    <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div className="bg-muted/30 rounded-[2.5rem] border-2 border-border overflow-hidden shadow-inner flex flex-col min-h-[500px]">
                            <div className="p-6 flex items-center gap-3 border-b-2 border-border bg-muted/50">
                                <h3 className="text-foreground font-black text-sm uppercase tracking-[0.2em]">Input Area</h3>
                            </div>
                            <textarea
                                className="flex-1 w-full p-8 text-sm leading-relaxed resize-none focus:outline-none text-foreground bg-input font-mono placeholder:opacity-30"
                                placeholder="Paste your content here..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                            />
                        </div>
                        <div className="bg-muted/30 rounded-[2.5rem] border-2 border-border overflow-hidden shadow-inner flex flex-col min-h-[500px]">
                            <div className="p-6 flex items-center justify-between border-b-2 border-border bg-muted/50">
                                <h3 className="text-foreground font-black text-sm uppercase tracking-[0.2em]">Output Result</h3>
                                {output && (
                                    <button
                                        onClick={handleCopy}
                                        className={`px-6 py-2 rounded-xl transition-all font-black flex items-center gap-3 text-xs ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary text-white hover:scale-105 active:scale-95'}`}
                                    >
                                        {copied ? 'COPIED' : 'COPY ALL'}
                                    </button>
                                )}
                            </div>
                            <textarea
                                readOnly
                                className="flex-1 w-full p-8 text-sm leading-relaxed resize-none focus:outline-none text-foreground bg-input font-mono placeholder:opacity-20"
                                value={output}
                                placeholder="Output will appear here..."
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <ScrollableNav items={devNavTools} activeToolId={type} />
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-8">
                    {renderDevTool()}
                </div>
            </div>
        </div>
    );
}

