import { useState, useEffect } from 'react';
import { WebToolProps, RedirectData } from '@/components/types/web/types';
import { generateHtaccessRedirect, analyzeSEO, getBrowserInfo, fetchIPAddress } from '@/components/utils/web/webProcessing';

export const useWebProcessing = (type: WebToolProps['type'], redirect?: RedirectData) => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (type === 'browser-info') {
            setResult(getBrowserInfo());
        }
        if (type === 'my-ip-address') {
            setLoading(true);
            fetchIPAddress()
                .then(ip => setResult(ip))
                .catch(() => setResult('Unable to fetch'))
                .finally(() => setLoading(false));
        }
        if (type === 'htaccess-redirect-generator' && redirect) {
            setResult(generateHtaccessRedirect(redirect));
        }
    }, [type, redirect]);

    const analyzeSEOUrl = async (url: string) => {
        setLoading(true);
        try {
            const analysis = await analyzeSEO(url);
            setResult(analysis);
        } catch (error) {
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return { result, loading, analyzeSEOUrl };
};

