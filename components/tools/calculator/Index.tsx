"use client";
import { Calculator, Calendar, Activity, Percent, DollarSign, PieChart, TrendingUp, Home, Landmark, Coins, Target, Megaphone, ArrowDownNarrowWide, CreditCard, Car, TrendingDown, Flame, Baby, Dumbbell, Scale, Briefcase } from 'lucide-react';
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
import { Retirement401kCalculator } from './Retirement401kCalculator';
import { DTICalculator } from './DTICalculator';
import { CarLoanCalculator } from './CarLoanCalculator';
import { CreditCardPayoffCalculator } from './CreditCardPayoffCalculator';
import { SavingsGoalCalculator } from './SavingsGoalCalculator';
import { FreelanceTaxCalculator } from './FreelanceTaxCalculator';
import { TDEECalculator } from './TDEECalculator';
import { PregnancyDueDateCalculator } from './PregnancyDueDateCalculator';
import { MacroCalculator } from './MacroCalculator';
import { IdealWeightCalculator } from './IdealWeightCalculator';

export default function CalculatorToolsIndex({ type }: CalculatorToolProps) {
    const t = useTranslations('CalculatorNav');

    const calculatorNavTools = [
        {
            category: t('finance'),
            tools: [
                { id: 'compound-interest-calculator', label: t('compoundInterest'), icon: TrendingUp },
                { id: 'mortgage-calculator', label: t('mortgage'), icon: Home },
                { id: '401k-retirement-calculator', label: t('retirement401k'), icon: TrendingUp },
                { id: 'sip-calculator', label: t('sip'), icon: PieChart },
                { id: 'emi-calculator', label: t('emi'), icon: DollarSign },
                { id: 'gst-calculator', label: t('gst'), icon: Landmark },
                { id: 'sales-tax-calculator', label: t('salesTax'), icon: Calculator },
                { id: 'discount-calculator', label: t('discount'), icon: Percent },
                { id: 'dti-calculator', label: t('dti'), icon: TrendingDown },
                { id: 'car-loan-calculator', label: t('carLoan'), icon: Car },
                { id: 'credit-card-payoff-calculator', label: t('creditCard'), icon: CreditCard },
                { id: 'savings-goal-calculator', label: t('savingsGoal'), icon: Target },
                { id: 'freelance-tax-calculator', label: t('freelanceTax'), icon: Briefcase },
            ]
        },
        {
            category: t('business'),
            tools: [
                { id: 'crypto-profit-calculator', label: t('cryptoProfit'), icon: Coins },
                { id: 'roi-calculator', label: t('roi'), icon: Target },
                { id: 'cpm-calculator', label: t('cpm'), icon: Megaphone },
                { id: 'inflation-calculator', label: t('inflation'), icon: ArrowDownNarrowWide },
            ]
        },
        {
            category: t('healthLife'),
            tools: [
                { id: 'age-calculator', label: t('age'), icon: Calendar },
                { id: 'bmi-calculator', label: t('bmi'), icon: Activity },
                { id: 'tdee-calculator', label: t('tdee'), icon: Flame },
                { id: 'pregnancy-due-date-calculator', label: t('pregnancy'), icon: Baby },
                { id: 'macro-calculator', label: t('macros'), icon: Dumbbell },
                { id: 'ideal-weight-calculator', label: t('idealWeight'), icon: Scale },
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
            case '401k-retirement-calculator':
                return <Retirement401kCalculator />;
            case 'dti-calculator':
                return <DTICalculator />;
            case 'car-loan-calculator':
                return <CarLoanCalculator />;
            case 'credit-card-payoff-calculator':
                return <CreditCardPayoffCalculator />;
            case 'savings-goal-calculator':
                return <SavingsGoalCalculator />;
            case 'freelance-tax-calculator':
                return <FreelanceTaxCalculator />;
            case 'tdee-calculator':
                return <TDEECalculator />;
            case 'pregnancy-due-date-calculator':
                return <PregnancyDueDateCalculator />;
            case 'macro-calculator':
                return <MacroCalculator />;
            case 'ideal-weight-calculator':
                return <IdealWeightCalculator />;
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

