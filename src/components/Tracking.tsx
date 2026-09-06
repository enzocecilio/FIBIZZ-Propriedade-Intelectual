import React from "react";

// Global type declarations for tracking properties on window
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: {
      (...args: any[]): void;
      callMethod?: (...args: any[]) => void;
      queue: any[];
      loaded?: boolean;
      version?: string;
      push: (...args: any[]) => void;
    };
    _fbq?: any;
  }
}

/**
 * Tracks a pageview event across active tracking services (Google Analytics & Meta Pixel)
 */
export function trackPageview() {
  const url = window.location.pathname + window.location.search;
  
  // Google Analytics Pageview
  const gaId = (import.meta as any).env.VITE_GA_ID;
  if (window.gtag && gaId) {
    window.gtag("config", gaId, {
      page_path: url,
    });
  }
  
  // Facebook / Meta Pixel Pageview
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
}

/**
 * Tracks a Lead conversion event (e.g. successful form submission)
 */
export function trackLead(email?: string, brandName?: string) {
  console.log("FIBIZZ Tracking: Evento 'Lead' acionado", { email, brandName });

  // 1. Google Analytics Lead Event
  if (window.gtag) {
    window.gtag("event", "generate_lead", {
      currency: "BRL",
      value: 1.0,
      brand_name: brandName,
      lead_email: email,
    });
  }

  // 2. Google Tag Manager Custom Event
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "lead_submitted",
      brandName,
      email,
    });
  }

  // 3. Facebook / Meta Pixel Lead Event
  if (window.fbq) {
    window.fbq("track", "Lead", {
      content_name: brandName,
      status: "Submitted",
    });
  }
}

/**
 * Tracking component that initializes pixels and GTM containers dynamically
 * based on defined environment variables.
 */
export default function Tracking() {
  React.useEffect(() => {
    const gtmId = (import.meta as any).env.VITE_GTM_ID;
    const gaId = (import.meta as any).env.VITE_GA_ID;
    const pixelId = (import.meta as any).env.VITE_FB_PIXEL_ID;

    // --- 1. Google Tag Manager (GTM) Initialization ---
    if (gtmId && !document.getElementById("gtm-script")) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      
      const script = document.createElement("script");
      script.id = "gtm-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);

      // GTM Noscript iframe fallback
      const noscript = document.createElement("noscript");
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.appendChild(noscript);
    }

    // --- 2. Google Analytics 4 (GA4) Initialization ---
    if (gaId && !document.getElementById("ga-script")) {
      const script = document.createElement("script");
      script.id = "ga-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: any[]) {
        window.dataLayer?.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId);
    }

    // --- 3. Facebook / Meta Pixel Initialization ---
    if (pixelId && !document.getElementById("fb-pixel-script")) {
      const fbqTracker: any = function (...args: any[]) {
        if (fbqTracker.callMethod) {
          fbqTracker.callMethod(...args);
        } else {
          fbqTracker.queue.push(args);
        }
      };
      fbqTracker.queue = [] as any[];
      fbqTracker.push = fbqTracker;
      fbqTracker.loaded = true;
      fbqTracker.version = "2.0";
      
      window.fbq = fbqTracker;
      if (!window._fbq) {
        window._fbq = fbqTracker;
      }

      const script = document.createElement("script");
      script.id = "fb-pixel-script";
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);

      window.fbq("init", pixelId);
      window.fbq("track", "PageView");

      // Noscript fallback
      const noscript = document.createElement("noscript");
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
      document.body.appendChild(noscript);
    }

    // Track initial page load pageview
    trackPageview();
  }, []);

  return null;
}
