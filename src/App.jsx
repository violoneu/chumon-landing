import { useEffect, useRef } from "react";
import "./App.css";
import ContactForm from "./ContactForm"; // Import the contact form
import { FaBolt, FaMapMarkerAlt, FaBullseye } from "react-icons/fa";

export default function App() {
  const servicesRef = useRef(null);

  useEffect(() => {
    const cards = servicesRef.current?.querySelectorAll("[data-service]");
    if (!cards || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("reveal");
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <div className="site">
      {/* HERO */}
      <header className="hero">
        {/* Video background */}
        <video
          className="hero-media"
          src="video.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <div className="hero-overlay" />

        <nav className="topbar">
          <div className="brand">
            <span style={{ color: "white" }}></span>
          </div>

          <div className="nav-links">
            <a href="https://table.chumon.ca" className="nav-link">
              Table
            </a>
            <a href="https://cuisine.chumon.ca/landing" className="nav-link">
              Cuisine
            </a>
            <a className="cta" href="#contact">
              Contact
            </a>
          </div>
        </nav>

        <div className="hero-content">
          {/* Big centered logo in the hero */}
          <img src="/logo_blanc.svg" alt="Chumon" className="logo-large" />
          <h1>
            <span>Pas le temps de niaiser</span>
          </h1>
          <p className="sub">
            Optimisez le temps de vos clients et de votre équipe. Des solutions
            numériques 100% québécoises.
          </p>
        </div>
      </header>
      {/* DESCRIPTION */}
      <section className="description">
        <div className="content">
          <h2>Qu’est‑ce que Chumon&nbsp;?</h2>
          <p>
            Chumon conçoit des outils simples et rapides pour la restauration:
            gestion de file d’attente (chumon <strong>table</strong>), CMS
            cuisine (chumon <strong>cuisine</strong>) et services web sur
            mesure. Notre objectif est de réduire l’attente, éliminer les
            frictions et donner plus de temps à vos équipes pour ce qui compte
            vraiment.
          </p>
        </div>
      </section>

      <section className="services" ref={servicesRef}>
        <div className="services-header">
          <h2>Nos solutions</h2>
          <p>
            Des outils conçus pour optimiser votre service et améliorer
            l'expérience client
          </p>
        </div>
        <div className="services-wrap">
          {/* TABLE */}
          <a href="https://table.chumon.ca" className="card-link">
            <article
              className="card highlight-table"
              data-service
              data-name="table"
              data-color="#FE7648"
              title="Waitlist / Table"
            >
              <div className="card-accent" />
              <img
                className="card-img"
                src="table.jpg"
                alt="chumon table — waitlist"
              />
              <h3>
                <span className="chumon">chumon</span>
                <span className="submark1">table</span>
              </h3>
              <p>
                Waitlist, SMS, kiosque d’accueil. Bilingue, rapide, sans
                friction.
              </p>
            </article>
          </a>

          {/* CUISINE */}
          <a href="https://cuisine.chumon.ca/landing" className="card-link">
            <article
              className="card highlight-cuisine"
              data-service
              data-name="cuisine"
              data-color="#5DB2D5"
              title="CMS / Cuisine"
            >
              <div className="card-accent" />
              <img
                className="card-img"
                src="cms.jpg"
                alt="chumon cuisine — CMS"
              />
              <h3>
                <span className="chumon">chumon</span>
                <span className="submark2">cuisine</span>
              </h3>
              <p>
                CMS cuisine: menus, inventaires, besoins & commandes – clair et
                efficace.
              </p>
            </article>
          </a>
          {/* SUR MESURE (no redirect) */}
          <article
            className="card"
            data-service
            title="Sur mesure"
            data-color="#11111100"
          >
            <div className="card-accent" />

            <h3>Sur&nbsp;mesure</h3>
            <p>Développements et intégrations adaptés à votre réalité.</p>
            <ul className="chips">
              <li>Intégrations & API</li>
              <li>Automatisations</li>
              <li>Sites vitrines</li>
              <li>E-commerce léger</li>
              <li>Formulaires & CRM</li>
              <li>Webhooks</li>
            </ul>
          </article>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section
        id="contact"
        style={{
          padding: "clamp(80px, 10vw, 120px) 0",
          background: "#fff",
          borderTop: "1px solid #e5e5e5",
        }}
      >
        <div className="contact-grid">
          <div className="contact-text">
            <h2>Parlons de votre projet</h2>
            <p>
              Prêt à optimiser votre service ? Contactez-nous pour discuter de
              vos besoins et découvrir comment nos solutions peuvent transformer
              votre expérience client.
            </p>
            <div className="contact-features">
              <div className="contact-feature">
                <FaBolt className="contact-feature-icon" />
                <span>Réponse rapide sous 24h</span>
              </div>
              <div className="contact-feature">
                <FaMapMarkerAlt className="contact-feature-icon" />
                <span>Solutions 100% québécoises</span>
              </div>
              <div className="contact-feature">
                <FaBullseye className="contact-feature-icon" />
                <span>Consultation personnalisée gratuite</span>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Chumon — Fait au Québec</p>
      </footer>
    </div>
  );
}
