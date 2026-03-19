export interface CalculatorToolProps {
    type: 'age-calculator' | 'bmi-calculator' | 'percentage-calculator' | 'gst-calculator' | 'emi-calculator' | 'discount-calculator' | 'compound-interest-calculator' | 'mortgage-calculator' | 'sip-calculator' | 'crypto-profit-calculator' | 'inflation-calculator' | 'roi-calculator' | 'cpm-calculator' | 'sales-tax-calculator' | '401k-retirement-calculator' | 'dti-calculator' | 'car-loan-calculator' | 'credit-card-payoff-calculator' | 'savings-goal-calculator' | 'freelance-tax-calculator' | 'tdee-calculator' | 'pregnancy-due-date-calculator' | 'macro-calculator' | 'ideal-weight-calculator' | 'gpa-calculator' | 'salary-calculator' | 'tip-calculator';
}

export interface AgeData {
    birthDate: string;
}

export interface BMIData {
    weight: number;
    height: number;
    unit: 'metric' | 'imperial';
}

export interface PercentageData {
    value: number;
    percentage: number;
}

export interface GSTData {
    amount: number;
    gstRate: number;
}

export interface EMIData {
    principal: number;
    rate: number;
    tenure: number;
}

export interface DiscountData {
    originalPrice: number;
    discountPercent: number;
}


