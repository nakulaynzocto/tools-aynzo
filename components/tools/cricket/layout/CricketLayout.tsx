"use client";
import CricketNavbar from "./CricketNavbar";
import CricketFooter from "./CricketFooter";
import CricketBottomNav from "./CricketBottomNav";
import { ThemeProvider } from "@/components/theme-provider";

export default function CricketLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-slate-900 font-sans selection:bg-red-500/30">
            {/* Dream11 Style Theme Override (Light/White) */}
            <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
                <div className="flex flex-col min-h-screen">
                    <CricketNavbar />
                    {/* Added pb-24 for mobile to avoid content being hidden by bottom nav */}
                    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 animate-in fade-in duration-700">
                        {children}
                    </main>
                    <CricketFooter />
                    <CricketBottomNav />
                </div>
            </ThemeProvider>
            
            {/* Background Decor - Subtle soft gradients like Dream11 */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-50">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-[#D11414]/5 blur-[80px]" />
            </div>
        </div>
    );
}
