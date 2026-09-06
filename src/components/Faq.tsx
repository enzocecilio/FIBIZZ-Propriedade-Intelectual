import React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Translation } from "../types";

interface FaqProps {
  t: Translation;
}

export default function Faq({ t }: FaqProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark/50 scroll-mt-16">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-brand-blue mb-3">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-widest">{t.faq_title}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-[#F4F7FF]">
            {t.faq_title}
          </h2>
        </div>

        {/* FAQ list */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {t.faq_items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "bg-brand-card border-brand-blue/40 shadow-xl shadow-brand-blue/5" 
                    : "bg-brand-card/40 border-brand-border/60 hover:border-brand-border"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-sm sm:text-base text-[#F4F7FF] pr-4">
                    {item.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#F4F7FF]/50 transition-transform duration-350 flex-shrink-0 ${isOpen ? "rotate-180 text-brand-blue" : ""}`} />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen 
                      ? "max-h-96 border-t border-brand-border/60 opacity-100" 
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-5 text-xs sm:text-sm text-[#F4F7FF]/70 leading-relaxed font-light">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
