import { Translation } from "../types";

export const translations: Record<"pt" | "en", Translation> = {
  pt: {
    nav_diferenciais: "Diferenciais",
    nav_servicos: "Serviços",
    nav_como_funciona: "Como funciona",
    nav_faq: "FAQ",
    nav_sobre: "Sobre",
    nav_contato: "Contato",
    nav_cta: "Solicitar diagnóstico",

    hero_tagline: "Estratégia antes de tudo",
    hero_headline: "A maioria dos processos não falha na execução — falha na decisão.",
    hero_subheadline: "Registro de marca no INPI com transparência e clareza.",
    hero_bullet1: "Diagnóstico objetivo",
    hero_bullet2: "Estratégia por classe (NCL)",
    hero_bullet3: "Acompanhamento do processo",
    hero_cta_diagnostic: "Solicitar diagnóstico gratuito",
    hero_cta_whatsapp: "Falar no WhatsApp",

    form_title: "Diagnóstico Inicial",
    form_subtitle: "Receba um diagnóstico inicial em poucos minutos.",
    form_success: "✓ Diagnóstico recebido! Entraremos em contato em breve.",
    form_brand_label: "Nome da sua marca",
    form_brand_placeholder: "Ex: Minha empresa",
    form_email_label: "Seu e-mail",
    form_email_placeholder: "seu@email.com",
    form_phone_label: "Telefone",
    form_phone_placeholder: "(11) 99999-9999",
    form_activity_label: "Atuação da sua marca",
    form_activity_placeholder: "Conte-nos com o que vocês trabalham, para que possamos analisar a cobertura necessária.",
    form_submit: "Solicitar diagnóstico gratuito",
    form_security: "Seus dados estão protegidos. Não compartilhamos com terceiros.",

    diff_title: "Decisão correta antes da execução.",
    diff_card1_title: "Clareza de risco",
    diff_card1_desc: "Você entende o cenário antes de pagar",
    diff_card2_title: "Estratégia de classes",
    diff_card2_desc: "Enquadramento inteligente reduz retrabalho",
    diff_card3_title: "Transparência total",
    diff_card3_desc: "Escopo claro e comunicação simples",

    services_title: "Serviços estratégicos para sua marca",
    services_disclaimer: "Informações reguladas pelo INPI e pela Convenção da União de Paris.",
    services_list: [
      {
        title: "Análise de Viabilidade e Risco",
        impact: "Impacto: saiba se vale investir antes de protocolar.",
        items: [
          "Registrabilidade e conflitos",
          "Classes e especificações (NCL)",
          "Protocolo com acompanhamento"
        ],
        avoid: "Evita: gastar com marca inviável.",
        cta: "Quero análise do meu caso"
      },
      {
        title: "Incidentes Processuais",
        impact: "Impacto: defesa rápida contra oposições e exigências.",
        items: [
          "Manifestações a oposição",
          "Cumprimento de exigências",
          "Recurso contra indeferimento"
        ],
        avoid: "Evita: perda de prazos e arquivamento.",
        cta: "Preciso de ajuda jurídica"
      },
      {
        title: "Vigilância Preventiva",
        impact: "Impacto: monitoramento ativo de novas marcas publicadas.",
        items: [
          "Varredura semanal do INPI",
          "Alerta de tentativas de cópia",
          "Oposições tempestivas"
        ],
        avoid: "Evita: concorrentes usando nomes iguais.",
        cta: "Quero monitorar minha marca"
      },
      {
        title: "Apoio em Notificações",
        impact: "Impacto: resposta ou envio de notificações extrajudiciais.",
        items: [
          "Notificação contra plágio",
          "Defesa contra falsas alegações",
          "Solução amigável de conflito"
        ],
        avoid: "Evita: processos judiciais caros.",
        cta: "Falar com especialista"
      },
      {
        title: "Protocolo de Madri",
        impact: "Impacto: registro internacional simplificado em vários países.",
        items: [
          "Um único pedido unificado",
          "Economia em taxas de advogados locais",
          "Gestão centralizada da carteira"
        ],
        avoid: "Evita: pirataria de marca na expansão internacional.",
        cta: "Quero registrar no exterior"
      }
    ],

    como_title: "Como funciona",
    como_steps: [
      {
        number: 1,
        title: "Preencha o formulário",
        desc: "Conte sobre sua marca e seu negócio em menos de 2 minutos."
      },
      {
        number: 2,
        title: "Receba o diagnóstico",
        desc: "Análise preliminar com pontos de atenção e próximos passos."
      },
      {
        number: 3,
        title: "Defina a estratégia",
        desc: "Escolha as classes certas e entenda custos antes de começar."
      },
      {
        number: 4,
        title: "Acompanhe o processo",
        desc: "Transparência total em cada etapa até a concessão."
      }
    ],

    faq_title: "Perguntas Frequentes",
    faq_items: [
      {
        question: "Quanto tempo demora o registro de uma marca no INPI?",
        answer: "O processo atualmente leva em média de 10 a 14 meses, desde o protocolo inicial até a concessão. No entanto, o protocolo confere o direito de prioridade sobre terceiros desde o primeiro dia de envio."
      },
      {
        question: "O que são as Classes de Nice (NCL)?",
        answer: "Trata-se de uma classificação internacional composta por 45 classes (sendo do 1 ao 34 para produtos, e do 35 ao 45 para serviços) para delimitar o escopo de atuação e proteção da marca."
      },
      {
        question: "Qual a diferença entre registrar no INPI e na Junta Comercial?",
        answer: "A Junta Comercial protege o Nome Empresarial (razão social) apenas no nível estadual onde a empresa foi aberta. O registro no INPI protege o Nome de Marca de forma nacional em todo o território brasileiro e para seu segmento, impedindo imitações em qualquer estado."
      },
      {
        question: "Posso usar a marca enquanto o processo está tramitando?",
        answer: "Sim, pode usar normalmente. Inclusive, o uso efetivo da marca ajuda a provar a anterioridade de uso de boa-fé caso surja algum litígio durante a tramitação processual no INPI."
      },
      {
        question: "O que acontece se eu não registrar minha marca?",
        answer: "Sem o registro, você não é o dono legal. Qualquer pessoa ou concorrente pode registrar a sua marca antes de você e legalmente obrigá-lo a mudar de nome, destruir estoque, mudar fachadas e sites, além de poder cobrar indenização retroativa pelo uso indevido."
      }
    ],

    sobre_title: "Sobre a FIBIZZ",
    sobre_p1: "Atuamos com foco em propriedade intelectual, combinando conhecimento técnico com uma comunicação clara e acessível. Nosso objetivo é ajudar você a proteger sua marca com segurança, transparência, entendendo suas necessidades antes de passar qualquer preço.",
    sobre_p2: "",
    sobre_pillars_title: "Transparência, estratégia e agilidade",
    sobre_pillars: [
      {
        title: "Estratégia",
        desc: "Mapeamento minucioso e enquadramento inteligente de classes (NCL) antes de protocolar."
      },
      {
        title: "Transparência",
        desc: "Entendimento real da viabilidade e necessidades da sua marca antes de qualquer cobrança."
      },
      {
        title: "Agilidade",
        desc: "Plataforma livre de burocracias com protocolos rápidos e monitoramento constante."
      }
    ],

    footer_contacts: "Canais de Atendimento",
    footer_hours: "Horário de Funcionamento",
    footer_hours_mon_fri: "Segunda a Sexta",
    footer_hours_sat: "Sábado",
    footer_hours_sun: "Domingo",
    footer_hours_closed: "Fechado",
    footer_social: "Siga-nos Online",
    footer_copyright: "© 2026 FIBIZZ Propriedade Intelectual. Todos os direitos reservados. CNPJ sob nº 62.918.430/0001-44.",
    footer_privacy: "Políticas de Privacidade",
    footer_terms: "Termos de Uso",
    footer_whatsapp_cta: "Falar no WhatsApp"
  },
  en: {
    nav_diferenciais: "Why Us",
    nav_servicos: "Services",
    nav_como_funciona: "How it works",
    nav_faq: "FAQ",
    nav_sobre: "About",
    nav_contato: "Contact",
    nav_cta: "Request diagnosis",

    hero_tagline: "Strategy before everything",
    hero_headline: "Most processes don't fail in execution — they fail in decision.",
    hero_subheadline: "Trademark registration at INPI with transparency and clarity.",
    hero_bullet1: "Objective diagnosis",
    hero_bullet2: "Strategy by class (NCL)",
    hero_bullet3: "Process follow-up",
    hero_cta_diagnostic: "Request free diagnosis",
    hero_cta_whatsapp: "Chat on WhatsApp",

    form_title: "Initial Diagnosis",
    form_subtitle: "Receive an initial diagnosis in a few minutes.",
    form_success: "✓ Diagnosis received! We will get in touch shortly.",
    form_brand_label: "Your brand name",
    form_brand_placeholder: "E.g., My company",
    form_email_label: "Your email",
    form_email_placeholder: "your@email.com",
    form_phone_label: "Phone",
    form_phone_placeholder: "+55 (11) 99999-9999",
    form_activity_label: "Your brand's segment",
    form_activity_placeholder: "Tell us what you work with, so we can analyze the required coverage.",
    form_submit: "Request free diagnosis",
    form_security: "Your data is protected. We do not share it with third parties.",

    diff_title: "Correct decision before execution.",
    diff_card1_title: "Risk clarity",
    diff_card1_desc: "You understand the scenario before paying",
    diff_card2_title: "Class strategy",
    diff_card2_desc: "Smart classification reduces rework",
    diff_card3_title: "Total transparency",
    diff_card3_desc: "Clear scope and simple communication",

    services_title: "Strategic services for your brand",
    services_disclaimer: "Information regulated by INPI and the Paris Convention.",
    services_list: [
      {
        title: "Feasibility & Risk Analysis",
        impact: "Impact: know if it's worth investing before filing.",
        items: [
          "Registrability and conflicts",
          "Classes and specifications (NCL)",
          "Filing with tracking"
        ],
        avoid: "Avoids: spending on non-viable trademarks.",
        cta: "I want a case analysis"
      },
      {
        title: "Procedural Actions",
        impact: "Impact: fast defense against oppositions and requirements.",
        items: [
          "Opposition responses",
          "Fulfillment of requirements",
          "Appeals against rejection"
        ],
        avoid: "Avoids: missing deadlines and abandonment.",
        cta: "I need legal help"
      },
      {
        title: "Preventive Watch",
        impact: "Impact: active monitoring of newly published trademarks.",
        items: [
          "Weekly INPI scans",
          "Alerts on imitation attempts",
          "Timely oppositions"
        ],
        avoid: "Avoids: competitors using similar names.",
        cta: "I want to watch my trademark"
      },
      {
        title: "Notice Support",
        impact: "Impact: responding to or sending cease-and-desist letters.",
        items: [
          "Anti-plagiarism notifications",
          "Defense against false claims",
          "Amicable conflict resolution"
        ],
        avoid: "Avoids: expensive lawsuits.",
        cta: "Talk to a specialist"
      },
      {
        title: "Madrid Protocol",
        impact: "Impact: simplified international filing in multiple countries.",
        items: [
          "A single unified application",
          "Savings on local foreign counsels",
          "Centralized portfolio management"
        ],
        avoid: "Avoids: trademark piracy during global expansion.",
        cta: "I want to register abroad"
      }
    ],

    como_title: "How it works",
    como_steps: [
      {
        number: 1,
        title: "Fill out the form",
        desc: "Tell us about your brand and business in less than 2 minutes."
      },
      {
        number: 2,
        title: "Receive the diagnosis",
        desc: "Preliminary analysis with points of attention and next steps."
      },
      {
        number: 3,
        title: "Define the strategy",
        desc: "Choose the right classes and understand costs before starting."
      },
      {
        number: 4,
        title: "Follow the process",
        desc: "Total transparency at each step until final grant."
      }
    ],

    faq_title: "Frequently Asked Questions",
    faq_items: [
      {
        question: "How long does a trademark registration take at INPI?",
        answer: "The process currently takes an average of 10 to 14 months, from initial filing to final granting. However, the filing receipt guarantees your priority date over competitors from day one."
      },
      {
        question: "What are the Nice Classes (NCL)?",
        answer: "It is an international classification consisting of 45 classes (classes 1 to 34 for goods, and 35 to 45 for services) to specify the trade scope of your trademark."
      },
      {
        question: "What is the difference between INPI and the Board of Trade?",
        answer: "The local Board of Trade (Junta Comercial) only protects your corporate legal name (razão social) on a state level. INPI registration protects your actual Brand/Trade Name nationally, preventing lookalikes."
      },
      {
        question: "Can I use the trademark while the application is pending?",
        answer: "Yes, you can use it normally. In fact, active commercial use helps prove prior use in good faith if any dispute arises during prosecution."
      },
      {
        question: "What happens if I don't register my trademark?",
        answer: "Without registration, you do not legally own it. Anyone can register your brand name first and legally force you to change your name, destroy existing stocks, and pay retroactively."
      }
    ],

    sobre_title: "About FIBIZZ",
    sobre_p1: "We operate with a focus on intellectual property, combining technical knowledge with clear and accessible communication. Our goal is to help you protect your brand with security, transparency, understanding your needs before quoting any price.",
    sobre_p2: "",
    sobre_pillars_title: "Transparency, Strategy and Agility",
    sobre_pillars: [
      {
        title: "Strategy",
        desc: "Meticulous mapping and smart enquadramento of classes (NCL) before filing."
      },
      {
        title: "Transparency",
        desc: "Real understanding of feasibility and your brand's needs before any fee."
      },
      {
        title: "Agility",
        desc: "A bureaucracy-free platform with fast filings and continuous monitoring."
      }
    ],

    footer_contacts: "Get in Touch",
    footer_hours: "Office Hours",
    footer_hours_mon_fri: "Monday to Friday",
    footer_hours_sat: "Saturday",
    footer_hours_sun: "Sunday",
    footer_hours_closed: "Closed",
    footer_social: "Social Channels",
    footer_copyright: "© 2026 FIBIZZ Intellectual Property. All rights reserved. Registered under CNPJ number 62.918.430/0001-44.",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Use",
    footer_whatsapp_cta: "Chat with Support"
  }
};
