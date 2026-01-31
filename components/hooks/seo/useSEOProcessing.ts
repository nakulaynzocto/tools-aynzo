import { useState, useEffect } from 'react';
import { SeoToolProps, MetaData, OpenGraphData, TwitterCardData, RobotsData, SitemapData } from '@/components/types/seo/types';
import {
    generateMetaTags,
    generateOpenGraph,
    generateTwitterCard,
    generateRobotsTxt,
    generateSitemap,
} from '@/components/utils/seo/seoProcessing';

export const useSEOProcessing = (
    type: SeoToolProps['type'],
    meta: MetaData,
    og: OpenGraphData,
    twitter: TwitterCardData,
    robots: RobotsData,
    sitemap: SitemapData
) => {
    const [result, setResult] = useState('');

    useEffect(() => {
        const generate = () => {
            let output = '';
            switch (type) {
                case 'meta-tag-generator':
                    output = generateMetaTags(meta);
                    break;
                case 'open-graph-generator':
                    output = generateOpenGraph(og);
                    break;
                case 'twitter-card-generator':
                    output = generateTwitterCard(twitter);
                    break;
                case 'robots-txt-generator':
                    output = generateRobotsTxt(robots);
                    break;
                case 'xml-sitemap-generator':
                    output = generateSitemap(sitemap);
                    break;
            }
            setResult(output.trim());
        };

        generate();
    }, [type, meta, og, twitter, robots, sitemap]);

    return { result };
};


