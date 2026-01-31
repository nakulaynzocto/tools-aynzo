"use client";
import { TechToolProps } from '@/components/types/tech/types';

export default function TechToolsIndex({ type }: TechToolProps) {
    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 text-center">
                    <p className="text-lg font-bold text-foreground mb-2">Tool Implementation Coming Soon</p>
                    <p className="text-sm text-muted-foreground">The {type} tool is currently under development.</p>
                </div>
            </div>
        </div>
    );
}
