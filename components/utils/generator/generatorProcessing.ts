import { v4 as uuidv4 } from 'uuid';

export const generateRandomNumber = (min: number, max: number): string => {
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export const generateRandomString = (length: number, includeLetters: boolean, includeNumbers: boolean, includeSymbols: boolean): string => {
    let charset = '';
    if (includeLetters) charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
};

export const generateUUID = (): string => {
    return uuidv4();
};

export const generateColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};


