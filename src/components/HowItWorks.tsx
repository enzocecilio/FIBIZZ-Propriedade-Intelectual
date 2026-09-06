import React from "react";
import { Translation } from "../types";

interface HowItWorksProps {
  t: Translation;
}

export default function HowItWorks({ t }: HowItWorksProps) {
  const steps = t.como_steps;

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {t.como_title}
          </h2>
        </div>

        {/* Steps List */}
        <div className="space-y-8 sm:space-y-10 max-w-2xl mx-auto mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-5 sm:space-x-6"
            >
              {/* Circular Badge */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-sans font-bold text-lg bg-brand-blue text-white shadow-md">
                {step.number}
              </div>
              
              {/* Text Content */}
              <div className="pt-1.5">
                <h3 className="font-display text-lg sm:text-xl text-white tracking-wide">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light mt-1 sm:mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Process Mockups / Side-by-Side browser windows */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto mt-16 px-2 sm:px-4">
          <div className="rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.03]">
            <img 
              referrerPolicy="no-referrer"
              src="https://i.postimg.cc/136Vqvkc/linhas-simulando-texto-(1).png" 
              alt="Certificado de Registro" 
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.03]">
            <img 
              referrerPolicy="no-referrer"
              src="https://i.postimg.cc/qvn631PG/linhas-simulando-texto-(2).png" 
              alt="Acompanhamento de Processo" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
