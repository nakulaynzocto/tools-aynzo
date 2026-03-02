"use client";

import { useState, useEffect } from "react";

const RECENT_TOOLS_KEY = "aynzo_recent_tools";
const FAVORITE_TOOLS_KEY = "aynzo_favorite_tools";
const MAX_RECENT = 4;

export function usePersistentTools() {
    const [recentTools, setRecentTools] = useState<string[]>([]);
    const [favoriteTools, setFavoriteTools] = useState<string[]>([]);

    useEffect(() => {
        const savedRecent = localStorage.getItem(RECENT_TOOLS_KEY);
        const savedFavorites = localStorage.getItem(FAVORITE_TOOLS_KEY);
        
        if (savedRecent) setRecentTools(JSON.parse(savedRecent));
        if (savedFavorites) setFavoriteTools(JSON.parse(savedFavorites));
    }, []);

    const addRecentTool = (slug: string) => {
        const newRecent = [slug, ...recentTools.filter(s => s !== slug)].slice(0, MAX_RECENT);
        setRecentTools(newRecent);
        localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(newRecent));
    };

    const toggleFavorite = (slug: string) => {
        let newFavorites;
        if (favoriteTools.includes(slug)) {
            newFavorites = favoriteTools.filter(s => s !== slug);
        } else {
            newFavorites = [...favoriteTools, slug];
        }
        setFavoriteTools(newFavorites);
        localStorage.setItem(FAVORITE_TOOLS_KEY, JSON.stringify(newFavorites));
    };

    const isFavorite = (slug: string) => favoriteTools.includes(slug);

    return {
        recentTools,
        favoriteTools,
        addRecentTool,
        toggleFavorite,
        isFavorite
    };
}

export default usePersistentTools;
