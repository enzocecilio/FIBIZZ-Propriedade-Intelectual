import React from "react";
import { CheckCircle, Shield, Mail, Phone, Building2 } from "lucide-react";
import { Translation } from "../types";
import { trackLead } from "./Tracking";
import { getGoogleAccessToken } from "../lib/firebase";

interface ContactFormProps {
  t: Translation;
  initialBrandName: string;
  initialActivity: string;
  onOpenFullDiagnostic?: () => void;
}

export default function ContactForm({ t, initialBrandName, initialActivity, onOpenFullDiagnostic }: ContactFormProps) {
  const [brandName, setBrandName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [activity, setActivity] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  // Update when initial values change (e.g. from AI tool results integration)
  React.useEffect(() => {
    if (initialBrandName) setBrandName(initialBrandName);
    if (initialActivity) setActivity(initialActivity);
  }, [initialBrandName, initialActivity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !email.trim() || !phone.trim() || !activity.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const token = getGoogleAccessToken();
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          brandActivity: activity.trim(),
          created_at: new Date().toISOString(),
          accessToken: token || undefined
        })
      });

      const resData = await response.json();
      if (resData.isOk) {
        setSuccess(true);
        // Trigger conversion event for analytics / pixel tracking
        trackLead(email.trim(), brandName.trim());
        
        // Reset form
        setBrandName("");
        setEmail("");
        setPhone("");
        setActivity("");
      } else {
        throw new Error("Failed to submit lead");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar formulário. Por favor, tente novamente ou fale pelo WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark/30 scroll-mt-16 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-[#F4F7FF] mb-3">
            {t.form_title}
          </h2>
          <p className="text-sm text-[#F4F7FF]/70 leading-relaxed font-light">
            {t.form_subtitle}
          </p>
          {onOpenFullDiagnostic && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onOpenFullDiagnostic}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-blue/15 hover:bg-brand-blue/25 border border-brand-blue/40 text-cyan-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <span>Deseja pesquisar mais de uma marca ou enviar dados detalhados?</span>
                <span className="underline decoration-cyan-400 font-bold">Abrir Formulário Completo</span>
              </button>
            </div>
          )}
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-8 p-5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-start space-x-3.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-emerald-300 leading-normal font-medium">
              {t.form_success}
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-5 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-xs sm:text-sm text-rose-300 leading-normal font-medium">
            {error}
          </div>
        )}

        {/* Lead Form */}
        <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border rounded-2xl p-5 sm:p-8 space-y-5 shadow-2xl relative">
          
          {/* Brand Name */}
          <div>
            <label htmlFor="form-brand-name" className="block text-xs font-semibold text-[#F4F7FF]/80 uppercase tracking-wider mb-2">
              {t.form_brand_label}
            </label>
            <div className="relative">
              <input
                id="form-brand-name"
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder={t.form_brand_placeholder}
                className="w-full bg-brand-dark border border-brand-border hover:border-brand-blue/30 focus:border-brand-blue focus:outline-none rounded-xl px-4 py-3 pl-11 text-sm text-[#F4F7FF] transition-all"
              />
              <Building2 className="w-4 h-4 text-[#F4F7FF]/40 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label htmlFor="form-email" className="block text-xs font-semibold text-[#F4F7FF]/80 uppercase tracking-wider mb-2">
                {t.form_email_label}
              </label>
              <div className="relative">
                <input
                  id="form-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.form_email_placeholder}
                  className="w-full bg-brand-dark border border-brand-border hover:border-brand-blue/30 focus:border-brand-blue focus:outline-none rounded-xl px-4 py-3 pl-11 text-sm text-[#F4F7FF] transition-all"
                />
                <Mail className="w-4 h-4 text-[#F4F7FF]/40 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="form-phone" className="block text-xs font-semibold text-[#F4F7FF]/80 uppercase tracking-wider mb-2">
                {t.form_phone_label}
              </label>
              <div className="relative">
                <input
                  id="form-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.form_phone_placeholder}
                  className="w-full bg-brand-dark border border-brand-border hover:border-brand-blue/30 focus:border-brand-blue focus:outline-none rounded-xl px-4 py-3 pl-11 text-sm text-[#F4F7FF] transition-all"
                />
                <Phone className="w-4 h-4 text-[#F4F7FF]/40 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Business activity/description */}
          <div>
            <label htmlFor="form-activity" className="block text-xs font-semibold text-[#F4F7FF]/80 uppercase tracking-wider mb-2">
              {t.form_activity_label}
            </label>
            <textarea
              id="form-activity"
              required
              rows={4}
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder={t.form_activity_placeholder}
              className="w-full bg-brand-dark border border-brand-border hover:border-brand-blue/30 focus:border-brand-blue focus:outline-none rounded-xl px-4 py-3 text-sm text-[#F4F7FF] resize-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="form-submit-btn"
              type="submit"
              disabled={submitting}
              className="w-full font-semibold py-4 px-6 rounded-xl text-sm bg-brand-blue text-[#F4F7FF] hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl shadow-brand-blue/20"
            >
              {submitting ? "Enviando..." : t.form_submit}
            </button>
          </div>
        </form>

        {/* Security / Compliance badge */}
        <p className="text-center text-xs text-[#F4F7FF]/35 mt-5 flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4 text-[#F4F7FF]/40" />
          <span>{t.form_security}</span>
        </p>

      </div>
    </section>
  );
}
