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
        <div className="bg-card rounded-2xl sm:rounded-3xl border-2 border-border shadow-xl p-3 sm:p-5 mb-3 sm:mb-4">
            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <Search className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" /> Replace
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
                <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Find..."
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-muted border border-border rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
                <input
                    type="text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Replace..."
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-muted border border-border rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                />
                <button
                    onClick={onReplaceAll}
                    className="w-full py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all touch-manipulation active:scale-95"
                >
                    Replace All
                </button>
            </div>
        </div>
    );
}


