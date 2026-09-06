import { Phone, Mail, Clock, Instagram, Linkedin, Shield } from "lucide-react";
import { Translation } from "../types";

interface FooterProps {
  t: Translation;
  lang: "pt" | "en";
  onOpenAdmin?: () => void;
}

export default function Footer({ t, lang, onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-[#0F1319] border-t border-brand-border py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 mb-12">
          
          {/* Brand/Logo column */}
          <div className="md:col-span-1 space-y-4">
            <a href="#" className="font-display text-2xl tracking-wider text-[#F4F7FF] flex items-center space-x-2">
              <span className="bg-gradient-to-r from-brand-blue to-cyan-400 bg-clip-text text-transparent">FIBIZZ</span>
            </a>
            <p className="text-xs text-[#F4F7FF]/50 leading-relaxed font-light">
              {lang === "pt" 
                ? "Conectando tecnologia, inteligência jurídica e agilidade estratégica para proteger e valorizar marcas inovadoras."
                : "Connecting technology, legal intelligence, and rapid execution to shield and empower innovative brands."
              }
            </p>
          </div>

          {/* Column A: Contacts */}
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#F4F7FF]/40 mb-4">
              {t.footer_contacts}
            </p>
            <div className="space-y-3.5">
              <a href="https://wa.me/5511912329490" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 text-xs sm:text-sm text-[#F4F7FF]/70 hover:text-brand-blue transition-colors group">
                <svg className="w-5 h-5 text-[#7FB0FF] fill-current flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="break-all font-light">(11) 91232-9490</span>
              </a>
              <a href="mailto:contato@fbzgrowth.com.br" className="flex items-start space-x-3 text-xs sm:text-sm text-[#F4F7FF]/70 hover:text-brand-blue transition-colors">
                <Mail className="w-5 h-5 text-[#7FB0FF] flex-shrink-0 mt-0.5" />
                <span className="break-all font-light">contato@fbzgrowth.com.br</span>
              </a>
            </div>
          </div>

          {/* Column B: Business Hours */}
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#F4F7FF]/40 mb-4">
              {t.footer_hours}
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-[#F4F7FF]/70 font-light">
              <p><span className="font-semibold text-[#F4F7FF]/90">{t.footer_hours_mon_fri}:</span> 08:00 às 18:00</p>
              <p><span className="font-semibold text-[#F4F7FF]/90">{t.footer_hours_sat}:</span> 09:00 às 12:00</p>
              <p><span className="font-semibold text-[#F4F7FF]/50">{t.footer_hours_sun}:</span> {t.footer_hours_closed}</p>
            </div>
          </div>

          {/* Column C: Social Presence */}
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#F4F7FF]/40 mb-4">
              {t.footer_social}
            </p>
            <div className="flex items-center space-x-3.5">
              <a href="#" className="w-10 h-10 rounded-xl bg-brand-card hover:bg-brand-blue/10 border border-brand-border hover:border-brand-blue/30 flex items-center justify-center text-[#F4F7FF]/60 hover:text-cyan-400 transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-brand-card hover:bg-brand-blue/10 border border-brand-border hover:border-brand-blue/30 flex items-center justify-center text-[#F4F7FF]/60 hover:text-cyan-400 transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclosures */}
        <div className="border-t border-brand-border/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-[#F4F7FF]/40 max-w-xl font-light">
            {t.footer_copyright}
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-xs text-[#F4F7FF]/40 hover:text-[#F4F7FF]/70 transition-colors font-light">
              {t.footer_privacy}
            </a>
            <span className="text-[#F4F7FF]/20 text-xs">•</span>
            <a href="#" className="text-xs text-[#F4F7FF]/40 hover:text-[#F4F7FF]/70 transition-colors font-light">
              {t.footer_terms}
            </a>
            {onOpenAdmin && (
              <>
                <span className="text-[#F4F7FF]/20 text-xs">•</span>
                <button 
                  onClick={onOpenAdmin}
                  className="text-xs text-[#F4F7FF]/40 hover:text-[#F4F7FF]/70 hover:underline transition-colors font-light cursor-pointer"
                >
                  {lang === "pt" ? "Acesso Admin" : "Admin Panel"}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
