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
