import React from "react";
import { ChevronLeft, ChevronRight, FileSearch, ShieldAlert, ShieldCheck, Mail, Globe } from "lucide-react";
import { Translation } from "../types";

interface ServicesProps {
  t: Translation;
  onSelectService: (serviceName: string) => void;
}

export default function Services({ t, onSelectService }: ServicesProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const icons = [
    <FileSearch className="w-6 h-6 text-cyan-400" />,
    <ShieldAlert className="w-6 h-6 text-cyan-400" />,
    <ShieldCheck className="w-6 h-6 text-cyan-400" />,
    <Mail className="w-6 h-6 text-cyan-400" />,
    <Globe className="w-6 h-6 text-cyan-400" />
  ];

  const services = t.services_list.map((s, idx) => ({
    ...s,
    icon: icons[idx] || <ShieldCheck className="w-6 h-6 text-cyan-400" />
  }));

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeftPos = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth;
      const index = Math.round(scrollLeftPos / cardWidth);
      setActiveIndex(index);
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="servicos" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark/50 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-[#F4F7FF] mb-3">
            {t.services_title}
          </h2>
          <p className="text-xs text-[#F4F7FF]/35 uppercase tracking-widest font-semibold">
            {t.services_disclaimer}
          </p>
        </div>

        {/* Carousel / Fita com suporte a Toque e Drag por Mouse */}
        <div className="relative">
          <div 
            ref={carouselRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 space-x-6 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
          >
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 w-[290px] sm:w-[350px] snap-center bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-brand-blue/45 hover:shadow-xl hover:shadow-brand-blue/5 group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-blue/[0.02] to-transparent pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#F4F7FF] mb-2">{service.title}</h3>
                  <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-4">{service.impact}</p>
                  
                  <ul className="space-y-2.5 mb-6">
                    {service.items.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-[#F4F7FF]/75 flex items-start space-x-2 leading-relaxed">
                        <span className="text-brand-blue font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#F4F7FF]/40 border-t border-brand-border/40 pt-4 mb-4">
                    {service.avoid}
                  </p>
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="w-full font-semibold py-3 px-4 rounded-xl text-xs bg-brand-blue/20 text-[#F4F7FF] hover:bg-brand-blue border border-brand-blue/30 group-hover:bg-brand-blue transition-all"
                  >
                    {service.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "bg-brand-blue w-5" : "bg-[#F4F7FF]/20"
                }`}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
