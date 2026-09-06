export interface Translation {
  // Navigation & Header
  nav_diferenciais: string;
  nav_servicos: string;
  nav_como_funciona: string;
  nav_faq: string;
  nav_sobre: string;
  nav_contato: string;
  nav_cta: string;

  // Hero Section
  hero_tagline: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_bullet1: string;
  hero_bullet2: string;
  hero_bullet3: string;
  hero_cta_diagnostic: string;
  hero_cta_whatsapp: string;

  // Form Section
  form_title: string;
  form_subtitle: string;
  form_success: string;
  form_brand_label: string;
  form_brand_placeholder: string;
  form_email_label: string;
  form_email_placeholder: string;
  form_phone_label: string;
  form_phone_placeholder: string;
  form_activity_label: string;
  form_activity_placeholder: string;
  form_submit: string;
  form_security: string;

  // Diferenciais Section
  diff_title: string;
  diff_card1_title: string;
  diff_card1_desc: string;
  diff_card2_title: string;
  diff_card2_desc: string;
  diff_card3_title: string;
  diff_card3_desc: string;

  // Serviços Section
  services_title: string;
  services_disclaimer: string;
  services_list: Array<{
    title: string;
    impact: string;
    items: string[];
    avoid: string;
    cta: string;
  }>;

  // Como Funciona Section
  como_title: string;
  como_steps: Array<{
    number: number;
    title: string;
    desc: string;
  }>;

  // FAQ Section
  faq_title: string;
  faq_items: Array<{
    question: string;
    answer: string;
  }>;

  // Sobre Section
  sobre_title: string;
  sobre_p1: string;
  sobre_p2: string;
  sobre_pillars_title: string;
  sobre_pillars: Array<{
    title: string;
    desc: string;
  }>;

  // Footer & Contacts
  footer_contacts: string;
  footer_hours: string;
  footer_hours_mon_fri: string;
  footer_hours_sat: string;
  footer_hours_sun: string;
  footer_hours_closed: string;
  footer_social: string;
  footer_copyright: string;
  footer_privacy: string;
  footer_terms: string;
  footer_whatsapp_cta: string;
}
