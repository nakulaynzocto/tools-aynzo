"use client";
import { useState, useEffect } from 'react';
import { Code, Link2, Copy, CheckCircle2, Download, FileJson, FileText, FileCode, Minimize2, Maximize2, AlertCircle, X, Split, Braces, Terminal, Search } from 'lucide-react';
import { ScrollableNav } from '@/components/ScrollableNav';
import { cn } from '@/utils/cn';


interface DevToolsProps {
  type: 'json-formatter' | 'url-encoder-decoder';
}

export default function DevTools({ type }: DevToolsProps) {
  // Navigation Configuration
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

  const handleInputChange = (val: string) => {
    setInput(val);
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    if (type === 'url-encoder-decoder') {
      processURL(input, newMode);
    }
  };

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

  const handleAction = () => {
    if (type === 'json-formatter') {
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
  };

  const jsonToCSV = () => {
    try {
      const data = JSON.parse(input);
      let csv = '';

      if (Array.isArray(data) && data.length > 0) {
        // Get headers from first object
        const headers = Object.keys(data[0]);
        csv = headers.join(',') + '\\n';

        // Add rows
        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          });
          csv += values.join(',') + '\\n';
        });
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        // Single object
        const headers = Object.keys(data);
        csv = headers.join(',') + '\\n';
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

      const convertToXML = (obj: any, rootName: string = 'root'): string => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\\n`;

        const objectToXML = (obj: any, indent: string = ''): string => {
          let result = '';

          if (Array.isArray(obj)) {
            obj.forEach(item => {
              result += `${indent}<item>\\n`;
              result += objectToXML(item, indent + '  ');
              result += `${indent}</item>\\n`;
            });
          } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                result += `${indent}<${key}>\\n`;
                result += objectToXML(value, indent + '  ');
                result += `${indent}</${key}>\\n`;
              } else {
                result += `${indent}<${key}>${value}</${key}>\\n`;
              }
            });
          } else {
            result += `${indent}${obj}\\n`;
          }

          return result;
        };

        xml += `<${rootName}>\\n`;
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dev Tools Navigation */}
      <ScrollableNav items={devNavTools} activeToolId={type} />
      <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">

        <div className="p-8 space-y-8">
          <div className="flex flex-wrap gap-3 items-center">
            {type === 'json-formatter' && (
              <div className="bg-muted p-1 rounded-xl border-2 border-border shadow-sm flex gap-1">
                <button
                  className={`px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm border ${jsonMode === 'beautify'
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                    }`}
                  onClick={() => setJsonMode('beautify')}
                >
                  <Maximize2 className="h-4 w-4" />
                  Beautify
                </button>
                <button
                  className={`px-5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm border ${jsonMode === 'minify'
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                    }`}
                  onClick={() => setJsonMode('minify')}
                >
                  <Minimize2 className="h-4 w-4" />
                  Minify
                </button>
              </div>
            )}

            {type === 'url-encoder-decoder' && (
              <div className="bg-muted p-1 rounded-xl border-2 border-border shadow-sm flex gap-1">
                <button
                  className={`px-6 py-2 rounded-lg font-bold transition-all text-sm border ${mode === 'encode'
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                    }`}
                  onClick={() => handleModeChange('encode')}
                >
                  Encode
                </button>
                <button
                  className={`px-6 py-2 rounded-lg font-bold transition-all text-sm border ${mode === 'decode'
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-transparent text-foreground border-border hover:bg-primary/10 hover:border-primary active:scale-95'
                    }`}
                  onClick={() => handleModeChange('decode')}
                >
                  Decode
                </button>
              </div>
            )}


            {type === 'json-formatter' && (
              <button
                onClick={() => setShowConverters(!showConverters)}
                disabled={!input.trim()}
                className="px-4 py-3 bg-secondary text-foreground border-2 border-border rounded-xl hover:border-accent transition-all font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileCode className="h-4 w-4" />
                Converters
              </button>
            )}
          </div>

          {/* Validation Error */}
          {type === 'json-formatter' && validationError && (
            <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive mb-1">Invalid JSON</h4>
                <p className="text-sm text-destructive/80">{validationError}</p>
              </div>
            </div>
          )}

          {/* Converters Panel */}
          {type === 'json-formatter' && showConverters && (
            <div className="bg-card rounded-xl border-2 border-border p-4 shadow-sm">
              <h4 className="text-primary font-semibold mb-3 flex items-center gap-2 text-sm">
                <FileCode className="h-4 w-4" />
                Format Converters
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={jsonToCSV}
                  disabled={!input.trim()}
                  className="px-4 py-3 bg-secondary text-foreground border border-border rounded-lg hover:bg-muted transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="h-4 w-4" />
                  JSON to CSV
                </button>
                <button
                  onClick={jsonToXML}
                  disabled={!input.trim()}
                  className="px-4 py-3 bg-secondary text-foreground border border-border rounded-lg hover:bg-muted transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileCode className="h-4 w-4" />
                  JSON to XML
                </button>
              </div>
            </div>
          )}

          {/* Input/Output Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Input Panel */}
            <div className="bg-muted/30 rounded-[2.5rem] border-2 border-border overflow-hidden shadow-inner flex flex-col min-h-[500px]">
              <div className="p-6 flex items-center gap-3 border-b-2 border-border bg-muted/50">
                <div className="p-2 bg-primary/10 rounded-xl">
                  {type === 'json-formatter' ? (
                    <Code className="h-5 w-5 text-primary" />
                  ) : (
                    <Link2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <h3 className="text-foreground font-black text-sm uppercase tracking-[0.2em]">Input Area</h3>
              </div>
              <textarea
                className="flex-1 w-full p-8 text-sm leading-relaxed resize-none focus:outline-none text-foreground bg-input font-mono placeholder:opacity-30"
                placeholder={
                  type === 'json-formatter'
                    ? 'Paste your JSON here...\n\nExample:\n{"name":"John","age":30}'
                    : mode === 'encode'
                      ? 'Enter URL to encode...'
                      : 'Enter encoded URL to decode...'
                }
                value={input}
                onChange={e => handleInputChange(e.target.value)}
              />
            </div>

            {/* Output Panel */}
            <div className="bg-muted/30 rounded-[2.5rem] border-2 border-border overflow-hidden shadow-inner flex flex-col min-h-[500px]">
              <div className="p-6 flex items-center justify-between border-b-2 border-border bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    {type === 'json-formatter' ? (
                      <FileJson className="h-5 w-5 text-accent" />
                    ) : (
                      <Link2 className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <h3 className="text-foreground font-black text-sm uppercase tracking-[0.2em]">Output Result</h3>
                </div>
                {output && (
                  <button
                    onClick={handleCopy}
                    className={`px-6 py-2 rounded-xl transition-all font-black flex items-center gap-3 text-xs ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-primary text-white hover:scale-105 active:scale-95'}`}
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-card rounded-lg border-2 border-border p-4 shadow-sm">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
            <div className="p-1.5 bg-muted rounded-lg border border-border">
              <Code className="h-3 w-3 text-foreground" />
            </div>
            {type === 'json-formatter' ? 'About JSON Formatter' : 'About URL Encoder'}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {type === 'json-formatter'
              ? 'Format, validate, and convert your JSON data. Beautify for readability or minify to save space. Convert to CSV or XML formats.'
              : mode === 'encode'
                ? 'Encode URLs to make them safe for transmission. Special characters are converted to percent-encoded format.'
                : 'Decode percent-encoded URLs back to their original format for easy reading.'}
          </p>
        </div>

        <div className="bg-card rounded-lg border-2 border-border p-4 shadow-sm">
          <h4 className="font-semibold text-primary mb-2 text-sm">Quick Tips</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>{type === 'json-formatter' ? 'Paste valid JSON to format it instantly' : 'Enter any URL to encode/decode'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>{type === 'json-formatter' ? 'Use converters to export to CSV/XML' : 'Encoded URLs are safe for web transmission'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span>{type === 'json-formatter' ? 'Validation errors show exact issues' : 'Decode to see original URL parameters'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Converter Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModal({ ...modal, show: false })}>
          <div
            className="bg-card rounded-xl border-2 border-border shadow-2xl max-w-3xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-foreground font-semibold text-lg">{modal.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyModalContent}
                  className="px-4 py-2 bg-card hover:bg-muted text-foreground rounded-lg transition-all font-medium flex items-center gap-2 text-sm border border-border"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button
                  onClick={downloadModalContent}
                  className="px-4 py-2 bg-card hover:bg-muted text-foreground rounded-lg transition-all font-medium flex items-center gap-2 text-sm border border-border"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => setModal({ ...modal, show: false })}
                  className="p-1 hover:bg-muted rounded-lg transition-all"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <pre className="text-sm font-mono text-foreground bg-input p-4 rounded-lg border border-border whitespace-pre-wrap">
                {modal.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
