import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Diferenciais from "./components/Diferenciais";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import Faq from "./components/Faq";
import About from "./components/About";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import DiagnosticModal from "./components/DiagnosticModal";
import Tracking from "./components/Tracking";

import { translations } from "./data/translations";

export default function App() {
  const [lang, setLang] = React.useState<"pt" | "en">("pt");
  const [prefilledBrand, setPrefilledBrand] = React.useState("");
  const [prefilledActivity, setPrefilledActivity] = React.useState("");
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = React.useState(false);

  const t = translations[lang];

  // Language Auto-Detection
  React.useEffect(() => {
    const saved = localStorage.getItem("preferredLanguage");
    if (saved === "pt" || saved === "en") {
      setLang(saved);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        setLang("en");
      } else {
        setLang("pt");
      }
    }
  }, []);

  const handleSetLang = (newLang: "pt" | "en") => {
    setLang(newLang);
    localStorage.setItem("preferredLanguage", newLang);
  };

  const handleOpenDiagnostic = (brand = "", activity = "") => {
    if (brand) setPrefilledBrand(brand);
    if (activity) setPrefilledActivity(activity);
    setIsDiagnosticModalOpen(true);
  };

  const handleSelectServiceForLead = (serviceName: string) => {
    setPrefilledActivity(
      lang === "pt"
        ? `Desejo registrar minha marca com foco no serviço: ${serviceName}`
        : `I would like to register my trademark with a focus on: ${serviceName}`
    );
    setIsDiagnosticModalOpen(true);
  };

  return (
    <div id="app-root-container" className="w-full min-h-screen bg-[#0B0F1A] text-[#F4F7FF] overflow-x-hidden selection:bg-brand-blue selection:text-white">
      {/* Platform Tracking Script Loader */}
      <Tracking />

      {/* Navigation Header */}
      <Header 
        t={t} 
        currentLang={lang} 
        setLang={handleSetLang} 
        onOpenDiagnostic={handleOpenDiagnostic} 
      />

      {/* Hero Banner Section (1st Fold) */}
      <Hero t={t} onOpenDiagnostic={handleOpenDiagnostic} />

      {/* Lead Form Section (2nd Fold) */}
      <ContactForm 
        t={t} 
        initialBrandName={prefilledBrand} 
        initialActivity={prefilledActivity} 
        onOpenFullDiagnostic={() => setIsDiagnosticModalOpen(true)}
      />

      {/* Why Us (Advantages Grid) */}
      <Diferenciais t={t} />

      {/* Services Showcase */}
      <Services t={t} onSelectService={handleSelectServiceForLead} />

      {/* Roadmap & Timelines */}
      <HowItWorks t={t} />

      {/* FAQs */}
      <Faq t={t} />

      {/* Corporate About */}
      <About t={t} />

      {/* Footer Details */}
      <Footer t={t} lang={lang} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Full Diagnostic Modal (Expanded Form) */}
      <DiagnosticModal 
        isOpen={isDiagnosticModalOpen} 
        onClose={() => setIsDiagnosticModalOpen(false)}
        initialBrand={prefilledBrand}
        initialActivity={prefilledActivity}
      />

      {/* Admin Panel Modal */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Sticky Floating WhatsApp Call-to-action */}
      <a 
        id="floating-whatsapp-cta"
        href="https://wa.me/5511912329490"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-full flex items-center space-x-2 shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-xs sm:text-sm"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>{t.footer_whatsapp_cta}</span>
      </a>
    </div>
  );
}
