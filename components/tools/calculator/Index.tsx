"use client";
import { Calculator, Calendar, Activity, Percent, DollarSign, PieChart } from 'lucide-react';
import { ScrollableNav } from '@/components/common/components/ScrollableNav';
import { CalculatorToolProps } from '@/components/types/calculator/types';
import { AgeCalculator } from './AgeCalculator';
import { BMICalculator } from './BMICalculator';
import { PercentageCalculator } from './PercentageCalculator';
import { GSTCalculator } from './GSTCalculator';
import { EMICalculator } from './EMICalculator';
import { DiscountCalculator } from './DiscountCalculator';

export default function CalculatorToolsIndex({ type }: CalculatorToolProps) {
    const calculatorNavTools = [
        {
            category: 'Health & Life',
            tools: [
                { id: 'age-calculator', label: 'Age', icon: Calendar },
                { id: 'bmi-calculator', label: 'BMI', icon: Activity },
            ]
        },
        {
            category: 'Finance',
            tools: [
                { id: 'gst-calculator', label: 'GST', icon: DollarSign },
                { id: 'emi-calculator', label: 'EMI', icon: PieChart },
                { id: 'discount-calculator', label: 'Discount', icon: Percent },
            ]
        },
        {
            category: 'Math',
            tools: [
                { id: 'percentage-calculator', label: 'Percentage', icon: Calculator },
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
            <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden p-8">
                {renderCalculator()}
            </div>
        </div>
    );
}

