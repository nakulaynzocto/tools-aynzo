"use client";
import { Calculator, Calendar, Activity, Percent, DollarSign, PieChart } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { useTranslations } from 'next-intl';
import { CalculatorToolProps } from '@/components/types/calculator/types';
import { AgeCalculator } from './AgeCalculator';
import { BMICalculator } from './BMICalculator';
import { PercentageCalculator } from './PercentageCalculator';
import { GSTCalculator } from './GSTCalculator';
import { EMICalculator } from './EMICalculator';
import { DiscountCalculator } from './DiscountCalculator';

export default function CalculatorToolsIndex({ type }: CalculatorToolProps) {
    const t = useTranslations('CalculatorNav');

    const calculatorNavTools = [
        {
            category: t('healthLife'),
            tools: [
                { id: 'age-calculator', label: t('age'), icon: Calendar },
                { id: 'bmi-calculator', label: t('bmi'), icon: Activity },
            ]
        },
        {
            category: t('finance'),
            tools: [
                { id: 'gst-calculator', label: t('gst'), icon: DollarSign },
                { id: 'emi-calculator', label: t('emi'), icon: PieChart },
                { id: 'discount-calculator', label: t('discount'), icon: Percent },
            ]
        },
        {
            category: t('math'),
            tools: [
                { id: 'percentage-calculator', label: t('percentage'), icon: Calculator },
            ]
        }
    ];

    const activeCategory = calculatorNavTools.find(cat => cat.tools.some(t => t.id === type));

    const renderCalculator = () => {
        switch (type) {
            case 'age-calculator':
                return <AgeCalculator />;
            case 'bmi-calculator':
                return <BMICalculator />;
            case 'percentage-calculator':
                return <PercentageCalculator />;
            case 'gst-calculator':
                return <GSTCalculator />;
            case 'emi-calculator':
                return <EMICalculator />;
            case 'discount-calculator':
                return <DiscountCalculator />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {activeCategory && (
                <ScrollableNav items={[{ category: activeCategory.category, tools: activeCategory.tools }]} activeToolId={type} />
            )}
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl p-8">
                {renderCalculator()}
            </div>
        </div>
    );
}

