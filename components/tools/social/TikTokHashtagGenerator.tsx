"use client";
import { useState } from 'react';
import { Hash, Copy, Check, Music, Gamepad2, Utensils, Heart, Camera, TrendingUp, Shirt, Globe, Info } from 'lucide-react';

const tiktokHashtagData: Record<string, { tags: string[]; icon: React.ElementType; color: string }> = {
    'Entertainment': { icon: TrendingUp, color: 'text-pink-500', tags: ['#fyp', '#foryou', '#foryoupage', '#viral', '#trending', '#tiktoktrending', '#viraltiktok', '#explore', '#fypシ', '#tiktok', '#entertainment', '#fun', '#comedy', '#funny', '#meme', '#relatable', '#blowthisup', '#blowup'] },
    'Music': { icon: Music, color: 'text-purple-500', tags: ['#music', '#newsong', '#singer', '#musician', '#song', '#lyrics', '#musictiktok', '#musiclover', '#newmusic', '#spotify', '#pop', '#hiphop', '#rnb', '#indie', '#acoustic', '#cover', '#producer', '#beats'] },
    'Gaming': { icon: Gamepad2, color: 'text-blue-500', tags: ['#gaming', '#gamer', '#gamertiktok', '#twitch', '#youtube', '#ps5', '#xbox', '#pcgaming', '#mobilegaming', '#gameplay', '#fortnite', '#minecraft', '#valorant', '#gaming101', '#gamingcommunity', '#esports', '#streamer', '#gg'] },
    'Food': { icon: Utensils, color: 'text-amber-500', tags: ['#food', '#foodtiktok', '#foodie', '#recipe', '#cooking', '#homecooking', '#easyrecipe', '#mealprep', '#healthyfood', '#delicious', '#yummy', '#foodlover', '#chef', '#baking', '#dinner', '#lunch', '#breakfast', '#tasty'] },
    'Fitness': { icon: Heart, color: 'text-red-500', tags: ['#fitness', '#gym', '#workout', '#fit', '#health', '#fitnessmotivation', '#gymlife', '#exercise', '#training', '#weightloss', '#muscle', '#bodybuilding', '#cardio', '#fitfam', '#healthy', '#fitnessjourney', '#transformation', '#gymmotivation'] },
    'Fashion': { icon: Shirt, color: 'text-violet-500', tags: ['#fashion', '#style', '#ootd', '#fashiontiktok', '#outfit', '#aesthetics', '#vintage', '#streetwear', '#styletips', '#clothinghaul', '#fashionista', '#lookbook', '#thrift', '#sustainable', '#maxinalism', '#minimalism', '#fashiontrend', '#designer'] },
    'Travel': { icon: Globe, color: 'text-teal-500', tags: ['#travel', '#traveltiktok', '#vacation', '#explore', '#wanderlust', '#adventure', '#travellife', '#travelblogger', '#worldtravel', '#backpacking', '#traveling', '#travelgram', '#bucketlist', '#traveling2024', '#tripvlog', '#touristattractions', '#traveltips', '#airbnb'] },
    'Photography': { icon: Camera, color: 'text-orange-500', tags: ['#photography', '#photo', '#photographer', '#aesthetic', '#photooftheday', '#instagram', '#portrait', '#landscape', '#cameratips', '#photographytips', '#lightroom', '#presets', '#streetphotography', '#nightphotography', '#goldenhour', '#mobilephotography', '#shotoniphone', '#photoediting'] },
};

export function TikTokHashtagGenerator() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Entertainment');
    const [copied, setCopied] = useState(false);
    const [customTopic, setCustomTopic] = useState('');

    const currentData = tiktokHashtagData[selectedCategory];
    const displayTags = customTopic
        ? [`#${customTopic.toLowerCase().replace(/\s+/g, '')}`, `#${customTopic.toLowerCase().replace(/\s+/g, '')}tiktok`, ...tiktokHashtagData[selectedCategory].tags.slice(0, 15)]
        : currentData.tags;

    const handleCopy = () => {
        navigator.clipboard.writeText(displayTags.join(' '));
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 bg-pink-500/10 rounded-2xl"><Hash className="w-7 h-7 text-pink-500" /></div>
                        TIKTOK HASHTAG GENERATOR
                    </h2>
                    <p className="text-muted-foreground font-medium mt-1">Find trending hashtags to boost your TikTok video reach.</p>
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2.5 px-6 py-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border-2 border-border font-bold text-base">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-pink-500" />}
                    {copied ? 'COPIED ALL!' : 'COPY ALL TAGS'}
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">Your Topic (optional)</label>
                    <input type="text" value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="e.g., skincare, crypto, pets..." className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-pink-500 transition-all font-medium" />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">Category</label>
                    <div className="flex gap-2 flex-wrap">
                        {Object.entries(tiktokHashtagData).map(([cat, { icon: Icon, color }]) => (
                            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${selectedCategory === cat ? `bg-pink-500 text-white border-pink-500` : 'border-border hover:border-pink-500/40'}`}>
                                <Icon className="w-3.5 h-3.5" /> {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-card border-2 border-border rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">{displayTags.length} Hashtags</span>
                        <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-sm transition-all">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy All'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {displayTags.map((tag, i) => (
                            <button key={i} onClick={() => { navigator.clipboard.writeText(tag); }} className="px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/20 rounded-xl font-bold text-sm transition-all" title="Click to copy">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-pink-500/5 border-2 border-pink-500/20 p-6 rounded-3xl flex items-start gap-4">
                <Info className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-bold text-foreground">TikTok Hashtag Strategy</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">Use <strong>3–5 targeted hashtags</strong> rather than stuffing 30. Combine 1–2 broad viral tags (#fyp, #foryou), 2–3 niche-specific tags, and 1 branded tag. Click any tag to copy it individually.</p>
                </div>
            </div>
        </div>
    );
}
