import React from "react";
import { Menu, X, Languages } from "lucide-react";
import { Translation } from "../types";

interface HeaderProps {
  t: Translation;
  currentLang: "pt" | "en";
  setLang: (lang: "pt" | "en") => void;
  onOpenDiagnostic: () => void;
}

export default function Header({ t, currentLang, setLang, onOpenDiagnostic }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { label: t.nav_diferenciais, href: "#diferenciais" },
    { label: t.nav_servicos, href: "#servicos" },
    { label: t.nav_como_funciona, href: "#como-funciona" },
    { label: t.nav_faq, href: "#faq" },
    { label: t.nav_sobre, href: "#sobre" },
    { label: t.nav_contato, href: "#contato" },
  ];

  return (
    <>
      <header id="header-main" className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="font-display text-xl sm:text-2xl tracking-wider text-[#F4F7FF] flex items-center space-x-1.5 sm:space-x-2">
                <span className="bg-gradient-to-r from-brand-blue to-cyan-400 bg-clip-text text-transparent">FIBIZZ</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[#F4F7FF]/80 hover:text-brand-blue transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Language & Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center bg-brand-card border border-brand-border rounded-lg p-1">
                <Languages className="w-3.5 h-3.5 text-[#F4F7FF]/50 mx-1.5 hidden sm:block" />
                <button
                  id="lang-pt-toggle"
                  onClick={() => setLang("pt")}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-all duration-200 ${
                    currentLang === "pt"
                      ? "bg-brand-blue text-[#F4F7FF]"
                      : "text-[#F4F7FF]/50 hover:text-[#F4F7FF]"
                  }`}
                >
                  PT
                </button>
                <button
                  id="lang-en-toggle"
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-all duration-200 ${
                    currentLang === "en"
                      ? "bg-brand-blue text-[#F4F7FF]"
                      : "text-[#F4F7FF]/50 hover:text-[#F4F7FF]"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Desktop CTA */}
              <button
                id="header-cta-btn"
                onClick={onOpenDiagnostic}
                className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-brand-blue text-[#F4F7FF] hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all duration-200"
              >
                {t.nav_cta}
              </button>

              {/* Mobile menu button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-[#F4F7FF]/80 hover:text-[#F4F7FF] hover:bg-brand-card border border-brand-border"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu-panel"
        className={`fixed top-16 right-0 bottom-0 w-72 z-40 bg-brand-card/98 backdrop-blur-lg border-l border-brand-border transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4 h-full">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-2 border-b border-brand-border/40 text-sm font-medium text-[#F4F7FF]/85 hover:text-brand-blue hover:pl-4 transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
          <button
            id="mobile-menu-cta-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDiagnostic();
            }}
            className="mt-6 w-full font-semibold py-3 px-4 rounded-xl text-center text-sm bg-brand-blue text-[#F4F7FF] hover:bg-brand-blue/90 transition-all duration-200 shadow-lg shadow-brand-blue/25"
          >
            {t.nav_cta}
          </button>
        </div>
      </div>
    </>
  );
}
