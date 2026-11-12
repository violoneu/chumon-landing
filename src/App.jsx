import { pages, navigation, publishedNotes } from "./content";
import { products } from "./products";
import { steps } from "./steps";
import ContactForm from "./ContactForm";

function Notes({ items }) {
  return (
    <ul className="notes-list">
      {items.map((post) => (
        <li key={post.path} lang={post.lang}>
          <time dateTime={post.published}>
            {new Intl.DateTimeFormat(post.lang + "-CA", {
              dateStyle: "long",
              timeZone: "UTC",
            }).format(new Date(post.published))}
          </time>
          <h3>
            <a href={post.path}>{post.title}</a>
          </h3>
          <p>{post.excerpt}</p>
        </li>
      ))}
    </ul>
  );
}

export default function App({ page, lang }) {
  const en = lang === "en",
    home = page === "home";
  const t = (fr, eng) => (en ? eng : fr);
  const base = pages.home[lang].path;
  const section = (id) => (home ? "" : base) + "#" + id;
  const alt = en ? "fr" : "en";
  const info = pages[page]?.[lang];
  const alternate =
    pages[page]?.[alt]?.path ??
    (page.startsWith("post-") ? pages.blog[alt].path : pages.home[alt].path);
  const notes = publishedNotes(lang);
  const pending = t("[À COMPLÉTER]", "[TO COMPLETE]");
  const logo = (
    <a href={base} aria-label={t("Chumon — Accueil", "Chumon — Home")}>
      <img
        className="wordmark"
        src="/logo_blanc.svg"
        alt="Chumon"
        width="143"
        height="22"
      />
    </a>
  );
  const menu = (
    <>
      {navigation.map(([id, fr, eng]) => (
        <a key={id} data-section={id} href={section(id)}>
          {t(fr, eng)}
        </a>
      ))}
      <a
        aria-current={page === "blog" ? "page" : undefined}
        href={pages.blog[lang].path}
      >
        Blog
      </a>
    </>
  );
  return (
    <>
      <a className="skip" href="#main">
        {t("Aller au contenu", "Skip to content")}
      </a>
      <header>
        {logo}
        <button
          className="menu-toggle"
          aria-expanded="false"
          aria-controls="primary-nav"
        >
          Menu
        </button>
        <nav
          id="primary-nav"
          aria-label={t("Navigation principale", "Main navigation")}
        >
          {menu}
        </nav>
        <a
          className="locale"
          href={alternate}
          data-home={home ? "true" : "false"}
          hrefLang={alt + "-CA"}
        >
          {alt.toUpperCase()}
        </a>
      </header>
      <main id="main">
        {home ? (
          <>
            <section className="hero">
              <div className="intro">
                <div className="location">
                  <i />
                  {t(
                    "Studio de développement · Montréal",
                    "Software studio · Montréal",
                  )}
                </div>
                <h1>
                  {t("Des logiciels sur mesure,", "Custom software,")}{" "}
                  <em>{t("prêts à servir", "ready for the real world")}</em>
                </h1>
                <p>
                  {t(
                    "Chumon est un studio montréalais de développement logiciel sur mesure. On observe le travail sur le terrain, on conçoit une application adaptée au problème, et on la met en service. Puis on reste proche.",
                    "Chumon is a custom software studio in Montreal. We observe the work on site, build an application around the problem, and stay involved once it’s in service.",
                  )}
                </p>
                <div className="actions">
                  <a className="button" href="#contact">
                    {t("Parler d’un projet", "Talk about a project")} ↗
                  </a>
                  <a className="arrowlink" href="#realisations">
                    {t("Voir nos réalisations", "Explore our work")} ↗
                  </a>
                </div>
              </div>
              <figure>
                <img
                  className="photo"
                  src="/img/hero.webp"
                  width="1200"
                  height="900"
                  fetchPriority="high"
                  alt=""
                />
              </figure>
            </section>
            <section id="realisations">
              <h2>{t("Nos réalisations", "Our work")}</h2>
              <div className="cards">
                {products.map((p) => (
                  <article key={p.image}>
                    <a href={p.url} className="product">
                      <img
                        className="photo"
                        src={"/media/" + p.image + "-960.webp"}
                        srcSet={[480, 960, 1440]
                          .map(
                            (w) =>
                              "/media/" +
                              p.image +
                              "-" +
                              w +
                              ".webp " +
                              w +
                              "w",
                          )
                          .join(", ")}
                        sizes="(max-width:760px) 100vw, 50vw"
                        width="960"
                        height="720"
                        loading="lazy"
                        alt=""
                      />
                      <h3>
                        {p.name} <span aria-hidden="true">↗</span>
                      </h3>
                    </a>
                    <p>
                      {p.image === "table" ? (
                        <>
                          {t(
                            "Une liste d’attente bilingue en service chez ",
                            "A bilingual waitlist in service at ",
                          )}
                          <a href="https://yoka.ca/">Yokato Yokabai</a>
                          {t(
                            ", restaurant recommandé par le Guide MICHELIN. Ramen Youki est aussi partenaire.",
                            ", a MICHELIN Guide-recommended restaurant. Ramen Youki is also a partner.",
                          )}
                        </>
                      ) : (
                        p[lang]
                      )}
                    </p>
                    <dl>
                      {[
                        t("Le problème", "The problem"),
                        t("Ce qu’on a construit", "What we built"),
                        t("Le résultat", "The result"),
                      ].map((label) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{pending}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>
            </section>
            <section id="approche">
              <h2>{t("Notre approche", "Our approach")}</h2>
              <p>
                {t(
                  "Pas de forfait figé : on part de votre façon de travailler, et on construit seulement ce qui sert.",
                  "We start with how your team works and build only what you need, without a fixed package.",
                )}
              </p>
              <ol className="steps">
                {steps.map(([fr, eng, body, translation]) => (
                  <li key={fr}>
                    <h3>{t(fr, eng)}</h3>
                    <p>{t(body, translation)}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section id="a-propos" className="about">
              <img
                className="portrait"
                src="/img/felix.webp"
                width="640"
                height="640"
                alt=""
                loading="lazy"
              />
              <div>
                <h2>{t("À propos", "About")}</h2>
                <h3>Félix St-Pierre</h3>
                <p>
                  {t(
                    "J’ai fondé Chumon à Montréal.",
                    "I founded Chumon in Montreal.",
                  )}{" "}
                  {pending}
                </p>
                <p>
                  {t(
                    "Je travaille directement avec les équipes et je reste proche une fois leur application en service.",
                    "I work directly with teams and stay involved once their application is in service.",
                  )}{" "}
                  {pending}
                </p>
              </div>
            </section>
            {notes.length > 0 && (
              <section>
                <h2>{t("Notes du studio", "Studio notes")}</h2>
                <Notes items={notes.slice(0, 3)} />
                <a className="arrowlink" href={pages.blog[lang].path}>
                  {t("Tous les articles", "All articles")} ↗
                </a>
              </section>
            )}
            <section id="contact" className="contact">
              <div>
                <h2>
                  {t("Parlons de votre projet", "Tell us about your project")}
                </h2>
                <p>
                  {t(
                    "Où le travail se complique-t-il pour votre équipe?",
                    "Where does the work get difficult for your team?",
                  )}
                </p>
                <a href="mailto:support@chumon.ca">support@chumon.ca</a>
              </div>
              <ContactForm en={en} />
            </section>
          </>
        ) : (
          <>
            <div className="crumb">
              <a href={base}>{pages.home[lang].label}</a> /{" "}
              {info?.label ?? "404"}
            </div>
            <section className="inner">
              <h1>
                {page === "blog"
                  ? t("Notes du studio", "Studio notes")
                  : (info?.label ?? t("Page introuvable", "Page not found"))}
              </h1>
              {page === "blog" &&
                (notes.length ? (
                  <Notes items={notes} />
                ) : (
                  <p>
                    {t(
                      "Le premier article est en préparation.",
                      "Our first article is in preparation.",
                    )}
                  </p>
                ))}
              {page.startsWith("post-") && (
                <>
                  <time dateTime={info.published}>{info.published}</time>
                  {info.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </>
              )}
              {page === "privacy" && (
                <p>
                  {t(
                    "Lorsque vous utilisez le formulaire, le studio reçoit votre nom, votre courriel, votre message et le nom de votre entreprise si vous le fournissez. Pour toute question, écrivez à",
                    "When you use the form, the studio receives your name, email, message, and company name if provided. For questions, write to",
                  )}{" "}
                  <a href="mailto:support@chumon.ca">support@chumon.ca</a>.
                </p>
              )}
              {page === "legal" && (
                <p>
                  {t(
                    "Le site chumon.ca est exploité par 9507-5503 Québec inc., sous le nom Chumon, à Montréal. Pour joindre le studio",
                    "Chumon.ca is operated by 9507-5503 Québec inc., doing business as Chumon in Montreal. Reach the studio at",
                  )}{" "}
                  <a href="mailto:support@chumon.ca">support@chumon.ca</a>.
                </p>
              )}
              {page === "missing" && (
                <a href={base}>{t("Revenir à l’accueil", "Return home")}</a>
              )}
            </section>
          </>
        )}
      </main>
      <footer>
        <div>
          {logo}
          <p>9507-5503 Québec inc. · Montréal</p>
        </div>
        <nav aria-label={t("Plan du site", "Sitemap")}>{menu}</nav>
        <nav
          aria-label={t("Produits et informations", "Products and information")}
        >
          {products.map((p) => (
            <a key={p.name} href={p.url}>
              {p.name} ↗
            </a>
          ))}
          {["privacy", "legal"].map((id) => (
            <a key={id} href={pages[id][lang].path}>
              {pages[id][lang].label}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}
