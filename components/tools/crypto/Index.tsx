"use client";
import { KeyRound, Shield, Binary, Hash, Fingerprint, QrCode } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { CryptoToolProps } from '@/components/types/crypto/types';
import { Base64Encoder } from './Base64Encoder';
import { HashTools } from './HashTools';
import { BcryptGenerator } from './BcryptGenerator';
import { UUIDGenerator } from './UUIDGenerator';
import { QRCodeGenerator } from './QRCodeGenerator';

export default function CryptoToolsIndex({ type }: CryptoToolProps) {
    const securityNavTools = [
        {
            category: 'Security',
            tools: [
                { id: 'password-generator', label: 'Password', icon: KeyRound },
                { id: 'bcrypt-generator', label: 'Bcrypt', icon: Shield },
            ]
        },
        {
            category: 'Hashing',
            tools: [
                { id: 'base64-encoder', label: 'Base64', icon: Binary },
                { id: 'md5-hash', label: 'MD5', icon: Hash },
                { id: 'sha256-hash', label: 'SHA256', icon: Hash },
                { id: 'sha512-hash', label: 'SHA512', icon: Hash },
            ]
        },
        {
            category: 'Generators',
            tools: [
                { id: 'uuid-generator', label: 'UUID', icon: Fingerprint },
                { id: 'qr-code-generator', label: 'QR Code', icon: QrCode },
            ]
        }
    ];

    const activeCategory = securityNavTools.find((cat: any) => (cat.tools as any[]).some((t: any) => t.id === type));

    const renderCrypto = () => {
        switch (type) {
            case 'base64-encoder':
                return <Base64Encoder />;
            case 'md5-hash':
            case 'sha256-hash':
            case 'sha512-hash':
                return <HashTools type={type} />;
            case 'bcrypt-generator':
                return <BcryptGenerator />;
            case 'uuid-generator':
                return <UUIDGenerator />;
            case 'qr-code-generator':
                return <QRCodeGenerator />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-8">
                    {renderCrypto()}
                </div>
            </div>
        </div>
    );
}

