export default function ContactForm({ en }) {
  const t = (fr, english) => (en ? english : fr);
  return (
    <form
      id="project-form"
      action={
        import.meta.env.VITE_CONTACT_ENDPOINT ||
        "/.netlify/functions/send-email"
      }
      method="post"
    >
      <fieldset>
        <label>
          {t("Nom", "Name")}
          <input name="name" autoComplete="name" required maxLength="160" />
        </label>
        <label>
          {t("Courriel", "Email")}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength="254"
          />
        </label>
        <label className="wide">
          {t("Entreprise (facultatif)", "Company (optional)")}
          <input name="company" autoComplete="organization" maxLength="200" />
        </label>
        <label className="wide">
          {t("Message", "Message")}
          <textarea name="message" rows="5" required maxLength="10000" />
        </label>
        <input type="hidden" name="hp" value="" />
      </fieldset>
      <button className="button" type="submit">
        {t("Envoyer le message", "Send message")} ↗
      </button>
      <p role="status" aria-live="polite"></p>
      <noscript>
        {t(
          "Activez JavaScript pour envoyer votre message.",
          "Enable JavaScript to send your message.",
        )}
      </noscript>
    </form>
  );
}
