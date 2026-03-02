"use client";

import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { tools } from "@/lib/tools";
import { ToolCard } from "./ToolCard";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";

export default function RecentToolsSection() {
    const { recentTools } = usePersistentTools();
    const tCategories = useTranslations('Categories');
    const tTools = useTranslations('Tools');

    if (recentTools.length === 0) return null;

    const recentToolData = recentTools
        .map(slug => tools.find(t => t.slug === slug))
        .filter((t): t is typeof tools[0] => !!t);

    return (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <History size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Recently Used</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recentToolData.map((tool) => (
                    <ToolCard
                        key={`recent-${tool.slug}`}
                        _id={tool.slug}
                        slug={tool.slug}
                        name={tTools.has(`${tool.slug}.name`) ? tTools(`${tool.slug}.name`) : tool.name}
                        description={tTools.has(`${tool.slug}.description`) ? tTools(`${tool.slug}.description`) : tool.description}
                        category={tCategories.has(tool.category) ? tCategories(tool.category) : tool.category}
                        categoryKey={tool.category}
                    />
                ))}
            </div>
            <div className="mt-16 border-b border-border/50" />
        </section>
    );
}
