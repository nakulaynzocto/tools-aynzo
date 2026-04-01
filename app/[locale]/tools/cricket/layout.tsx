import CricketLayout from "@/components/tools/cricket/layout/CricketLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "IPL AI Predictor 2026: Aaj Ka Match Kaun Jeetega? Today Prediction",
    description: "Best IPL 2026 match predictions, fantasy teams, and playing XI updates using AI. Aaj ka match prediction, pitch report, and Dream11 team suggestions in Hinglish.",
    keywords: "ipl 2026 prediction, aaj ka match kaun jeetega, dream11 team today, ipl ai predictor, cricket fantasy tips",
    openGraph: {
        title: "IPL AI Predictor 2026: Match Prediction Today",
        description: "Win big this IPL season with AI-powered match predictions and fantasy teams. Aaj ka match updates live.",
        images: ["https://tools.aynzo.com/cricket-og.png"]
    }
}

export default function RootCricketLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CricketLayout>
            {children}
        </CricketLayout>
    );
}
