"use client";
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!faqs || faqs.length === 0) return null;

    return (
        <div className="bg-card rounded-xl border-2 border-border p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border-2 border-border rounded-xl overflow-hidden transition-all hover:border-primary/50"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                            <span className="font-bold text-foreground pr-4 text-sm md:text-base">{faq.question}</span>
                            <ChevronDown
                                className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {openIndex === index && (
                            <div className="px-5 py-4 bg-muted/10 border-t border-border animate-in slide-in-from-top-2 duration-300">
                                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Schema markup for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map(faq => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer
                            }
                        }))
                    })
                }}
            />
        </div>
    );
}
