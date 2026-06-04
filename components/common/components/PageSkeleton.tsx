import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
    return (
        <div className="animate-in fade-in space-y-6 duration-500 p-4 max-w-7xl mx-auto">
            {/* Page Header Skeleton */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 sm:w-64 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-4 w-32 sm:w-48 bg-gray-200 dark:bg-gray-800" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Main Content Area Skeleton */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left/Main Column (Tool Area) */}
                <div className="space-y-6 lg:col-span-2">
                    <Skeleton className="h-[400px] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                </div>

                {/* Right Column / Sidebar */}
                <div className="space-y-6">
                    <Skeleton className="h-[300px] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-[200px] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
                ))}
            </div>
        </div>
    );
}

export function CalculatorSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* ScrollableNav Placeholder */}
            <Skeleton className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            
            {/* Main Widget Container */}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl p-8 min-h-[500px] flex flex-col md:flex-row gap-8">
                {/* Inputs Left */}
                <div className="flex-1 space-y-6">
                    <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="space-y-2">
                                <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                                <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl mt-8" />
                </div>
                
                {/* Results Right */}
                <div className="w-full md:w-[350px] bg-secondary/10 rounded-2xl p-6 border border-border/80 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                        <Skeleton className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    </div>
                    <Skeleton className="h-40 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export function TextSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-4 px-2 sm:px-4 animate-in fade-in duration-500">
            {/* ScrollableNav Placeholder */}
            <Skeleton className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            
            {/* Main Editor + Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4 sm:gap-6 items-start lg:min-h-[480px]">
                {/* Left/Main Column: TextEditor Placeholder */}
                <div className="flex flex-col min-h-[500px] lg:h-full space-y-4 bg-card rounded-2xl sm:rounded-[2.5rem] border-2 border-border shadow-2xl p-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                            <Skeleton className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                        </div>
                    </div>
                    <Skeleton className="h-[350px] w-full bg-gray-100 dark:bg-gray-900 rounded-2xl" />
                </div>
                
                {/* Right Column: TextMetrics Placeholder */}
                <div className="flex flex-col gap-4">
                    <div className="bg-card rounded-2xl sm:rounded-3xl border-2 border-border shadow-xl p-3 sm:p-5 space-y-3 sm:space-y-4">
                        <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-900" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ImageSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-4 px-2 sm:px-4 animate-in fade-in duration-500">
            {/* ScrollableNav Placeholder */}
            <Skeleton className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            
            {/* Main Upload Area - matches FileUploadArea with border-dashed, shadow-sm and min-h */}
            <div className="bg-card rounded-3xl border-2 border-dashed border-border shadow-sm flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] p-6 sm:p-8 space-y-6">
                <Skeleton className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="space-y-2 text-center w-full max-w-sm">
                    <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
                    <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
                </div>
                <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
        </div>
    );
}

export function PdfSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-500">
            {/* ScrollableNav Placeholder */}
            <Skeleton className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            
            {/* Outer Solid Wrapper Card */}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6 min-h-[300px] flex flex-col items-center justify-center space-y-6">
                    <Skeleton className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
                    <div className="space-y-2 text-center w-full max-w-sm">
                        <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
                        <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
                    </div>
                    <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function CodeEditorSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* ScrollableNav Placeholder */}
            <Skeleton className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            
            {/* Main Widget Card Wrapper */}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Control Bar Skeleton */}
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                        <Skeleton className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                    </div>
                    
                    {/* Side-by-Side Editor Panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input side */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                                <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
                            </div>
                            <Skeleton className="w-full h-96 bg-gray-100 dark:bg-gray-900 rounded-xl border border-border" />
                        </div>
                        
                        {/* Output side */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                                    <Skeleton className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                                </div>
                            </div>
                            <Skeleton className="w-full h-96 bg-gray-100 dark:bg-gray-900 rounded-xl border border-border" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
