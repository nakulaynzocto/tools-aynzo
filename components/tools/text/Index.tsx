"use client";
import { useState } from 'react';
import { FileText, Hash, Type, MoveVertical, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { TextToolProps } from '@/components/types/text/types';
import { useTextProcessing } from '@/components/hooks/text/useTextProcessing';
import { transformText, findReplace } from '@/components/utils/text/textProcessing';
import { TextEditor } from './TextEditor';
import { TextMetrics } from './TextMetrics';
import { TextFindReplace } from './TextFindReplace';

export default function TextToolsIndex({ type }: TextToolProps) {
    const t = useTranslations('TextTools');
    const textNavTools = [
        {
            category: 'Analysis',
            tools: [
                { id: 'word-counter', label: 'Word Count', icon: FileText },
                { id: 'character-counter', label: 'Char Count', icon: Hash },
            ]
        },
        {
            category: 'Manipulation',
            tools: [
                { id: 'text-case-converter', label: 'Case Converter', icon: Type },
                { id: 'remove-line-breaks', label: 'Line Breaks', icon: MoveVertical },
                { id: 'reverse-text', label: 'Reverse Text', icon: RefreshCw },
            ]
        }
    ];

    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [cleaning, setCleaning] = useState(false);

    const { stats, keywordDensity } = useTextProcessing(input);

    const handleAction = (action: string) => {
        setCleaning(true);
        setTimeout(() => {
            const result = transformText(input, action);
            setInput(result);
            setCleaning(false);
        }, 200);
    };

    const handleFindReplace = (option: 'find' | 'replaceAll') => {
        if (!findText) return;
        if (option === 'replaceAll') {
            const result = findReplace(input, findText, replaceText);
            setInput(result);
            setFindText('');
            setReplaceText('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadText = () => {
        const blob = new Blob([input], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'clean-text.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-500">
            <ScrollableNav items={textNavTools} activeToolId={type} />
            <div className="grid lg:grid-cols-[1fr,300px] gap-6 items-stretch lg:h-[480px] h-auto">
                <div className="flex flex-col h-full min-h-0">
                    <TextEditor
                        input={input}
                        setInput={setInput}
                        copied={copied}
                        onCopy={copyToClipboard}
                        onDownload={downloadText}
                        onClear={() => setInput('')}
                        onAction={handleAction}
                        keywordDensity={keywordDensity}
                    />
                </div>
                <div className="flex flex-col gap-4 h-full min-h-0 overflow-y-auto no-scrollbar pr-1">
                    <TextMetrics stats={stats} />
                    <TextFindReplace
                        findText={findText}
                        setFindText={setFindText}
                        replaceText={replaceText}
                        setReplaceText={setReplaceText}
                        onReplaceAll={() => handleFindReplace('replaceAll')}
                    />
                </div>
            </div>
        </div>
    );
}

