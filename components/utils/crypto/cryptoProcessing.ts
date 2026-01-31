import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { PasswordGeneratorOptions } from '@/components/types/crypto/types';

export const encodeBase64 = (text: string): string => {
    return btoa(unescape(encodeURIComponent(text)));
};

export const decodeBase64 = (encoded: string): string => {
    try {
        return decodeURIComponent(escape(atob(encoded)));
    } catch {
        throw new Error('Invalid Base64 string');
    }
};

export const generateMD5 = (text: string): string => {
    return CryptoJS.MD5(text).toString();
};

export const generateSHA256 = (text: string): string => {
    return CryptoJS.SHA256(text).toString();
};

export const generateSHA512 = (text: string): string => {
    return CryptoJS.SHA512(text).toString();
};

export const generateBcrypt = async (text: string, rounds: number = 10): Promise<string> => {
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(text, salt);
};

export const generateUUID = (): string => {
    return uuidv4();
};

export const generateQRCode = async (text: string): Promise<string> => {
    return await QRCode.toDataURL(text);
};

export const generatePassword = (options: PasswordGeneratorOptions): string => {
    let charset = '';
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    let password = '';
    for (let i = 0; i < options.length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
};

