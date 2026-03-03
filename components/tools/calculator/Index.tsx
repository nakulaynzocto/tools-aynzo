"use client";
import { Calculator, Calendar, Activity, Percent, DollarSign, PieChart, TrendingUp, Home, Landmark, Coins, Target, Megaphone, ArrowDownNarrowWide } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { useTranslations } from 'next-intl';
import { CalculatorToolProps } from '@/components/types/calculator/types';
import { AgeCalculator } from './AgeCalculator';
import { BMICalculator } from './BMICalculator';
import { PercentageCalculator } from './PercentageCalculator';
import { GSTCalculator } from './GSTCalculator';
import { EMICalculator } from './EMICalculator';
import { DiscountCalculator } from './DiscountCalculator';
import { CompoundInterestCalculator } from './CompoundInterestCalculator';
import { MortgageCalculator } from './MortgageCalculator';
import { SIPCalculator } from './SIPCalculator';
import { CryptoCalculator } from './CryptoCalculator';
import { InflationCalculator } from './InflationCalculator';
import { ROICalculator } from './ROICalculator';
import { CPMCalculator } from './CPMCalculator';
import { SalesTaxCalculator } from './SalesTaxCalculator';

export default function CalculatorToolsIndex({ type }: CalculatorToolProps) {
    const t = useTranslations('CalculatorNav');

    const calculatorNavTools = [
        {
            category: t('finance'),
            tools: [
                { id: 'compound-interest-calculator', label: 'Compound Interest', icon: TrendingUp },
                { id: 'mortgage-calculator', label: 'Mortgage', icon: Home },
                { id: 'sip-calculator', label: 'SIP', icon: PieChart },
                { id: 'emi-calculator', label: t('emi'), icon: DollarSign },
                { id: 'gst-calculator', label: t('gst'), icon: Landmark },
                { id: 'sales-tax-calculator', label: 'Sales Tax', icon: Calculator },
                { id: 'discount-calculator', label: t('discount'), icon: Percent },
            ]
        },
        {
            category: t('business'),
            tools: [
                { id: 'crypto-profit-calculator', label: 'Crypto Profit', icon: Coins },
                { id: 'roi-calculator', label: 'ROI', icon: Target },
                { id: 'cpm-calculator', label: 'CPM', icon: Megaphone },
                { id: 'inflation-calculator', label: 'Inflation', icon: ArrowDownNarrowWide },
            ]
        },
        {
            category: t('healthLife'),
            tools: [
                { id: 'age-calculator', label: t('age'), icon: Calendar },
                { id: 'bmi-calculator', label: t('bmi'), icon: Activity },
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
            case 'compound-interest-calculator':
                return <CompoundInterestCalculator />;
            case 'mortgage-calculator':
                return <MortgageCalculator />;
            case 'sip-calculator':
                return <SIPCalculator />;
            case 'crypto-profit-calculator':
                return <CryptoCalculator />;
            case 'inflation-calculator':
                return <InflationCalculator />;
            case 'roi-calculator':
                return <ROICalculator />;
            case 'cpm-calculator':
                return <CPMCalculator />;
            case 'sales-tax-calculator':
                return <SalesTaxCalculator />;
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

