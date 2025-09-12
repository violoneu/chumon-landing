import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    hp: "", // honeypot
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Envoi en cours…");

    try {
      const res = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      setStatus("Message envoyé. Merci!");
      setForm({ name: "", email: "", phone: "", message: "", hp: "" });
    } catch (err) {
      console.error(err);
      setStatus("Erreur d’envoi. Réessayez plus tard.");
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Contactez-nous</h2>

      {/* Honeypot visually hidden */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Ne pas remplir:
          <input
            type="text"
            name="hp"
            value={form.hp}
            onChange={handleChange}
            tabIndex={-1}
          />
        </label>
      </div>

      <label>
        Nom:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Courriel:
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Téléphone:
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </label>
      <label>
        Message:
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Envoyer</button>
      <div className="status-message">{status}</div>
    </form>
  );
};

export default ContactForm;
