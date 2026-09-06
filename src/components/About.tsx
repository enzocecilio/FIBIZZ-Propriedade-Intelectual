import { Check, ShieldAlert, Award, Milestone } from "lucide-react";
import { Translation } from "../types";

interface AboutProps {
  t: Translation;
}

export default function About({ t }: AboutProps) {
  const pillarIcons = [
    <Milestone className="w-5 h-5 text-cyan-400" />,
    <Award className="w-5 h-5 text-cyan-400" />,
    <ShieldAlert className="w-5 h-5 text-cyan-400" />
  ];

  return (
    <section id="sobre" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark scroll-mt-16">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Main Info */}
          <div className="md:col-span-7">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-[#F4F7FF] mb-6">
              {t.sobre_title}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-blue to-cyan-400 mb-8 rounded-full" />
            <div className="space-y-4 mb-8">
              <p className="text-sm sm:text-base leading-relaxed text-[#F4F7FF]/75 font-light">
                {t.sobre_p1}
              </p>
              {t.sobre_p2 && (
                <p className="text-sm sm:text-base leading-relaxed text-[#F4F7FF]/75 font-light">
                  {t.sobre_p2}
                </p>
              )}
            </div>
          </div>

          {/* Pillars List */}
          <div className="md:col-span-5 bg-brand-card border border-brand-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
            
            <p className="text-xs uppercase tracking-widest font-semibold text-[#F4F7FF]/40 mb-6 border-b border-brand-border/60 pb-3">
              {t.sobre_pillars_title}
            </p>
            
            <div className="space-y-6">
              {t.sobre_pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {pillarIcons[idx] || <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-[#F4F7FF] mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#F4F7FF]/60 font-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
