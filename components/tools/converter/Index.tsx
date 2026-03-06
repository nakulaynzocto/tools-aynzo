"use client";
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { useTranslations } from 'next-intl';
import { ConverterToolProps } from '@/components/types/converter/types';
import { UnitConverter } from './UnitConverter';
import { CurrencyConverter } from './CurrencyConverter';
import { ColorConverter } from './ColorConverter';
import { BinaryToText } from './BinaryToText';
import { HexToDecimal } from './HexToDecimal';
import { RomanNumeralConverter } from './RomanNumeralConverter';
import { Calculator, DollarSign, Palette, Binary, Hash, BookOpen } from 'lucide-react';

export default function ConverterToolsIndex({ type }: ConverterToolProps) {
    const t = useTranslations('ConverterNav');
    const converterNavTools = [
        {
            category: t('units'),
            tools: [
                { id: 'unit-converter', label: t('unitConverter'), icon: Calculator },
            ]
        },
        {
            category: t('currency'),
            tools: [
                { id: 'currency-converter', label: t('currencyConverter'), icon: DollarSign },
            ]
        },
        {
            category: t('colors'),
            tools: [
                { id: 'color-converter', label: t('colorConverter'), icon: Palette },
            ]
        },
        {
            category: t('data'),
            tools: [
                { id: 'binary-to-text', label: t('binaryToText'), icon: Binary },
                { id: 'hex-to-decimal', label: t('hexToDecimal'), icon: Hash },
                { id: 'roman-numeral', label: t('romanNumeral'), icon: BookOpen },
            ]
        }
    ];

    const activeCategory = converterNavTools.find(cat =>
        cat.tools.some(t => t.id === type)
    );

    const isConverterTool = converterNavTools.some(cat =>
        cat.tools.some(t => t.id === type)
    );

    const renderConverter = () => {
        switch (type) {
            case 'unit-converter':
                return <UnitConverter />;
            case 'currency-converter':
                return <CurrencyConverter />;
            case 'color-converter':
                return <ColorConverter />;
            case 'binary-to-text':
                return <BinaryToText />;
            case 'hex-to-decimal':
                return <HexToDecimal />;
            case 'roman-numeral':
                return <RomanNumeralConverter />;
            default:
                return (
                    <div className="p-8 text-center">
                        <p className="text-lg font-bold text-foreground mb-2">Tool not found</p>
                        <p className="text-sm text-muted-foreground">The {type} tool is not recognized.</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4">
            {isConverterTool && activeCategory && (
                <ScrollableNav
                    items={[{ category: activeCategory.category, tools: activeCategory.tools }]}
                    activeToolId={type}
                />
            )}

            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6">
                    {renderConverter()}
                </div>
            </div>
        </div>
    );
}
