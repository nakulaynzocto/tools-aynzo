export interface CryptoToolProps {
    type: 'base64-encoder' | 'md5-hash' | 'sha256-hash' | 'sha512-hash' | 'bcrypt-generator' | 'uuid-generator' | 'qr-code-generator';
}

export interface PasswordGeneratorOptions {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}


