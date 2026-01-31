"use client";
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { ConverterToolProps } from '@/components/types/converter/types';
import { UnitConverter } from './UnitConverter';
import { CurrencyConverter } from './CurrencyConverter';
import { ColorConverter } from './ColorConverter';
import { BinaryToText } from './BinaryToText';
import { HexToDecimal } from './HexToDecimal';
import { RomanNumeralConverter } from './RomanNumeralConverter';
import { Calculator, DollarSign, Palette, Binary, Hash, BookOpen } from 'lucide-react';

export default function ConverterToolsIndex({ type }: ConverterToolProps) {
    const converterNavTools = [
        {
            category: 'UNITS',
            tools: [
                { id: 'unit-converter', label: 'Unit Converter', icon: Calculator },
            ]
        },
        {
            category: 'CURRENCY',
            tools: [
                { id: 'currency-converter', label: 'Currency Converter', icon: DollarSign },
            ]
        },
        {
            category: 'COLORS',
            tools: [
                { id: 'color-converter', label: 'Color Converter', icon: Palette },
            ]
        },
        {
            category: 'DATA',
            tools: [
                { id: 'binary-to-text', label: 'Binary to Text', icon: Binary },
                { id: 'hex-to-decimal', label: 'Hex to Decimal', icon: Hash },
                { id: 'roman-numeral', label: 'Roman Numeral', icon: BookOpen },
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
