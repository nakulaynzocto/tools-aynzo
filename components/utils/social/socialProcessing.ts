export const generateWhatsAppLink = (phone: string, message: string = ''): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
};

export const generateTelegramLink = (username: string, message: string = ''): string => {
    const cleanUsername = username.replace('@', '');
    const encodedMessage = encodeURIComponent(message);
    return `https://t.me/${cleanUsername}${message ? `?start=${encodedMessage}` : ''}`;
};

export const generatePayPalLink = (email: string, amount: string = '', currency: string = 'USD'): string => {
    const params = new URLSearchParams();
    params.append('cmd', '_xclick');
    params.append('business', email);
    if (amount) {
        params.append('amount', amount);
        params.append('currency_code', currency);
    }
    return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
};

export const generateInstagramHashtags = (keyword: string): string => {
    const variations = [
        `#${keyword.replace(/\s+/g, '')}`,
        `#${keyword.replace(/\s+/g, '_')}`,
        `#${keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`,
        ...keyword.split(' ').map(w => `#${w}`)
    ];
    return variations.join(' ');
};

export const validateEmail = (email: string): { valid: boolean; message: string } => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return { valid: false, message: 'Email is required' };
    }
    if (!regex.test(email)) {
        return { valid: false, message: 'Invalid email format' };
    }
    return { valid: true, message: 'Valid email address' };
};


