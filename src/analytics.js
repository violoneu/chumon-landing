// analytics.js
export function loadGA() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id) {
    console.warn("GA: missing VITE_GA_MEASUREMENT_ID");
    return;
  }
  console.log("GA using ID:", id); // <-- runtime check that survives bundling

  // Load GA library
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.addEventListener("error", () =>
    console.error("GA script failed to load")
  );
  script.addEventListener("load", () => {
    // Fire initial page_view ONLY after the library is ready
    sendPageview();
  });
  document.head.appendChild(script);

  // gtag bootstrap
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", id, {
    send_page_view: false, // SPA: we send our own
    debug_mode: true, // show up in DebugView
  });
}

export function sendPageview() {
  if (!window.gtag) {
    console.warn("GA not ready yet");
    return;
  }
  const payload = {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  };
  console.log("GA page_view ->", payload);
  window.gtag("event", "page_view", payload);
}
