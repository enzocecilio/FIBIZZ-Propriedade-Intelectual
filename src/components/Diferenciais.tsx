import { ShieldCheck, Scale, Zap } from "lucide-react";
import { Translation } from "../types";

interface DiferenciaisProps {
  t: Translation;
}

export default function Diferenciais({ t }: DiferenciaisProps) {
  const cards = [
    {
      title: t.diff_card1_title,
      desc: t.diff_card1_desc,
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: t.diff_card2_title,
      desc: t.diff_card2_desc,
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: t.diff_card3_title,
      desc: t.diff_card3_desc,
      icon: <Scale className="w-6 h-6 text-cyan-400" />,
    },
  ];

  return (
    <section id="diferenciais" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark relative scroll-mt-16">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            {t.hero_tagline}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-[#F4F7FF]">
            {t.diff_title}
          </h2>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-brand-card border border-brand-border hover:border-brand-blue/35 rounded-2xl p-6 lg:p-8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-lg relative group"
            >
              {/* Card glowing gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Icon box */}
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mb-6">
                  {card.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg lg:text-xl font-bold text-[#F4F7FF] mb-3">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F4F7FF]/65 leading-relaxed font-light">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Inline fallback import for Layers icon since we did not import it explicitly inside local cards block
import { Layers } from "lucide-react";
