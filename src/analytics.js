// analytics.js
export function loadGA() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id) return;

  // load script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", id, { send_page_view: false });
}
