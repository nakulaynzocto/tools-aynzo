"use client";
import { useState, useEffect } from 'react';
import { RefreshCw, Copy, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ' },
    { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
    { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM' },
    { code: 'BBD', name: 'Barbadian Dollar', symbol: '$' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
    { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu' },
    { code: 'BMD', name: 'Bermudan Dollar', symbol: '$' },
    { code: 'BND', name: 'Brunei Dollar', symbol: '$' },
    { code: 'BOB', name: 'Bolivian Boliviano', symbol: '$b' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'BSD', name: 'Bahamian Dollar', symbol: '$' },
    { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.' },
    { code: 'BWP', name: 'Botswanan Pula', symbol: 'P' },
    { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
    { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$' },
    { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$' },
    { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡' },
    { code: 'CUP', name: 'Cuban Peso', symbol: '₱' },
    { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'دج' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
    { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk' },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
    { code: 'FJD', name: 'Fijian Dollar', symbol: '$' },
    { code: 'FKP', name: 'Falkland Islands Pound', symbol: '£' },
    { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
    { code: 'GIP', name: 'Gibraltar Pound', symbol: '£' },
    { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D' },
    { code: 'GNF', name: 'Guinean Franc', symbol: 'FG' },
    { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q' },
    { code: 'GYD', name: 'Guyanese Dollar', symbol: '$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'HNL', name: 'Honduran Lempira', symbol: 'L' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
    { code: 'HTG', name: 'Haitian Gourde', symbol: 'G' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
    { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
    { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
    { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' },
    { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'KGS', name: 'Kyrgystani Som', symbol: 'лв' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
    { code: 'KPW', name: 'North Korean Won', symbol: '₩' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
    { code: 'KYD', name: 'Cayman Islands Dollar', symbol: '$' },
    { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
    { code: 'LAK', name: 'Laotian Kip', symbol: '₭' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: '£' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨' },
    { code: 'LRD', name: 'Liberian Dollar', symbol: '$' },
    { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
    { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
    { code: 'MDL', name: 'Moldovan Leu', symbol: 'leu' },
    { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
    { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
    { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
    { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮' },
    { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$' },
    { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM' },
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
    { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' },
    { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: '$' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
    { code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
    { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.' },
    { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'PYG', name: 'Paraguayan Guarani', symbol: 'Gs' },
    { code: 'QAR', name: 'Qatari Rial', symbol: '﷼' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
    { code: 'RSD', name: 'Serbian Dinar', symbol: 'Дин.' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'R₣' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'SBD', name: 'Solomon Islands Dollar', symbol: '$' },
    { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
    { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'SHP', name: 'Saint Helena Pound', symbol: '£' },
    { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le' },
    { code: 'SOS', name: 'Somali Shilling', symbol: 'S' },
    { code: 'SRD', name: 'Surinamese Dollar', symbol: '$' },
    { code: 'SSP', name: 'South Sudanese Pound', symbol: '£' },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'Db' },
    { code: 'SYP', name: 'Syrian Pound', symbol: '£' },
    { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM' },
    { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
    { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$' },
    { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U' },
    { code: 'UZS', name: 'Uzbekistani Som', symbol: 'лв' },
    { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT' },
    { code: 'WST', name: 'Samoan Tala', symbol: 'WS$' },
    { code: 'XAF', name: 'CFA Franc BEAC', symbol: 'FCFA' },
    { code: 'XCD', name: 'East Caribbean Dollar', symbol: '$' },
    { code: 'XOF', name: 'CFA Franc BCEAO', symbol: 'CFA' },
    { code: 'XPF', name: 'CFP Franc', symbol: '₣' },
    { code: 'YER', name: 'Yemeni Rial', symbol: '﷼' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
    { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: '$' },
];

export function CurrencyConverter() {
    const t = useTranslations('Common');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const fetchRate = async () => {
        if (fromCurrency === toCurrency) {
            setRate(1);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
            const data = await response.json();
            if (data.rates && data.rates[toCurrency]) {
                setRate(data.rates[toCurrency]);
                setLastUpdate(new Date());
            } else {
                setError('Exchange rate not available');
            }
        } catch (e) {
            setError('Failed to fetch exchange rate');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRate();
    }, [fromCurrency, toCurrency]);

    const result = amount && rate ? (parseFloat(amount) * rate).toFixed(2) : '0.00';
    const displayResult = amount ? result : '0.00';

    const handleSwap = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(displayResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Rate Info */}
            {rate && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest text-primary mb-1">Exchange Rate</div>
                            <div className="text-2xl font-black text-primary">
                                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                            </div>
                        </div>
                        <button
                            onClick={fetchRate}
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                    {lastUpdate && (
                        <div className="text-xs text-muted-foreground mt-2">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm font-bold">
                    {error}
                </div>
            )}

            {/* Converter */}
            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* From */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">From</label>
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-bold"
                            >
                                {currencies.map((curr) => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.code} - {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-4 bg-background border-2 border-border rounded-xl text-2xl font-black text-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    {/* To */}
                    <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground">To</label>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-bold"
                            >
                                {currencies.map((curr) => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.code} - {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={displayResult}
                                readOnly
                                className="w-full px-4 py-4 bg-muted/50 border-2 border-border rounded-xl text-2xl font-black text-foreground"
                            />
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                                    copied
                                        ? "bg-emerald-500 text-white"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex items-center justify-center my-4 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:my-0">
                    <button
                        onClick={handleSwap}
                        className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-10"
                    >
                        <ArrowLeftRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

