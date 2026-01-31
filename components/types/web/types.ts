export interface WebToolProps {
    type:
    | 'google-serp-simulator'
    | 'htaccess-redirect-generator'
    | 'my-ip-address'
    | 'screen-resolution-simulator'
    | 'responsive-checker'
    | 'browser-info';
}

export interface SERPData {
    title: string;
    desc: string;
    url: string;
}

export interface RedirectData {
    from: string;
    to: string;
    type: '301' | '302';
}

export interface ResolutionData {
    w: number;
    h: number;
    label: string;
}

export interface SEOAnalysisResult {
    score: number;
    url: string;
    metrics: {
        meta: { score: number; status: string };
        content: { score: number; status?: string };
        mobile: { score: number; status?: string };
        tech: { score: number; status?: string };
    };
    issues: Array<{ type: 'success' | 'warning' | 'error'; title: string; desc: string }>;
}

