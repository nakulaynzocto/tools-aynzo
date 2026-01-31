"use client";
import React from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    className?: string;
    label?: string;
}

export function AdUnit({ slot, format = 'auto', className = '', label }: AdUnitProps) {
    const [isVisible, setIsVisible] = React.useState(true);

    // Check if we are in development mode to show placeholders
    const isDev = process.env.NODE_ENV === 'development';

    if (!isVisible) return null;

    if (isDev) {
        return (
            <div
                className={`relative w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 font-mono text-xs p-4 group ${className}`}
                style={{ minHeight: format === 'horizontal' ? '90px' : '250px' }}
            >
                <div className="text-center">
                    <p className="font-bold">AD SLOT: {slot}</p>
                    <p>{format.toUpperCase()}</p>
                    {label && <p className="text-[10px] mt-1 text-gray-300">{label}</p>}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hide Ad Placeholder"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        );
    }

    // Production: Return actual AdSense code
    // The ID is loaded from .env. If missing, it will safeguard against errors.
    const adClient = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-placeholder';

    return (
        <div className={`ad-container ${className}`}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={adClient}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"></ins>
            {/* We assume the script is loaded globally in layout or handled by a script tag strategy */}
        </div>
    );
}
