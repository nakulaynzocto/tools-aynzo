'use client';

import { useEffect } from 'react';
import { Link } from '@/navigation';
import { AlertCircle, RotateCcw, Home, MessageSquare } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Platform Error Caught:', error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Aesthetic Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-slate-900/5 rounded-full blur-[100px] animate-pulse delay-700" />
            
            <div className="relative z-10 w-full max-w-xl text-center space-y-8">
                {/* Icon Container */}
                <div className="flex justify-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-red-100 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-50" />
                        <div className="relative bg-white border border-red-50 p-6 rounded-[2rem] shadow-xl text-[#D11414]">
                            <AlertCircle size={48} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                        Engine <span className="text-[#D11414]">Interrupted</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                        The platform encountered an unexpected sequence. Our dynamic engine is already analyzing the telemetry to prevent this from happening again.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-[#D11414] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                    >
                        <RotateCcw size={18} />
                        <span>Re-Initialize</span>
                    </button>
                    
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black uppercase italic tracking-widest hover:border-[#D11414] hover:text-[#D11414] transition-all shadow-sm"
                    >
                        <Home size={18} />
                        <span>Core Deck</span>
                    </Link>
                </div>

                {/* Footer / Debug Info */}
                <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Error Digest: {error.digest || 'PLATFORM_SIG_772'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
