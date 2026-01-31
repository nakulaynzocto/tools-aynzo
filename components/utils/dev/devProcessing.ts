export const formatJSON = (json: string, indent: number = 2): string => {
    try {
        const parsed = JSON.parse(json);
        return JSON.stringify(parsed, null, indent);
    } catch (error) {
        throw new Error('Invalid JSON');
    }
};

export const minifyJSON = (json: string): string => {
    try {
        const parsed = JSON.parse(json);
        return JSON.stringify(parsed);
    } catch (error) {
        throw new Error('Invalid JSON');
    }
};

export const encodeURL = (text: string): string => {
    return encodeURIComponent(text);
};

export const decodeURL = (encoded: string): string => {
    try {
        return decodeURIComponent(encoded);
    } catch {
        throw new Error('Invalid URL encoding');
    }
};

