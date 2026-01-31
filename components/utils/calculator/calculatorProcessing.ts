import { AgeData, BMIData, PercentageData, GSTData, EMIData, DiscountData } from '@/components/types/calculator/types';

export const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const calculateBMI = (data: BMIData): { bmi: number; category: string } => {
    let bmi: number;
    if (data.unit === 'metric') {
        bmi = data.weight / ((data.height / 100) ** 2);
    } else {
        bmi = (data.weight / (data.height ** 2)) * 703;
    }
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    
    return { bmi: Number(bmi.toFixed(2)), category };
};

export const calculatePercentage = (data: PercentageData): { result: number; formula: string } => {
    const result = (data.value * data.percentage) / 100;
    return {
        result: Number(result.toFixed(2)),
        formula: `${data.value} × ${data.percentage}% = ${result.toFixed(2)}`
    };
};

export const calculateGST = (data: GSTData): { gstAmount: number; totalAmount: number; baseAmount: number } => {
    const gstAmount = (data.amount * data.gstRate) / 100;
    const totalAmount = data.amount + gstAmount;
    return {
        gstAmount: Number(gstAmount.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        baseAmount: Number(data.amount.toFixed(2))
    };
};

export const calculateEMI = (data: EMIData): { emi: number; totalAmount: number; totalInterest: number } => {
    const monthlyRate = data.rate / 12 / 100;
    const emi = (data.principal * monthlyRate * Math.pow(1 + monthlyRate, data.tenure)) / (Math.pow(1 + monthlyRate, data.tenure) - 1);
    const totalAmount = emi * data.tenure;
    const totalInterest = totalAmount - data.principal;
    
    return {
        emi: Number(emi.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2)),
        totalInterest: Number(totalInterest.toFixed(2))
    };
};

export const calculateDiscount = (data: DiscountData): { discountAmount: number; finalPrice: number } => {
    const discountAmount = (data.originalPrice * data.discountPercent) / 100;
    const finalPrice = data.originalPrice - discountAmount;
    
    return {
        discountAmount: Number(discountAmount.toFixed(2)),
        finalPrice: Number(finalPrice.toFixed(2))
    };
};

