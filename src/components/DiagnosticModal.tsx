import React from "react";
import { X, ShieldCheck, CheckCircle2, Building2, Send, AlertCircle, Sparkles, MessageSquare } from "lucide-react";
import { trackLead } from "./Tracking";
import { getGoogleAccessToken } from "../lib/firebase";

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrand?: string;
  initialActivity?: string;
}

export default function DiagnosticModal({
  isOpen,
  onClose,
  initialBrand = "",
  initialActivity = "",
}: DiagnosticModalProps) {
  // Brand Fields
  const [brandName, setBrandName] = React.useState(initialBrand);
  const [brand2, setBrand2] = React.useState("");
  const [brand3, setBrand3] = React.useState("");

  // Activity
  const [activityCategory, setActivityCategory] = React.useState<string>("Serviços");
  const [otherActivityText, setOtherActivityText] = React.useState("");

  // Contact Info
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // State
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Sync initial brand when modal opens with prefilled data
  React.useEffect(() => {
    if (initialBrand) setBrandName(initialBrand);
    if (initialActivity) {
      if (["Comércio", "Indústria", "Serviços"].includes(initialActivity)) {
        setActivityCategory(initialActivity);
      } else {
        setActivityCategory("Outras Atividades");
        setOtherActivityText(initialActivity);
      }
    }
  }, [initialBrand, initialActivity, isOpen]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Phone auto-formatting: (00) 00000-0000 or (00) 0000-0000
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = rawDigits;

    if (rawDigits.length > 0) {
      if (rawDigits.length <= 2) {
        formatted = `(${rawDigits}`;
      } else if (rawDigits.length <= 6) {
        formatted = `(${rawDigits.slice(0, 2)}) ${rawDigits.slice(2)}`;
      } else if (rawDigits.length <= 10) {
        formatted = `(${rawDigits.slice(0, 2)}) ${rawDigits.slice(2, 6)}-${rawDigits.slice(6)}`;
      } else {
        formatted = `(${rawDigits.slice(0, 2)}) ${rawDigits.slice(2, 7)}-${rawDigits.slice(7, 11)}`;
      }
    }
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate required fields
    if (!brandName.trim()) {
      setErrorMessage("Por favor, preencha o nome da marca principal que deseja registrar.");
      return;
    }
    if (activityCategory === "Outras Atividades" && !otherActivityText.trim()) {
      setErrorMessage("Por favor, especifique o ramo de atividade da sua empresa.");
      return;
    }
    if (!name.trim()) {
      setErrorMessage("Por favor, digite seu nome completo.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Por favor, digite um e-mail válido.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Por favor, digite um telefone/WhatsApp válido com DDD.");
      return;
    }
    if (!company.trim()) {
      setErrorMessage("Por favor, digite o nome da empresa.");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalActivity =
        activityCategory === "Outras Atividades"
          ? `Outras Atividades: ${otherActivityText.trim()}`
          : activityCategory;

      const token = getGoogleAccessToken();

      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          brand2: brand2.trim() || undefined,
          brand3: brand3.trim() || undefined,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          brandActivity: finalActivity,
          notes: notes.trim() || undefined,
          created_at: new Date().toISOString(),
          accessToken: token || undefined,
        }),
      });

      const data = await response.json();

      if (data.isOk) {
        setIsSuccess(true);
        trackLead(email.trim(), brandName.trim());
      } else {
        throw new Error(data.message || "Erro ao processar envio.");
      }
    } catch (err: any) {
      console.error("Erro no envio do diagnóstico:", err);
      setErrorMessage(
        err.message || "Falha ao enviar sua solicitação. Por favor, tente novamente ou fale conosco no WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setBrandName("");
    setBrand2("");
    setBrand3("");
    setActivityCategory("Serviços");
    setOtherActivityText("");
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setNotes("");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="diagnostic-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="diagnostic-modal-content"
        className="relative w-full max-w-2xl bg-[#0D1220] border border-[#1E293B] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto transition-all text-[#F4F7FF]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-[#1E293B] bg-[#0A0E1A]/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-brand-blue/20 text-cyan-400 border border-brand-blue/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                FIBIZZ IP • Pesquisa de Viabilidade
              </span>
              <h3 className="text-sm sm:text-base font-display font-semibold text-[#F4F7FF] tracking-wide">
                Solicitar Diagnóstico de Marca
              </h3>
            </div>
          </div>

          <button
            id="close-diagnostic-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#F4F7FF]/50 hover:text-[#F4F7FF] hover:bg-[#1E293B]/70 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto space-y-6">
          {isSuccess ? (
            <div className="py-8 px-4 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl sm:text-2xl font-display font-bold text-[#F4F7FF]">
                  Solicitação Enviada com Sucesso!
                </h4>
                <p className="text-sm text-[#F4F7FF]/75 max-w-md mx-auto leading-relaxed">
                  Recebemos os dados da marca <span className="text-cyan-300 font-semibold">{brandName}</span>. Nossos
                  especialistas em propriedade industrial já estão realizando a busca minuciosa no banco de dados do
                  INPI e entrarão em contato em breve via WhatsApp ou e-mail.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#121829] border border-[#1E293B] rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                  <span className="text-[#F4F7FF]/50">Marca Principal:</span>
                  <span className="font-semibold text-cyan-300">{brandName}</span>
                </div>
                {(brand2 || brand3) && (
                  <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                    <span className="text-[#F4F7FF]/50">Marcas Adicionais:</span>
                    <span className="text-[#F4F7FF]/90">{[brand2, brand3].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-[#1E293B]/60">
                  <span className="text-[#F4F7FF]/50">Solicitante:</span>
                  <span className="text-[#F4F7FF]/90">{name} ({company})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#F4F7FF]/50">WhatsApp / Telefone:</span>
                  <span className="font-mono text-[#F4F7FF]/90">{phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/5511912329490?text=${encodeURIComponent(
                    `Olá! Acabei de solicitar o diagnóstico de viabilidade para a marca "${brandName}" no site da FIBIZZ.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-lg shadow-[#25D366]/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Falar Agora no WhatsApp</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1E293B] hover:bg-[#1E293B]/80 text-[#F4F7FF] font-semibold text-sm transition-colors"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Desejo pesquisar ou registrar */}
              <div className="space-y-4">
                <div className="border-b border-[#1E293B] pb-2">
                  <h4 className="text-base sm:text-lg font-display font-semibold text-[#F4F7FF] flex items-center space-x-2">
                    <span>Desejo pesquisar ou registrar</span>
                  </h4>
                  <p className="text-xs text-[#F4F7FF]/60 font-light mt-0.5">
                    Preencha a marca que você deseja proteger e adicione variações opcionais.
                  </p>
                </div>

                {/* Marca Principal */}
                <div>
                  <label className="block text-xs font-medium text-[#F4F7FF]/90 mb-1.5">
                    Marca que deseja registrar <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Digite o nome da marca principal"
                    className="w-full px-4 py-3 bg-[#121829] border border-[#1E293B] rounded-xl text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-medium"
                  />
                </div>

                {/* Marca 2 e Marca 3 (Opcionais) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-[#F4F7FF]/80">Marca 2</label>
                      <span className="text-[10px] uppercase font-semibold text-[#F4F7FF]/40 bg-[#1E293B]/60 px-2 py-0.5 rounded">
                        Opcional
                      </span>
                    </div>
                    <input
                      type="text"
                      value={brand2}
                      onChange={(e) => setBrand2(e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-4 py-2.5 bg-[#121829] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-[#F4F7FF]/80">Marca 3</label>
                      <span className="text-[10px] uppercase font-semibold text-[#F4F7FF]/40 bg-[#1E293B]/60 px-2 py-0.5 rounded">
                        Opcional
                      </span>
                    </div>
                    <input
                      type="text"
                      value={brand3}
                      onChange={(e) => setBrand3(e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-4 py-2.5 bg-[#121829] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Ramo de atividade da empresa */}
              <div className="space-y-3 pt-2">
                <div className="border-b border-[#1E293B] pb-2">
                  <label className="block text-sm sm:text-base font-display font-semibold text-[#F4F7FF]">
                    Ramo de atividade da empresa <span className="text-cyan-400">*</span>
                  </label>
                  <p className="text-xs text-[#F4F7FF]/60 font-light mt-0.5">
                    Selecione a categoria principal de atuação do seu negócio.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["Comércio", "Indústria", "Serviços", "Outras Atividades"].map((option) => {
                    const isSelected = activityCategory === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setActivityCategory(option)}
                        className={`flex items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-brand-blue/20 border-cyan-400 text-cyan-300 shadow-md shadow-brand-blue/15 scale-[1.02]"
                            : "bg-[#121829] border-[#1E293B] text-[#F4F7FF]/70 hover:text-[#F4F7FF] hover:border-[#2E3C54]"
                        }`}
                      >
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Box when Outras Atividades is selected */}
                {activityCategory === "Outras Atividades" && (
                  <div className="p-3.5 bg-[#121829] border border-cyan-500/30 rounded-xl space-y-1.5 animate-fade-in mt-2">
                    <label className="block text-xs font-medium text-cyan-300">
                      Qual a atividade da sua empresa? <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={otherActivityText}
                      onChange={(e) => setOtherActivityText(e.target.value)}
                      placeholder="Ex: Aplicativo mobile, consultoria ambiental, marketplace..."
                      className="w-full px-3.5 py-2.5 bg-[#0D1220] border border-[#1E293B] rounded-lg text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}
              </div>

              {/* Section 3: Dados para envio da sua pesquisa */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-[#1E293B] pb-2">
                  <h4 className="text-base sm:text-lg font-display font-semibold text-[#F4F7FF]">
                    Dados para envio da sua pesquisa
                  </h4>
                  <p className="text-xs text-[#F4F7FF]/60 font-light mt-0.5">
                    Informe onde deseja receber o parecer técnico da disponibilidade da marca.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Nome */}
                  <div>
                    <label className="block text-xs font-medium text-[#F4F7FF]/90 mb-1.5">
                      Nome <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-2.5 bg-[#121829] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-medium text-[#F4F7FF]/90 mb-1.5">
                      E-mail <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2.5 bg-[#121829] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-xs font-medium text-[#F4F7FF]/90 mb-1.5">
                      Telefone <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2.5 bg-[#121829] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 transition-all font-mono"
                    />
                  </div>

                  {/* Empresa */}
                  <div>
                    <label className="block text-xs font-medium text-[#F4F7FF]/90 mb-1.5">
                      Empresa <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nome da empresa"
                      className="w-full px-4 py-2.5 bg-[#121829] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-xs font-medium text-[#F4F7FF]/90 mb-1.5">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Conte sobre as atuações/serviços/nichos da sua marca. Esses detalhes são fundamentais para entendermos se sua marca está disponível dentro da modalidade que você atua"
                    className="w-full px-4 py-2.5 bg-[#121829] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-cyan-400 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit Button and Protection info */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-blue to-cyan-500 hover:from-brand-blue/90 hover:to-cyan-400 text-white shadow-lg shadow-brand-blue/30 transition-all duration-200 flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>Enviar</span>
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-center text-[#F4F7FF]/60 text-[11px] font-light">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Seus dados estão protegidos. Não compartilhamos com terceiros.</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
