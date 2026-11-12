import "./App.css";
import { loadGA } from "./analytics";

const header = document.querySelector("header");
const toggle = header.querySelector(".menu-toggle");
const nav = header.querySelector("nav");
const language = header.querySelector(".locale");
const alternate = language.getAttribute("href");
const sections = [...document.querySelectorAll("main section[id]")];
document.documentElement.classList.add("enhanced");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  header.classList.toggle("open", open);
}
toggle.addEventListener("click", () =>
  setMenu(toggle.getAttribute("aria-expanded") !== "true"),
);
nav.addEventListener("click", (event) => {
  const anchor = event.target.closest("a");
  if (!anchor) return;
  setMenu(false);
  if (anchor.hash && sections.length) {
    const section = document.getElementById(anchor.hash.slice(1));
    section?.setAttribute("tabindex", "-1");
    section?.focus({ preventScroll: true });
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("open")) {
    setMenu(false);
    toggle.focus();
  }
});

let frame;
function updateNavigation() {
  frame = 0;
  const offset = header.getBoundingClientRect().height + 20;
  const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
  const active = atBottom ? sections.at(-1) : sections
    .filter((section) => section.getBoundingClientRect().top <= offset)
    .at(-1);
  for (const link of nav.querySelectorAll("[data-section]")) {
    if (link.dataset.section === active?.id)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  if (sections.length)
    language.href = alternate + (active ? "#" + active.id : "");
}
function scheduleUpdate() {
  if (!frame) frame = requestAnimationFrame(updateNavigation);
}
window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
window.addEventListener("pageshow", scheduleUpdate);
updateNavigation();

const form = document.querySelector("#project-form");
if (form) {
  const en = document.documentElement.lang === "en-CA";
  const status = form.querySelector("[role=status]");
  const button = form.querySelector("button");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = en ? "Sending…" : "Envoi en cours…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(20000),
      });
      if (
        !response.ok ||
        response.headers.get("content-type")?.includes("text/html")
      )
        throw new Error("Submission failed");
      form.reset();
      status.textContent = en
        ? "Thank you. Your message was sent."
        : "Merci. Votre message a été envoyé.";
    } catch {
      status.textContent = en
        ? "Your message could not be sent. Try again or email support@chumon.ca."
        : "L’envoi a échoué. Réessayez ou écrivez à support@chumon.ca.";
    } finally {
      button.disabled = false;
    }
  });
}
if (import.meta.env.VITE_GA_MEASUREMENT_ID) loadGA();
