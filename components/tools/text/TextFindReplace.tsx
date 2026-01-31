"use client";
import { Search } from 'lucide-react';

interface TextFindReplaceProps {
    findText: string;
    setFindText: (value: string) => void;
    replaceText: string;
    setReplaceText: (value: string) => void;
    onReplaceAll: () => void;
}

export function TextFindReplace({ findText, setFindText, replaceText, setReplaceText, onReplaceAll }: TextFindReplaceProps) {
    return (
        <div className="bg-card rounded-3xl border-2 border-border shadow-xl p-5 mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-primary" /> Replace
            </h3>
            <div className="space-y-2">
                <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Find..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-[11px] font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
                <input
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Replace..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-xl text-[11px] font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
                <button
                    onClick={onReplaceAll}
                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all"
                >
                    Replace All
                </button>
            </div>
        </div>
    );
}


