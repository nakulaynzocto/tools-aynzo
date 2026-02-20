"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NextTopLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // This effect runs whenever the pathname or searchParams changes
        // But since Next.js App Router updates these AFTER the navigation is done,
        // we can use this to STOP the loading bar.
        setLoading(false);
        setProgress(100);
        const timer = setTimeout(() => setProgress(0), 400);
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    useEffect(() => {
        // To START the loading bar, we need to intercept link clicks.
        // This is a common pattern in Next.js apps to provide visual feedback.
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.target as HTMLAnchorElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
                if (anchor.href !== window.location.href) {
                    setLoading(true);
                    setProgress(20);
                }
            }
        };

        window.addEventListener("click", handleAnchorClick);
        return () => window.removeEventListener("click", handleAnchorClick);
    }, []);

    useEffect(() => {
        if (loading) {
            const timer = setInterval(() => {
                setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
            }, 200);
            return () => clearInterval(timer);
        }
    }, [loading]);

    if (progress === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none"
        >
            <div
                className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_#3b82f6]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
