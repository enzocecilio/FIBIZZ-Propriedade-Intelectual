import { motion } from "motion/react";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Translation } from "../types";

interface HeroProps {
  t: Translation;
  onOpenDiagnostic: () => void;
}

export default function Hero({ t, onOpenDiagnostic }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85" 
          style={{ backgroundImage: `url('https://i.postimg.cc/Y2xjS5Kf/SITE-FUNDO-HEAD.png')` }}
        />
        {/* Futuristic glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E2736_1px,transparent_1px),linear-gradient(to_bottom,#1E2736_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A]/40 via-[#0B0F1A]/70 to-[#0B0F1A]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Strategic Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-brand-blue/10 border border-brand-blue/30 px-3.5 py-1.5 rounded-full mb-6"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            {t.hero_tagline}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider uppercase leading-[1.1] mb-6 text-[#F4F7FF] max-w-3xl mx-auto"
        >
          {t.hero_headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#F4F7FF]/70 max-w-2xl mx-auto mb-10 font-light"
        >
          {t.hero_subheadline}
        </motion.p>

        {/* Value Bullets */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12 max-w-3xl mx-auto"
        >
          {[
            { text: t.hero_bullet1 },
            { text: t.hero_bullet2 },
            { text: t.hero_bullet3 }
          ].map((bullet, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-brand-card/50 backdrop-blur-sm border border-brand-border px-4 py-2.5 rounded-xl w-full sm:w-auto">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#F4F7FF]/90 text-left">
                {bullet.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Action CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <button
            id="hero-cta-analyze"
            onClick={onOpenDiagnostic}
            className="w-full sm:w-auto font-semibold py-4 px-8 rounded-xl text-sm bg-brand-blue text-[#F4F7FF] hover:bg-brand-blue/90 transition-all duration-200 shadow-xl shadow-brand-blue/30 hover:shadow-brand-blue/40 border border-brand-blue/40 hover:-translate-y-0.5"
          >
            {t.hero_cta_diagnostic}
          </button>
          
          <a
            id="hero-cta-whatsapp"
            href="https://wa.me/5511912329490"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center font-semibold py-4 px-8 rounded-xl text-sm bg-brand-card text-[#F4F7FF] hover:bg-brand-card/80 border border-brand-border transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <svg className="w-4 h-4 mr-2 text-green-400 fill-current group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>{t.hero_cta_whatsapp}</span>
          </a>
        </motion.div>
      </div>

      {/* Edge gradient divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0B0F1A] to-transparent" />
    </section>
  );
}
